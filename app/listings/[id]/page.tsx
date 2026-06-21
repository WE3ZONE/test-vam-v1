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

  return (
    <div className="max-w-[1024px] mx-auto w-full px-4 py-4 md:py-8 animate-fadeIn">
      <Link href="/listings" className="text-divar-muted hover:text-white transition flex items-center gap-2 mb-4 md:mb-6 w-fit text-sm">
        <i className="fa-solid fa-arrow-right" />
        بازگشت به آگهی‌ها
      </Link>

      <div className="bg-divar-surface border border-divar-border rounded-xl p-4 md:p-8 shadow-xl flex flex-col lg:flex-row gap-6 md:gap-8">
        <div className="flex-1 order-2 lg:order-1 min-w-0">
          <div className="flex items-center gap-2 md:gap-3 mb-4 flex-wrap">
            <span className="bg-blue-900/50 text-blue-400 border border-blue-800 px-2 md:px-3 py-1 rounded-md text-xs font-bold">{listing.bank}</span>
            <span className="bg-divar-bg text-divar-muted border border-divar-border px-2 py-1 rounded-md text-[10px]">{loanTypeLabels[listing.loanType]}</span>
            <span className="text-[11px] md:text-xs text-divar-muted flex items-center gap-1">
              <i className="fa-regular fa-clock" /> ۲ ساعت پیش در {listing.location}
            </span>
            <span className="bg-gray-800 text-gray-300 border border-gray-700 px-2 py-1 rounded text-[10px]">شناسه: L-{listing.id}</span>
            {listing.views > 0 && <span className="text-[10px] text-divar-muted"><i className="fa-regular fa-eye ml-1" />{listing.views} بازدید</span>}
          </div>

          <h1 className="text-xl md:text-3xl font-bold text-white mb-6 md:mb-8 leading-relaxed">
            امتیاز وام {listing.amount} تومانی {listing.bank} با کارمزد {listing.interest}
          </h1>

          <div className="border border-divar-border rounded-xl overflow-hidden mb-6 md:mb-8">
            {[
              { icon: 'fa-money-bill-wave', label: 'مبلغ وام', value: `${listing.amount} تومان` },
              { icon: 'fa-calendar-days', label: 'تعداد اقساط', value: `${listing.installments} ماهه` },
              { icon: 'fa-percent', label: 'نرخ سود', value: listing.interest },
              { icon: 'fa-clock', label: 'مدت بازپرداخت', value: listing.duration },
              { icon: 'fa-user-tie', label: 'شرایط ضامن', value: listing.guarantorRequirements || 'اعلام نشده' },
            ].map(row => (
              <div key={row.label} className="grid grid-cols-[120px_1fr] md:grid-cols-2 border-b border-divar-border last:border-0">
                <div className="p-3 md:p-4 bg-divar-bg text-xs md:text-sm text-divar-muted flex items-center gap-2"><i className={`fa-solid ${row.icon} w-4`} /> {row.label}</div>
                <div className="p-3 md:p-4 bg-divar-surface text-xs md:text-sm text-white font-medium">{row.value}</div>
              </div>
            ))}
            <div className="grid grid-cols-[120px_1fr] md:grid-cols-2">
              <div className="p-3 md:p-4 bg-divar-bg text-xs md:text-sm text-divar-muted flex items-center gap-2"><i className="fa-solid fa-shield-check w-4" /> وضعیت</div>
              <div className="p-3 md:p-4 bg-divar-surface text-xs md:text-sm text-brand-400 font-bold flex items-center gap-2">
                <i className="fa-solid fa-check-circle" /> تایید شده توسط اپراتور
              </div>
            </div>
          </div>

          {/* Seller info */}
          {seller && (
            <div className="bg-divar-bg border border-divar-border rounded-xl p-4 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-divar-surface border border-divar-border flex items-center justify-center text-divar-muted">
                <i className="fa-solid fa-user" />
              </div>
              <div>
                <div className="text-sm text-white font-medium">فروشنده احراز هویت شده</div>
                <div className="text-[11px] text-divar-muted flex items-center gap-2">
                  <span><i className="fa-solid fa-location-dot ml-1" />{listing.location}</span>
                  <span className="text-green-400 flex items-center gap-1"><i className="fa-solid fa-shield-check" /> تایید شده</span>
                </div>
              </div>
            </div>
          )}

          <h3 className="text-base md:text-lg font-bold text-white mb-3 flex items-center gap-2">
            <i className="fa-solid fa-align-right text-divar-muted" /> توضیحات فروشنده
          </h3>
          <p className="text-xs md:text-sm text-gray-300 leading-loose whitespace-pre-line mb-6 bg-divar-bg p-4 md:p-5 rounded-xl border border-divar-border">
            {listing.description}
          </p>

          <div className="bg-red-900/10 border border-red-900/30 rounded-xl p-4 md:p-5 flex gap-3 md:gap-4 items-start">
            <i className="fa-solid fa-triangle-exclamation text-red-500 mt-1 text-lg md:text-xl flex-shrink-0" />
            <p className="text-[11px] md:text-xs text-gray-300 leading-relaxed">
              <strong className="text-red-400 block mb-1 text-xs md:text-sm">هشدار امنیتی:</strong>
              برای جلوگیری از کلاهبرداری، از سیستم <b>معامله امن</b> استفاده کنید. پلتفرم در قبال واریز مستقیم مسئولیتی ندارد.
            </p>
          </div>
        </div>

        {/* Action Box */}
        <div className="w-full lg:w-80 order-1 lg:order-2 flex-shrink-0">
          <div className="bg-divar-bg border border-divar-border rounded-xl p-5 md:p-6 lg:sticky lg:top-24 shadow-xl">
            <div className="mb-4 md:mb-6 text-center lg:text-right">
              <div className="text-xs text-divar-muted mb-1">قیمت پیشنهادی فروشنده:</div>
              <div className="text-2xl md:text-3xl font-black text-white tracking-tight">
                {listing.price} <span className="text-xs md:text-sm font-normal text-divar-muted">تومان</span>
              </div>
              {listing.suggestedPrice && (
                <div className="text-[10px] text-divar-muted mt-1">پیشنهاد سیستم: {listing.suggestedPrice} تومان</div>
              )}
            </div>

            <hr className="border-divar-border my-4" />

            <div className="bg-brand-900/10 border border-brand-900/30 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2 text-brand-400 text-xs font-bold mb-1">
                <i className="fa-solid fa-shield-check" /> تضمین امنیت معامله
              </div>
              <p className="text-[10px] text-gray-400 leading-relaxed">وجه شما تا تایید نهایی انتقال بلوکه می‌ماند.</p>
            </div>

            <div className="flex flex-col gap-3">
              <button onClick={handlePurchase} className="w-full bg-brand-600 hover:bg-brand-500 text-white py-3 rounded-lg font-bold transition shadow-lg flex items-center justify-center gap-2 text-xs md:text-sm">
                ثبت درخواست خرید امن
              </button>
              <button
                onClick={() => alert.showAlert('تماس با فروشنده', 'برای حفظ امنیت، ابتدا درخواست خرید ثبت کنید تا اپراتور هماهنگی‌های لازم را انجام دهد.')}
                className="w-full bg-divar-surface border border-divar-border hover:bg-gray-700 text-white py-3 rounded-lg font-medium transition flex items-center justify-center gap-2 text-xs md:text-sm"
              >
                <i className="fa-solid fa-phone" /> اطلاعات تماس
              </button>
            </div>

            <div className="mt-4 flex justify-center gap-6 text-divar-muted text-lg border-t border-divar-border pt-4">
              <FavoriteButton listingId={listing.id} />
              <button className="hover:text-white transition transform hover:scale-110" title="اشتراک‌گذاری"><i className="fa-solid fa-share-nodes" /></button>
              <button className="hover:text-red-500 transition transform hover:scale-110" title="گزارش"><i className="fa-regular fa-flag" /></button>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Listings */}
      {similarListings.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <i className="fa-solid fa-grip text-divar-muted" /> آگهی‌های مشابه
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {similarListings.map(l => <ListingCard key={l.id} ad={l} />)}
          </div>
        </div>
      )}

      <EscrowModal listing={listing} open={escrowOpen} onClose={() => setEscrowOpen(false)} />
    </div>
  );
}
