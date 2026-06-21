'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthContext';
import { useAlert } from '@/components/AlertModal';

function formatNumber(value: string): string {
  const digits = value.replace(/[^0-9]/g, '');
  if (!digits) return '';
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function toTomanText(value: string): string {
  const digits = value.replace(/[^0-9]/g, '');
  if (!digits) return '';
  const num = parseInt(digits, 10);
  if (num >= 1_000_000_000) {
    const b = num / 1_000_000_000;
    return Number.isInteger(b) ? `${b} میلیارد تومان` : `${b.toFixed(1)} میلیارد تومان`;
  }
  if (num >= 1_000_000) {
    const m = num / 1_000_000;
    return Number.isInteger(m) ? `${m} میلیون تومان` : `${m.toFixed(1)} میلیون تومان`;
  }
  if (num >= 1_000) {
    const k = num / 1_000;
    return Number.isInteger(k) ? `${k} هزار تومان` : `${k.toFixed(1)} هزار تومان`;
  }
  return `${num} تومان`;
}

export default function NewAdPage() {
  const auth = useAuth();
  const alert = useAlert();
  const router = useRouter();
  const [loanAmount, setLoanAmount] = useState('');
  const [sellPrice, setSellPrice] = useState('');

  useEffect(() => {
    if (!auth.isLoggedIn) {
      auth.setPendingNavigation('/new-ad');
      auth.openLoginModal();
    }
  }, [auth.isLoggedIn]);

  function handleAmountChange(value: string, setter: (v: string) => void) {
    setter(formatNumber(value));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    alert.showAlert('ثبت موفق', 'آگهی فروش امتیاز وام شما با موفقیت ثبت شد و در وضعیت "در انتظار بررسی اپراتور" (Pending Verification) قرار گرفت.', 'success');
    router.push('/dashboard');
  }

  return (
    <div className="max-w-[800px] mx-auto w-full px-4 py-8 animate-fadeIn">
      <Link href="/" className="text-divar-muted hover:text-white transition flex items-center gap-2 mb-6">
        <i className="fa-solid fa-arrow-right" />
        بازگشت
      </Link>

      <div className="bg-divar-surface border border-divar-border rounded-xl p-6 md:p-8 shadow-xl">
        <h1 className="text-2xl font-bold text-white mb-2">ثبت آگهی فروش امتیاز وام</h1>
        <p className="text-sm text-divar-muted mb-8 pb-6 border-b border-divar-border">اطلاعات وام خود را با دقت وارد کنید. آگهی شما پس از تایید اپراتور منتشر خواهد شد.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-300 mb-2">بانک یا صندوق ارائه‌دهنده <span className="text-red-500">*</span></label>
              <select required className="w-full bg-divar-bg border border-divar-border text-white rounded-lg py-3 px-4 focus:outline-none focus:border-brand-500 transition">
                <option value="">انتخاب کنید...</option>
                <option value="resalat">بانک رسالت</option>
                <option value="mehr">بانک مهر ایران</option>
                <option value="maskan">بانک مسکن</option>
                <option value="mellat">بانک ملت</option>
                <option value="other">سایر (وام ازدواج/فرزندآوری)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">مبلغ وام (تومان) <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                value={loanAmount}
                onChange={e => handleAmountChange(e.target.value, setLoanAmount)}
                placeholder="مثلا: 300,000,000"
                className="w-full bg-divar-bg border border-divar-border text-white rounded-lg py-3 px-4 focus:outline-none focus:border-brand-500 transition font-mono text-left"
                dir="ltr"
              />
              {loanAmount && (
                <p className="text-[11px] text-brand-400 mt-1">{toTomanText(loanAmount)}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-300 mb-2">تعداد اقساط (ماه) <span className="text-red-500">*</span></label>
              <input type="number" required placeholder="مثلا: 60" className="w-full bg-divar-bg border border-divar-border text-white rounded-lg py-3 px-4 focus:outline-none focus:border-brand-500 transition text-left" dir="ltr" />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">نرخ سود بانکی (درصد) <span className="text-red-500">*</span></label>
              <input type="number" required placeholder="مثلا: 4" className="w-full bg-divar-bg border border-divar-border text-white rounded-lg py-3 px-4 focus:outline-none focus:border-brand-500 transition text-left" dir="ltr" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-300 mb-2">قیمت پیشنهادی فروش (تومان) <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                value={sellPrice}
                onChange={e => handleAmountChange(e.target.value, setSellPrice)}
                placeholder="مبلغ فروش امتیاز"
                className="w-full bg-divar-bg border border-brand-900 focus:border-brand-500 text-white rounded-lg py-3 px-4 focus:outline-none transition text-left font-mono"
                dir="ltr"
              />
              {sellPrice ? (
                <p className="text-[11px] text-brand-400 mt-1">{toTomanText(sellPrice)}</p>
              ) : (
                <p className="text-[10px] text-divar-muted mt-1">توصیه سیستم بر اساس الگوریتم: ۲۵ تا ۳۵ میلیون تومان</p>
              )}
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">شماره شبا (برای واریز وجه پس از معامله) <span className="text-red-500">*</span></label>
              <input type="text" required placeholder="IR------------------------" className="w-full bg-divar-bg border border-divar-border text-white rounded-lg py-3 px-4 focus:outline-none focus:border-brand-500 transition text-left font-mono" dir="ltr" />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">شرایط ضامن و توضیحات تکمیلی <span className="text-red-500">*</span></label>
            <textarea required rows={4} placeholder="توضیحات مربوط به شرایط ضامن، شهر، و نحوه انتقال را بنویسید..." className="w-full bg-divar-bg border border-divar-border text-white rounded-lg py-3 px-4 focus:outline-none focus:border-brand-500 transition resize-none" />
          </div>

          <div className="border-t border-divar-border pt-6">
            <h3 className="text-sm font-bold text-white mb-4">آپلود مدارک (فقط برای بررسی اپراتور)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="border-2 border-dashed border-gray-600 bg-divar-bg rounded-lg p-6 text-center cursor-pointer hover:border-brand-500 hover:bg-brand-500/5 transition">
                <i className="fa-solid fa-cloud-arrow-up text-2xl text-divar-muted mb-2" />
                <p className="text-sm text-white">تصویر موجودی/امتیاز وام</p>
                <p className="text-[10px] text-divar-muted mt-1">فرمت‌های JPG, PNG (حداکثر 5MB)</p>
                <input type="file" className="hidden" />
              </label>
              <label className="border-2 border-dashed border-gray-600 bg-divar-bg rounded-lg p-6 text-center cursor-pointer hover:border-brand-500 hover:bg-brand-500/5 transition">
                <i className="fa-solid fa-id-card text-2xl text-divar-muted mb-2" />
                <p className="text-sm text-white">تصویر کارت ملی</p>
                <p className="text-[10px] text-divar-muted mt-1">جهت تطبیق با حساب بانکی</p>
                <input type="file" className="hidden" />
              </label>
            </div>
          </div>

          <div className="bg-brand-900/10 border border-brand-900/30 rounded-lg p-4 flex items-start gap-3 mt-6">
            <input type="checkbox" required id="agreement" className="mt-1 bg-divar-bg border-divar-border w-4 h-4 rounded cursor-pointer" />
            <label htmlFor="agreement" className="text-xs text-gray-300 leading-relaxed cursor-pointer">
              من <Link href="/rules" className="text-brand-400 hover:underline">قوانین سیستم معامله امن (Escrow)</Link> و شرایط انتقال وجه پلتفرم &quot;وام اینجاست&quot; را مطالعه کرده و می‌پذیرم. می‌دانم که اطلاعات دستگاه و آی‌پی من جهت جلوگیری از کلاهبرداری ثبت می‌شود.
            </label>
          </div>

          <div className="pt-4">
            <button type="submit" className="w-full bg-divar-primary hover:bg-divar-primaryHover text-white py-4 rounded-xl font-bold transition shadow-lg text-lg">
              ثبت و ارسال برای تایید
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
