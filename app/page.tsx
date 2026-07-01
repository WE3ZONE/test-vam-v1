'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import { useApp } from '@/components/AppContext';
import ListingCard from '@/components/ListingCard';

export default function HomePage() {
  const auth = useAuth();
  const app = useApp();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const featuredListings = app.listings
    .filter(l => l.status === 'published')
    .sort((a, b) => (b.urgent ? 1 : 0) - (a.urgent ? 1 : 0) || b.views - a.views)
    .slice(0, 6);

  function handleSell() {
    if (auth.isLoggedIn) {
      router.push('/new-ad');
    } else {
      auth.setPendingNavigation('/new-ad');
      auth.openLoginModal();
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/listings${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''}`);
  }

  const publishedCount = app.listings.filter(l => l.status === 'published').length;
  const completedCount = app.transactions.filter(t => t.status === 'completed').length;

  return (
    <div className="animate-fadeIn">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-divar-bg">
        <div className="absolute inset-0 bg-gradient-to-bl from-brand-900/20 via-transparent to-transparent dark:from-brand-900/10" />
        <div className="max-w-5xl mx-auto px-4 py-16 md:py-24 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 px-4 py-1.5 rounded-full text-xs font-medium mb-6">
              <i className="fa-solid fa-shield-check" />
              پلتفرم معامله امن امتیاز وام
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-divar-text mb-5 leading-tight">
              خرید و فروش{' '}
              <span className="text-brand-600 dark:text-brand-400">امن</span>
              {' '}امتیاز وام
            </h1>

            <p className="text-divar-muted text-base md:text-lg mb-8 leading-relaxed max-w-xl mx-auto">
              با تضمین امنیت معامله، امتیاز وام خود را نقد کنید یا وام مورد نیاز خود را پیدا کنید.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-8">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="جستجوی بانک، نوع وام یا شهر..."
                  className="w-full bg-divar-surface border border-divar-border text-divar-text rounded-2xl py-4 px-5 pl-14 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all shadow-lg text-sm md:text-base"
                />
                <button type="submit" className="absolute left-2 top-1/2 -translate-y-1/2 bg-brand-600 hover:bg-brand-700 text-white w-10 h-10 rounded-xl flex items-center justify-center transition-colors cursor-pointer">
                  <i className="fa-solid fa-magnifying-glass" />
                </button>
              </div>
            </form>

            {/* Quick action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/listings"
                className="bg-divar-surface border border-divar-border hover:border-brand-500/50 hover:shadow-lg text-divar-text px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <i className="fa-solid fa-magnifying-glass text-brand-500" />
                خرید امتیاز وام
              </Link>
              <button
                onClick={handleSell}
                className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-sm shadow-lg shadow-brand-600/20 cursor-pointer"
              >
                <i className="fa-solid fa-plus" />
                فروش امتیاز وام
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Stats */}
      <section className="border-y border-divar-border bg-divar-surface/50">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-brand-500/10 rounded-xl flex items-center justify-center mb-3">
                <i className="fa-solid fa-users text-brand-500 text-lg" />
              </div>
              <div className="text-xl md:text-2xl font-bold text-divar-text mb-0.5">+{app.users.filter(u => u.kycStatus === 'verified').length * 2500}</div>
              <div className="text-xs text-divar-muted">کاربر احراز هویت شده</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-blue-500/10 rounded-xl flex items-center justify-center mb-3">
                <i className="fa-solid fa-bullhorn text-blue-500 text-lg" />
              </div>
              <div className="text-xl md:text-2xl font-bold text-divar-text mb-0.5">{publishedCount}</div>
              <div className="text-xs text-divar-muted">آگهی فعال</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-green-500/10 rounded-xl flex items-center justify-center mb-3">
                <i className="fa-solid fa-handshake text-green-500 text-lg" />
              </div>
              <div className="text-xl md:text-2xl font-bold text-divar-text mb-0.5">{completedCount}+</div>
              <div className="text-xs text-divar-muted">معامله موفق</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-yellow-500/10 rounded-xl flex items-center justify-center mb-3">
                <i className="fa-solid fa-shield-check text-yellow-500 text-lg" />
              </div>
              <div className="text-xl md:text-2xl font-bold text-brand-600 dark:text-brand-400 mb-0.5">معامله امن</div>
              <div className="text-xs text-divar-muted">تضمین پرداخت</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-4 py-12 md:py-16">
        <h2 className="text-xl md:text-2xl font-bold text-divar-text text-center mb-10">چطور کار می‌کند؟</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: 'fa-magnifying-glass', title: 'جستجو و انتخاب', desc: 'آگهی‌های وام را بررسی کنید و آگهی مناسب خود را پیدا کنید.', step: '۱' },
            { icon: 'fa-shield-check', title: 'درخواست خرید امن', desc: 'با سیستم معامله امن، وجه شما تا تایید نهایی انتقال محافظت می‌شود.', step: '۲' },
            { icon: 'fa-check-circle', title: 'انتقال و تکمیل', desc: 'پس از انتقال امتیاز و تایید طرفین، وجه آزاد می‌شود.', step: '۳' },
          ].map(item => (
            <div key={item.step} className="bg-divar-surface border border-divar-border rounded-2xl p-6 text-center hover:border-brand-500/30 hover:shadow-lg transition-all cursor-default group">
              <div className="relative w-14 h-14 mx-auto mb-4">
                <div className="w-14 h-14 bg-brand-500/10 rounded-2xl flex items-center justify-center group-hover:bg-brand-500/20 transition-colors">
                  <i className={`fa-solid ${item.icon} text-brand-500 text-xl`} />
                </div>
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-brand-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{item.step}</span>
              </div>
              <h3 className="text-base font-bold text-divar-text mb-2">{item.title}</h3>
              <p className="text-xs text-divar-muted leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Listings */}
      {featuredListings.length > 0 && (
        <section className="bg-divar-surface/50 border-t border-divar-border py-12 md:py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-divar-text mb-1">آگهی‌های ویژه</h2>
                <p className="text-xs text-divar-muted">جدیدترین و پربازدیدترین آگهی‌ها</p>
              </div>
              <Link href="/listings" className="text-brand-500 text-sm hover:underline flex items-center gap-1 cursor-pointer">
                مشاهده همه <i className="fa-solid fa-chevron-left text-xs" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredListings.map(ad => (
                <ListingCard key={ad.id} ad={ad} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Dual CTA Section: Seller + Radar */}
      <section className="max-w-5xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Seller CTA */}
          <div className="bg-gradient-to-bl from-brand-600 to-brand-700 rounded-2xl p-7 text-white relative overflow-hidden">
            <div className="absolute -left-6 -bottom-6 w-28 h-28 bg-white/5 rounded-full" />
            <div className="absolute -left-2 -bottom-2 w-16 h-16 bg-white/5 rounded-full" />
            <div className="relative">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                <i className="fa-solid fa-tags text-white text-lg" />
              </div>
              <h2 className="text-xl font-black mb-2 leading-tight">امتیاز وام دارید؟</h2>
              <p className="text-sm text-white/80 mb-5 leading-relaxed">آگهی رایگان ثبت کنید و به هزاران خریدار دسترسی پیدا کنید.</p>
              <button
                onClick={handleSell}
                className="bg-white text-brand-700 px-6 py-2.5 rounded-xl font-bold hover:bg-white/90 transition-colors shadow-lg cursor-pointer text-sm"
              >
                ثبت آگهی رایگان
              </button>
            </div>
          </div>

          {/* Radar CTA */}
          <div className="bg-divar-surface border border-divar-border rounded-2xl p-7 relative overflow-hidden hover:border-brand-500/30 transition-colors">
            <div className="absolute -left-6 -bottom-6 w-28 h-28 bg-brand-500/5 rounded-full" />
            <div className="absolute -left-2 -bottom-2 w-16 h-16 bg-brand-500/5 rounded-full" />
            <div className="relative">
              <div className="w-10 h-10 bg-brand-500/10 rounded-xl flex items-center justify-center mb-4">
                <i className="fa-solid fa-satellite-dish text-brand-500 text-lg" />
              </div>
              <h2 className="text-xl font-black text-divar-text mb-2 leading-tight">دنبال وام می‌گردید؟</h2>
              <p className="text-sm text-divar-muted mb-5 leading-relaxed">معیارهای وام مورد نظرتان را در رادار ثبت کنید تا به محض انتشار آگهی مشابه خبرتان کنیم.</p>
              <button
                onClick={() => {
                  if (auth.isLoggedIn) {
                    router.push('/dashboard');
                  } else {
                    auth.setPendingNavigation('/dashboard');
                    auth.openLoginModal();
                  }
                }}
                className="bg-brand-600 hover:bg-brand-500 text-white px-6 py-2.5 rounded-xl font-bold transition-colors shadow-lg shadow-brand-600/20 cursor-pointer text-sm flex items-center gap-2"
              >
                <i className="fa-solid fa-satellite-dish text-xs" />
                فعال‌سازی رادار
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
