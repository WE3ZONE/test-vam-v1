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
  { label: 'صندوق جاویدان', match: 'جاویدان' },
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
      {/* Filter header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-divar-border">
        <h2 className="font-bold text-divar-text text-base flex items-center gap-2">
          <i className="fa-solid fa-filter text-brand-500 text-sm" />
          فیلترها
        </h2>
        <button onClick={clearFilters} className="cursor-pointer text-xs text-red-400 hover:text-red-300 transition-all duration-200 flex items-center gap-1">
          <i className="fa-solid fa-trash-can text-[10px]" />
          حذف همه
        </button>
      </div>

      {/* Bank filters */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-divar-muted mb-3 tracking-wide">بانک و موسسه</h3>
        <div className="space-y-1">
          {bankFilters.map(bank => (
            <label key={bank.match} className="flex items-center gap-3 cursor-pointer group p-2 rounded-xl hover:bg-divar-surfaceHover transition-all duration-200">
              <input type="checkbox" checked={selectedBanks.has(bank.match)} onChange={() => toggleBank(bank.match)} className="rounded bg-divar-bg border-divar-border text-brand-500 focus:ring-brand-500 cursor-pointer w-4 h-4 flex-shrink-0" />
              <span className="text-sm text-divar-text group-hover:text-brand-500 transition-all duration-200">{bank.label}</span>
            </label>
          ))}
        </div>
      </div>

      <hr className="border-divar-border my-5" />

      {/* Loan type filters */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-divar-muted mb-3 tracking-wide">نوع وام</h3>
        <div className="flex flex-wrap gap-2">
          {loanTypes.map(lt => (
            <button
              key={lt.value}
              onClick={() => setSelectedLoanType(selectedLoanType === lt.value ? '' : lt.value)}
              className={`cursor-pointer px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 border ${
                selectedLoanType === lt.value
                  ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                  : 'bg-divar-bg text-divar-muted border-divar-border hover:text-divar-text hover:border-brand-500/30 hover:bg-divar-surfaceHover'
              }`}
            >
              {lt.label}
            </button>
          ))}
        </div>
      </div>

      <hr className="border-divar-border my-5" />

      {/* Toggle switches */}
      <div className="space-y-1">
        <label className="flex items-center justify-between cursor-pointer group p-2.5 rounded-xl hover:bg-divar-surfaceHover transition-all duration-200">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-yellow-500/10 flex items-center justify-center">
              <i className="fa-solid fa-bolt text-yellow-500 text-xs" />
            </div>
            <span className="text-sm text-divar-text font-medium">فقط فوری</span>
          </div>
          <div className="relative">
            <input type="checkbox" className="sr-only peer" checked={urgentOnly} onChange={e => setUrgentOnly(e.target.checked)} />
            <div className="w-10 h-[22px] bg-divar-bg border border-divar-border rounded-full peer peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-divar-muted after:border-divar-border after:rounded-full after:h-[18px] after:w-[18px] after:transition-all duration-200 peer-checked:bg-yellow-500 peer-checked:after:bg-white peer-checked:border-yellow-500" />
          </div>
        </label>

        <label className="flex items-center justify-between cursor-pointer group p-2.5 rounded-xl hover:bg-divar-surfaceHover transition-all duration-200">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-brand-500/10 flex items-center justify-center">
              <i className="fa-solid fa-shield-halved text-brand-500 text-xs" />
            </div>
            <span className="text-sm text-divar-text font-medium">فقط معامله امن</span>
          </div>
          <div className="relative">
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-10 h-[22px] bg-divar-bg border border-divar-border rounded-full peer peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-divar-muted after:border-divar-border after:rounded-full after:h-[18px] after:w-[18px] after:transition-all duration-200 peer-checked:bg-brand-600 peer-checked:after:bg-white peer-checked:border-brand-600" />
          </div>
        </label>
      </div>
    </>
  );

  return (
    <>
    <div className="max-w-[1440px] mx-auto w-full px-4 py-4 md:py-6 flex flex-col md:flex-row gap-6 animate-fadeIn">
      {/* Desktop sidebar */}
      <aside className="hidden md:block w-72 flex-shrink-0">
        <div className="bg-divar-surface border border-divar-border rounded-2xl p-5 h-fit sticky top-24 shadow-sm hover:shadow-lg transition-all duration-200">
          {filterContent}
        </div>
      </aside>

      {/* Main content */}
      <section className="flex-1 min-w-0">
        {/* Search bar */}
        <div className="mb-5 relative group">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="جستجو بر اساس نام بانک، نوع وام، شناسه آگهی یا شهر..."
            className="w-full bg-divar-surface border border-divar-border text-divar-text rounded-2xl py-3.5 md:py-4 px-5 pl-12 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all duration-200 shadow-sm group-hover:shadow-md text-sm md:text-base placeholder:text-divar-muted"
          />
          <div className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-brand-500/10 flex items-center justify-center">
            <i className="fa-solid fa-magnifying-glass text-brand-500 text-sm" />
          </div>
        </div>

        {/* Horizontal loan type pill chips (desktop) */}
        <div className="hidden md:flex items-center gap-2 mb-5 overflow-x-auto pb-1 scrollbar-hide">
          <button
            onClick={() => setSelectedLoanType('')}
            className={`cursor-pointer flex-shrink-0 px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 border ${
              selectedLoanType === ''
                ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                : 'bg-divar-surface text-divar-muted border-divar-border hover:text-divar-text hover:border-brand-500/30 hover:bg-divar-surfaceHover'
            }`}
          >
            همه انواع
          </button>
          {loanTypes.map(lt => (
            <button
              key={lt.value}
              onClick={() => setSelectedLoanType(selectedLoanType === lt.value ? '' : lt.value)}
              className={`cursor-pointer flex-shrink-0 px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 border ${
                selectedLoanType === lt.value
                  ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                  : 'bg-divar-surface text-divar-muted border-divar-border hover:text-divar-text hover:border-brand-500/30 hover:bg-divar-surfaceHover'
              }`}
            >
              {lt.label}
            </button>
          ))}
        </div>

        {/* Mobile filter row */}
        <div className="flex md:hidden items-center gap-2 mb-4">
          <button onClick={() => setFiltersOpen(true)} className="cursor-pointer flex items-center gap-2 bg-divar-surface border border-divar-border text-divar-text px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-divar-surfaceHover hover:shadow-sm">
            <i className="fa-solid fa-sliders text-brand-500" />
            فیلترها
            {activeFilterCount > 0 && (
              <span className="bg-brand-600 text-white w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
          <select value={sort} onChange={e => setSort(e.target.value as SortOption)} className="cursor-pointer bg-divar-surface border border-divar-border text-divar-text text-xs rounded-xl px-3 py-2.5 outline-none flex-1 transition-all duration-200 focus:ring-2 focus:ring-brand-500/30">
            <option value="newest">جدیدترین</option>
            <option value="cheapest">ارزان‌ترین</option>
            <option value="highest">بالاترین مبلغ</option>
          </select>
        </div>

        {/* Mobile horizontal loan type pills */}
        <div className="flex md:hidden items-center gap-2 mb-4 overflow-x-auto pb-1 scrollbar-hide">
          <button
            onClick={() => setSelectedLoanType('')}
            className={`cursor-pointer flex-shrink-0 px-3.5 py-1.5 rounded-xl text-[11px] font-medium transition-all duration-200 border ${
              selectedLoanType === ''
                ? 'bg-brand-600 text-white border-brand-600'
                : 'bg-divar-surface text-divar-muted border-divar-border'
            }`}
          >
            همه
          </button>
          {loanTypes.map(lt => (
            <button
              key={lt.value}
              onClick={() => setSelectedLoanType(selectedLoanType === lt.value ? '' : lt.value)}
              className={`cursor-pointer flex-shrink-0 px-3.5 py-1.5 rounded-xl text-[11px] font-medium transition-all duration-200 border ${
                selectedLoanType === lt.value
                  ? 'bg-brand-600 text-white border-brand-600'
                  : 'bg-divar-surface text-divar-muted border-divar-border'
              }`}
            >
              {lt.label}
            </button>
          ))}
        </div>

        {/* Sort bar + result count (desktop) */}
        <div className="hidden md:flex items-center justify-between mb-4 gap-4">
          <div className="flex items-center gap-2">
            <span className="bg-brand-500/10 text-brand-500 text-xs font-bold px-3 py-1 rounded-lg">
              {filtered.length}
            </span>
            <h1 className="text-sm text-divar-muted">
              {filtered.length > 0 ? 'آگهی یافت شد' : 'آگهی‌ای یافت نشد'}
            </h1>
          </div>
          <select value={sort} onChange={e => setSort(e.target.value as SortOption)} className="cursor-pointer bg-divar-surface border border-divar-border text-divar-text text-xs rounded-xl px-4 py-2 outline-none transition-all duration-200 hover:shadow-sm focus:ring-2 focus:ring-brand-500/30">
            <option value="newest">جدیدترین</option>
            <option value="cheapest">ارزان‌ترین پیشنهاد فروش</option>
            <option value="highest">بالاترین مبلغ وام</option>
          </select>
        </div>

        {/* Listings grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(ad => <ListingCard key={ad.id} ad={ad} />)}
          </div>
        ) : (
          <div className="bg-divar-surface border border-divar-border rounded-2xl p-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-divar-bg mx-auto mb-4 flex items-center justify-center">
              <i className="fa-solid fa-magnifying-glass text-2xl text-divar-muted" />
            </div>
            <p className="text-divar-text text-sm font-medium mb-1">آگهی‌ای یافت نشد</p>
            <p className="text-divar-muted text-xs mb-4">فیلترها را تغییر دهید یا عبارت جستجو را اصلاح کنید</p>
            <button onClick={clearFilters} className="cursor-pointer bg-brand-600 hover:bg-brand-500 text-white text-sm px-5 py-2 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md">
              حذف فیلترها
            </button>
          </div>
        )}
      </section>
    </div>

    {/* Mobile filter bottom sheet */}
    {filtersOpen && (
      <>
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 md:hidden transition-all duration-200" onClick={() => setFiltersOpen(false)} />
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-divar-surface border-t border-divar-border rounded-t-3xl p-5 pb-8 max-h-[85vh] overflow-y-auto animate-slideUp shadow-2xl">
          {/* Drag handle */}
          <div className="w-12 h-1.5 bg-divar-border rounded-full mx-auto mb-5 cursor-pointer" onClick={() => setFiltersOpen(false)} />
          {filterContent}
          <button onClick={() => setFiltersOpen(false)} className="cursor-pointer w-full bg-brand-600 hover:bg-brand-500 text-white py-3.5 rounded-xl mt-6 text-sm font-bold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
            <i className="fa-solid fa-check text-xs" />
            مشاهده {filtered.length} نتیجه
          </button>
        </div>
      </>
    )}
    </>
  );
}
