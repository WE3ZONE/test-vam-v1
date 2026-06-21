'use client';

import { useState, useMemo } from 'react';
import ListingCard from '@/components/ListingCard';
import { useAuth } from '@/components/AuthContext';
import { useApp } from '@/components/AppContext';
import { LoanType, loanTypeLabels } from '@/data/types';

const bankFilters = [
  { label: 'رسالت (قرض‌الحسنه)', match: 'رسالت' },
  { label: 'مهر ایران', match: 'مهر ایران' },
  { label: 'وام مسکن / اوراق', match: 'وام مسکن' },
  { label: 'وام ازدواج / فرزندآوری', match: 'وام ازدواج' },
  { label: 'بانک ملت', match: 'بانک ملت' },
];

const loanTypes: { value: LoanType; label: string }[] = [
  { value: 'gharz_hasaneh', label: 'قرض‌الحسنه' },
  { value: 'ezdevaj', label: 'ازدواج' },
  { value: 'farzandavari', label: 'فرزندآوری' },
  { value: 'maskan', label: 'مسکن' },
  { value: 'tejari', label: 'تجاری' },
];

function persianToLatin(str: string) {
  return str.replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)));
}

function parseAmount(str: string): number {
  const latin = persianToLatin(str);
  const digits = latin.replace(/[^0-9]/g, '');
  return digits ? parseInt(digits, 10) : 0;
}

type SortOption = 'newest' | 'cheapest' | 'highest';

