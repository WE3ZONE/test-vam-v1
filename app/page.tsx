'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import { useApp } from '@/components/AppContext';

export default function HomePage() {
  const auth = useAuth();
  const app = useApp();
  const router = useRouter();

  function handleSell() {
    if (auth.isLoggedIn) {
      router.push('/new-ad');
    } else {
      auth.setPendingNavigation('/new-ad');
      auth.openLoginModal();
    }
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-16 px-4 bg-gradient-to-b from-divar-bg to-[#111] animate-fadeIn">
      <div className="max-w-3xl w-full text-center mt-8 md:mt-16">
        <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
          خرید و فروش <span className="text-divar-primary">امن</span> امتیاز وام
        </h1>
        <p className="text-divar-muted text-lg md:text-xl mb-12 leading-relaxed">
          پلتفرم واسطه‌گری مالی (معامله امن) برای اتصال فروشندگان امتیاز وام و خریداران. با تضمین امنیت معامله، امتیاز وام خود را نقد کنید یا وام مورد نیاز خود را بخرید.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link
            href="/listings"
            className="bg-divar-surface border border-divar-border hover:bg-divar-surfaceHover text-white px-8 py-4 rounded-xl font-bold transition flex items-center justify-center gap-3 text-lg w-full sm:w-auto shadow-lg"
          >
            <i className="fa-solid fa-magnifying-glass" />
            خرید امتیاز وام
          </Link>
          <button
            onClick={handleSell}
            className="bg-divar-primary hover:bg-divar-primaryHover text-white px-8 py-4 rounded-xl font-bold transition flex items-center justify-center gap-3 text-lg shadow-lg shadow-red-900/30 w-full sm:w-auto"
          >
            <i className="fa-solid fa-tags" />
            فروش امتیاز وام
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-divar-border pt-10">
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">+{app.users.filter(u => u.kycStatus === 'verified').length * 2500}</div>
            <div className="text-xs text-divar-muted">کاربر احراز هویت شده</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">{app.listings.filter(l => l.status === 'published').length} آگهی</div>
            <div className="text-xs text-divar-muted">آگهی فعال</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-brand-500 mb-1">معامله امن</div>
            <div className="text-xs text-divar-muted">تضمین پرداخت امن</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">{app.transactions.filter(t => t.status === 'completed').length}+</div>
            <div className="text-xs text-divar-muted">معامله موفق</div>
          </div>
        </div>
      </div>
    </div>
  );
}
