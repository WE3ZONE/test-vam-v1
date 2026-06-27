'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthContext';
import { useApp } from '@/components/AppContext';
import { useAlert } from '@/components/AlertModal';
import FavoriteButton from '@/components/FavoriteButton';
import EscrowModal from '@/components/EscrowModal';
import ListingCard from '@/components/ListingCard';
import { loanTypeLabels } from '@/data/types';

export default function ListingDetailPage() {
  const { id } = useParams();
  const auth = useAuth();
  const app = useApp();
  const alert = useAlert();
  const [escrowOpen, setEscrowOpen] = useState(false);

  const foundListing = app.listings.find(l => l.id === Number(id));

  if (!foundListing) return <div className="p-8 text-center text-divar-muted">آگهی یافت نشد</div>;

  const listing = foundListing;

  const seller = app.getUserById(listing.sellerId);

  const similarListings = app.listings
    .filter(l => l.id !== listing.id && l.status === 'published' && (l.bank === listing.bank || l.loanType === listing.loanType))
    .slice(0, 3);

  function handlePurchase() {
    if (!auth.isLoggedIn) {
      auth.setPendingNavigation(`/listings/${listing.id}`);
      auth.openLoginModal();
      return;
    }
    setEscrowOpen(true);
  }

  const specRows = [
    { icon: 'fa-money-bill-wave', label: 'مبلغ وام', value: `${listing.amount} تومان` },
    { icon: 'fa-calendar-days', label: 'تعداد اقساط', value: `${listing.installments} ماهه` },
    { icon: 'fa-percent', label: 'نرخ سود', value: listing.interest },
    { icon: 'fa-clock', label: 'مدت بازپرداخت', value: listing.duration },
    { icon: 'fa-user-tie', label: 'شرایط ضامن', value: listing.guarantorRequirements || 'اعلام نشده' },
  ];

  return (
    <div className="max-w-[1024px] mx-auto w-full px-4 py-4 md:py-8 animate-fadeIn">
      {/* Back link */}
      <Link href="/listings" className="cursor-pointer text-divar-muted hover:text-brand-500 transition-all duration-200 flex items-center gap-2 mb-5 md:mb-6 w-fit text-sm group">
        <i className="fa-solid fa-arrow-right group-hover:-translate-x-0.5 transition-transform duration-200" />
        بازگشت به آگهی‌ها
      </Link>

      {/* Hero section */}
      <div className="bg-divar-surface border border-divar-border rounded-2xl p-5 md:p-7 mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-5">
          {/* Bank icon */}
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center flex-shrink-0">
            <i className="fa-solid fa-building-columns text-brand-500 text-xl md:text-2xl" />
          </div>
          {/* Title + badges */}
          <div className="flex-1 min-w-0">
            <h1 className="text-lg md:text-2xl font-bold text-divar-text mb-3 leading-relaxed">
              امتیاز وام {listing.amount} تومانی {listing.bank} با کارمزد {listing.interest}
            </h1>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-brand-500/10 text-brand-500 border border-brand-500/20 px-3 py-1 rounded-xl text-xs font-bold">
                {listing.bank}
              </span>
              <span className="bg-divar-bg text-divar-muted border border-divar-border px-2.5 py-1 rounded-xl text-[11px]">
                {loanTypeLabels[listing.loanType]}
              </span>
              <span className="text-[11px] text-divar-muted flex items-center gap-1">
                <i className="fa-regular fa-clock" /> ۲ ساعت پیش در {listing.location}
              </span>
              <span className="bg-divar-bg text-divar-text border border-divar-border px-2.5 py-1 rounded-lg text-[10px]">
                شناسه: L-{listing.id}
              </span>
              {listing.views > 0 && (
                <span className="text-[10px] text-divar-muted flex items-center gap-1">
                  <i className="fa-regular fa-eye" />{listing.views} بازدید
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main layout: content + action box */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left content */}
        <div className="flex-1 order-2 lg:order-1 min-w-0 space-y-6">

          {/* Spec table */}
          <div className="bg-divar-surface border border-divar-border rounded-2xl overflow-hidden shadow-sm">
            <div className="px-5 py-3.5 border-b border-divar-border">
              <h3 className="text-sm font-bold text-divar-text flex items-center gap-2">
                <i className="fa-solid fa-list-check text-brand-500 text-xs" />
                مشخصات وام
              </h3>
            </div>
            {specRows.map((row, i) => (
              <div key={row.label} className={`grid grid-cols-[110px_1fr] md:grid-cols-[180px_1fr] border-b border-divar-border last:border-0 transition-all duration-200 hover:bg-divar-surfaceHover ${i % 2 === 0 ? 'bg-divar-bg' : 'bg-divar-surface'}`}>
                <div className="p-3.5 md:p-4 text-xs md:text-sm text-divar-muted flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-divar-surface flex items-center justify-center flex-shrink-0">
                    <i className={`fa-solid ${row.icon} text-[10px] text-divar-muted`} />
                  </div>
                  {row.label}
                </div>
                <div className="p-3.5 md:p-4 text-xs md:text-sm text-divar-text font-medium flex items-center">{row.value}</div>
              </div>
            ))}
            {/* Status row */}
            <div className="grid grid-cols-[110px_1fr] md:grid-cols-[180px_1fr] bg-brand-500/5">
              <div className="p-3.5 md:p-4 text-xs md:text-sm text-divar-muted flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-divar-surface flex items-center justify-center flex-shrink-0">
                  <i className="fa-solid fa-shield-check text-[10px] text-divar-muted" />
                </div>
                وضعیت
              </div>
              <div className="p-3.5 md:p-4 text-xs md:text-sm text-brand-500 font-bold flex items-center gap-2">
                <i className="fa-solid fa-check-circle" /> تایید شده توسط اپراتور
              </div>
            </div>
          </div>

          {/* Seller info */}
          {seller && (
            <div className="bg-divar-surface border border-divar-border rounded-2xl p-4 md:p-5 shadow-sm">
              <h3 className="text-sm font-bold text-divar-text mb-3.5 flex items-center gap-2">
                <i className="fa-solid fa-user-check text-brand-500 text-xs" />
                اطلاعات فروشنده
              </h3>
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500/20 to-brand-600/10 border border-brand-500/20 flex items-center justify-center text-brand-500">
                  <i className="fa-solid fa-user text-lg" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-divar-text font-semibold mb-1">فروشنده احراز هویت شده</div>
                  <div className="text-[11px] text-divar-muted flex items-center gap-3 flex-wrap">
                    <span className="flex items-center gap-1"><i className="fa-solid fa-location-dot" /> {listing.location}</span>
                    <span className="text-brand-500 flex items-center gap-1 font-medium"><i className="fa-solid fa-shield-check" /> تایید شده</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="bg-divar-surface border border-divar-border rounded-2xl p-5 md:p-6 shadow-sm">
            <h3 className="text-sm md:text-base font-bold text-divar-text mb-3.5 flex items-center gap-2">
              <i className="fa-solid fa-align-right text-brand-500 text-xs" />
              توضیحات فروشنده
            </h3>
            <p className="text-xs md:text-sm text-divar-text leading-loose whitespace-pre-line bg-divar-bg p-4 md:p-5 rounded-xl border border-divar-border">
              {listing.description}
            </p>
          </div>

          {/* Security warning */}
          <div className="bg-red-500/5 border border-red-500/15 rounded-2xl p-4 md:p-5 flex gap-3.5 items-start shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <i className="fa-solid fa-triangle-exclamation text-red-500 text-base" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-red-500 text-xs md:text-sm font-bold mb-1.5">هشدار امنیتی</p>
              <p className="text-[11px] md:text-xs text-divar-text leading-relaxed">
                برای جلوگیری از کلاهبرداری، از سیستم <b>معامله امن</b> استفاده کنید. پلتفرم در قبال واریز مستقیم مسئولیتی ندارد.
              </p>
            </div>
          </div>
        </div>

        {/* Action Box */}
        <div className="w-full lg:w-80 order-1 lg:order-2 flex-shrink-0">
          <div className="bg-divar-surface border border-divar-border rounded-2xl p-5 md:p-6 lg:sticky lg:top-24 shadow-sm hover:shadow-lg transition-all duration-200">
            {/* Price section */}
            <div className="mb-5 text-center lg:text-right">
              <div className="text-xs text-divar-muted mb-2 flex items-center gap-1.5 justify-center lg:justify-start">
                <i className="fa-solid fa-tag text-[10px]" />
                قیمت پیشنهادی فروشنده
              </div>
              <div className="text-2xl md:text-3xl font-black text-divar-text tracking-tight">
                {listing.price}
                <span className="text-xs md:text-sm font-normal text-divar-muted mr-1.5">تومان</span>
              </div>
            </div>

            <div className="h-px bg-divar-border mb-5" />

            {/* Security guarantee badge */}
            <div className="bg-brand-500/5 border border-brand-500/15 rounded-xl p-3.5 mb-5">
              <div className="flex items-center gap-2 text-brand-500 text-xs font-bold mb-1.5">
                <div className="w-6 h-6 rounded-lg bg-brand-500/10 flex items-center justify-center">
                  <i className="fa-solid fa-shield-check text-[10px]" />
                </div>
                تضمین امنیت معامله
              </div>
              <p className="text-[10px] text-divar-muted leading-relaxed pr-8">وجه شما تا تایید نهایی انتقال بلوکه می‌ماند.</p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-3">
              <button onClick={handlePurchase} className="cursor-pointer w-full bg-brand-600 hover:bg-brand-500 text-white py-3.5 rounded-xl font-bold transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-xs md:text-sm active:scale-[0.98]">
                <i className="fa-solid fa-cart-shopping text-xs" />
                ثبت درخواست خرید امن
              </button>
              <button
                onClick={() => alert.showAlert('تماس با فروشنده', 'برای حفظ امنیت، ابتدا درخواست خرید ثبت کنید تا اپراتور هماهنگی‌های لازم را انجام دهد.')}
                className="cursor-pointer w-full bg-divar-bg border border-divar-border hover:bg-divar-surfaceHover text-divar-text py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 text-xs md:text-sm hover:shadow-sm"
              >
                <i className="fa-solid fa-phone text-xs" /> اطلاعات تماس
              </button>
            </div>

            {/* Quick actions */}
            <div className="mt-5 flex justify-center gap-2 border-t border-divar-border pt-4">
              <div className="hover:bg-divar-surfaceHover rounded-xl p-2 transition-all duration-200">
                <FavoriteButton listingId={listing.id} />
              </div>
              <button className="cursor-pointer hover:bg-divar-surfaceHover rounded-xl p-2 text-divar-muted hover:text-brand-500 transition-all duration-200" title="اشتراک‌گذاری">
                <i className="fa-solid fa-share-nodes text-lg" />
              </button>
              <button onClick={() => alert.showAlert('گزارش ثبت شد', 'گزارش شما درباره این آگهی ثبت شد و توسط تیم پشتیبانی بررسی خواهد شد.', 'success')} className="cursor-pointer hover:bg-red-500/10 rounded-xl p-2 text-divar-muted hover:text-red-500 transition-all duration-200" title="گزارش">
                <i className="fa-regular fa-flag text-lg" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Listings */}
      {similarListings.length > 0 && (
        <div className="mt-10">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-xl bg-brand-500/10 flex items-center justify-center">
              <i className="fa-solid fa-grip text-brand-500 text-sm" />
            </div>
            <h2 className="text-base md:text-lg font-bold text-divar-text">آگهی‌های مشابه</h2>
          </div>
          {/* Horizontal scroll on mobile, grid on desktop */}
          <div className="flex md:grid md:grid-cols-3 gap-4 overflow-x-auto pb-2 md:pb-0 scrollbar-hide snap-x snap-mandatory md:snap-none">
            {similarListings.map(l => (
              <div key={l.id} className="min-w-[280px] md:min-w-0 snap-start">
                <ListingCard ad={l} />
              </div>
            ))}
          </div>
        </div>
      )}

      <EscrowModal listing={listing} open={escrowOpen} onClose={() => setEscrowOpen(false)} />
    </div>
  );
}