export default function ListingsPage() {
  const auth = useAuth();
  const app = useApp();
  const [search, setSearch] = useState('');
  const [selectedBanks, setSelectedBanks] = useState<Set<string>>(() => new Set(bankFilters.map(b => b.match)));
  const [selectedLoanType, setSelectedLoanType] = useState<LoanType | ''>('');
  const [urgentOnly, setUrgentOnly] = useState(false);
  const [sort, setSort] = useState<SortOption>('newest');
  const [filtersOpen, setFiltersOpen] = useState(false);

  function toggleBank(match: string) {
    setSelectedBanks(prev => {
      const next = new Set(prev);
      if (next.has(match)) next.delete(match);
      else next.add(match);
      return next;
    });
  }

  function clearFilters() {
    setSelectedBanks(new Set(bankFilters.map(b => b.match)));
    setSelectedLoanType('');
    setUrgentOnly(false);
    setSearch('');
  }

  const filtered = useMemo(() => {
    let results = app.listings.filter(ad => {
      if (ad.status !== 'published') return false;
      if (selectedBanks.size > 0 && !Array.from(selectedBanks).some(b => ad.bank.includes(b))) return false;
      if (auth.selectedCities.size > 0 && !auth.selectedCities.has(ad.location)) return false;
      if (selectedLoanType && ad.loanType !== selectedLoanType) return false;
      if (urgentOnly && !ad.urgent) return false;
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const haystack = `${ad.bank} ${ad.location} ${ad.amount} ${ad.id} ${loanTypeLabels[ad.loanType]}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    if (sort === 'cheapest') {
      results = [...results].sort((a, b) => parseAmount(a.price) - parseAmount(b.price));
    } else if (sort === 'highest') {
      results = [...results].sort((a, b) => parseAmount(b.amount) - parseAmount(a.amount));
    }

    return results;
  }, [search, selectedBanks, selectedLoanType, urgentOnly, sort, auth.selectedCities, app.listings]);

  const activeFilterCount = (bankFilters.length - selectedBanks.size) + (selectedLoanType ? 1 : 0) + (urgentOnly ? 1 : 0);

  const filterContent = (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-bold text-white text-lg">فیلترها</h2>
        <button onClick={clearFilters} className="text-xs text-divar-primary hover:text-red-400">حذف همه</button>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-medium text-divar-muted mb-3">بانک و موسسه</h3>
        <div className="space-y-3">
          {bankFilters.map(bank => (
            <label key={bank.match} className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" checked={selectedBanks.has(bank.match)} onChange={() => toggleBank(bank.match)} className="rounded bg-divar-bg border-divar-border text-divar-primary focus:ring-divar-primary cursor-pointer w-4 h-4" />
              <span className="text-sm text-divar-text group-hover:text-white">{bank.label}</span>
            </label>
          ))}
        </div>
      </div>

      <hr className="border-divar-border my-5" />

      <div className="mb-6">
        <h3 className="text-sm font-medium text-divar-muted mb-3">نوع وام</h3>
        <div className="flex flex-wrap gap-2">
          {loanTypes.map(lt => (
            <button
              key={lt.value}
              onClick={() => setSelectedLoanType(selectedLoanType === lt.value ? '' : lt.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition border ${
                selectedLoanType === lt.value
                  ? 'bg-brand-600 text-white border-brand-600'
                  : 'bg-divar-bg text-divar-muted border-divar-border hover:text-white'
              }`}
            >
              {lt.label}
            </button>
          ))}
        </div>
      </div>

      <hr className="border-divar-border my-5" />

      <div className="mb-4">
        <label className="flex items-center justify-between cursor-pointer group p-2 rounded-md hover:bg-divar-bg transition -mx-2">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-bolt text-yellow-500" />
            <span className="text-sm text-divar-text group-hover:text-white font-medium">فقط آگهی‌های فوری</span>
          </div>
          <div className="relative">
            <input type="checkbox" className="sr-only peer" checked={urgentOnly} onChange={e => setUrgentOnly(e.target.checked)} />
            <div className="w-9 h-5 bg-divar-bg border border-divar-border rounded-full peer peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-divar-muted after:border-gray-300 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-yellow-600 peer-checked:after:bg-white" />
          </div>
        </label>
      </div>

      <div className="mb-2">
        <label className="flex items-center justify-between cursor-pointer group p-2 rounded-md hover:bg-divar-bg transition -mx-2">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-shield-halved text-brand-500" />
            <span className="text-sm text-divar-text group-hover:text-white font-medium">فقط معامله امن</span>
          </div>
          <div className="relative">
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-9 h-5 bg-divar-bg border border-divar-border rounded-full peer peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-divar-muted after:border-gray-300 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-600 peer-checked:after:bg-white" />
          </div>
        </label>
      </div>
    </>
  );

  return (
    <>
    <div className="max-w-[1440px] mx-auto w-full px-4 py-4 md:py-6 flex flex-col md:flex-row gap-6 animate-fadeIn">
      <aside className="hidden md:block w-72 flex-shrink-0 bg-divar-surface border border-divar-border rounded-xl p-5 h-fit sticky top-24 shadow-lg">
        {filterContent}
      </aside>

      <section className="flex-1 min-w-0">
        <div className="mb-4 md:mb-6 relative">
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="جستجو بر اساس نام بانک، نوع وام، شناسه آگهی یا شهر..." className="w-full bg-divar-surface border border-divar-border text-white rounded-xl py-3 md:py-4 px-4 md:px-5 pl-12 focus:outline-none focus:border-divar-primary transition shadow-md text-sm md:text-base" />
          <i className="fa-solid fa-magnifying-glass absolute left-4 md:left-5 top-1/2 transform -translate-y-1/2 text-divar-muted text-base md:text-lg" />
        </div>

        <div className="flex md:hidden items-center gap-2 mb-4">
          <button onClick={() => setFiltersOpen(true)} className="flex items-center gap-2 bg-divar-surface border border-divar-border text-white px-4 py-2.5 rounded-lg text-sm font-medium transition hover:bg-divar-surfaceHover">
            <i className="fa-solid fa-sliders" />
            فیلترها
            {activeFilterCount > 0 && <span className="bg-divar-primary text-white w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold">{activeFilterCount}</span>}
          </button>
          <select value={sort} onChange={e => setSort(e.target.value as SortOption)} className="bg-divar-surface border border-divar-border text-white text-xs rounded-lg px-3 py-2.5 outline-none flex-1">
            <option value="newest">جدیدترین</option>
            <option value="cheapest">ارزان‌ترین</option>
            <option value="highest">بالاترین مبلغ</option>
          </select>
        </div>

        <div className="hidden md:flex items-center justify-between mb-4 gap-4">
          <h1 className="text-sm text-divar-muted">{filtered.length > 0 ? `نمایش ${filtered.length} آگهی` : 'آگهی‌ای یافت نشد'}</h1>
          <select value={sort} onChange={e => setSort(e.target.value as SortOption)} className="bg-divar-surface border border-divar-border text-white text-xs rounded-md px-3 py-2 outline-none">
            <option value="newest">جدیدترین</option>
            <option value="cheapest">ارزان‌ترین پیشنهاد فروش</option>
            <option value="highest">بالاترین مبلغ وام</option>
          </select>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
            {filtered.map(ad => <ListingCard key={ad.id} ad={ad} />)}
          </div>
        ) : (
          <div className="bg-divar-surface border border-divar-border rounded-xl p-12 text-center">
            <i className="fa-solid fa-magnifying-glass text-4xl text-divar-muted mb-4" />
            <p className="text-divar-muted text-sm">آگهی‌ای با این مشخصات یافت نشد.</p>
            <button onClick={clearFilters} className="text-brand-400 text-sm mt-3 hover:underline">حذف فیلترها</button>
          </div>
        )}
      </section>
    </div>

    {filtersOpen && (
      <>
        <div className="fixed inset-0 bg-black/60 z-50 md:hidden" onClick={() => setFiltersOpen(false)} />
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-divar-surface border-t border-divar-border rounded-t-2xl p-5 pb-8 max-h-[80vh] overflow-y-auto animate-slideUp">
          <div className="w-10 h-1 bg-divar-border rounded-full mx-auto mb-4 cursor-pointer" onClick={() => setFiltersOpen(false)} />
          {filterContent}
          <button onClick={() => setFiltersOpen(false)} className="w-full bg-brand-600 hover:bg-brand-500 text-white py-3 rounded-lg mt-6 text-sm font-bold transition">
            مشاهده {filtered.length} نتیجه
          </button>
        </div>
      </>
    )}
    </>
  );
}
