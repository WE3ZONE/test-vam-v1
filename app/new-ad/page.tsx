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
    alert.showAlert('ثبت موفق', 'آگهی فروش امتیاز وام شما با موفقیت ثبت شد و در وضعیت "در انتظار بررسی اپراتور" قرار گرفت.', 'success');
    router.push('/dashboard');
  }

  return (
    <div className="max-w-3xl mx-auto w-full px-4 py-6 md:py-10 animate-fadeIn">
      <Link href="/" className="text-divar-muted hover:text-divar-text transition-colors flex items-center gap-2 mb-6 text-sm cursor-pointer">
        <i className="fa-solid fa-arrow-right" />
        بازگشت
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-brand-500/10 rounded-xl flex items-center justify-center">
            <i className="fa-solid fa-plus text-brand-500" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-divar-text">ثبت آگهی فروش امتیاز وام</h1>
        </div>
        <p className="text-sm text-divar-muted mr-[52px]">اطلاعات وام خود را با دقت وارد کنید. آگهی شما پس از تایید اپراتور منتشر خواهد شد.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Loan Info */}
        <div className="bg-divar-surface border border-divar-border rounded-2xl p-5 md:p-6">
          <h2 className="text-sm font-bold text-divar-text mb-5 flex items-center gap-2">
            <i className="fa-solid fa-building-columns text-brand-500" />
            اطلاعات وام
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-medium text-divar-muted mb-1.5">بانک یا صندوق <span className="text-red-500">*</span></label>
              <select required className="w-full bg-divar-bg border border-divar-border text-divar-text rounded-xl py-3 px-4 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all cursor-pointer">
                <option value="">انتخاب کنید...</option>
                <option value="resalat">بانک رسالت</option>
                <option value="mehr">بانک مهر ایران</option>
                <option value="maskan">بانک مسکن</option>
                <option value="mellat">بانک ملت</option>
                <option value="javidan">صندوق جاویدان</option>
                <option value="other">سایر (وام ازدواج/فرزندآوری)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-divar-muted mb-1.5">مبلغ وام (تومان) <span className="text-red-500">*</span></label>
              <input type="text" required value={loanAmount} onChange={e => handleAmountChange(e.target.value, setLoanAmount)} placeholder="مثلا: 300,000,000"
                className="w-full bg-divar-bg border border-divar-border text-divar-text rounded-xl py-3 px-4 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all font-mono text-left" dir="ltr" />
              {loanAmount && <p className="text-[11px] text-brand-500 mt-1.5 font-medium">{toTomanText(loanAmount)}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-divar-muted mb-1.5">تعداد اقساط (ماه) <span className="text-red-500">*</span></label>
              <input type="number" required placeholder="مثلا: 60" className="w-full bg-divar-bg border border-divar-border text-divar-text rounded-xl py-3 px-4 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all text-left" dir="ltr" />
            </div>
            <div>
              <label className="block text-xs font-medium text-divar-muted mb-1.5">نرخ سود بانکی (درصد) <span className="text-red-500">*</span></label>
              <input type="number" required placeholder="مثلا: 4" className="w-full bg-divar-bg border border-divar-border text-divar-text rounded-xl py-3 px-4 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all text-left" dir="ltr" />
            </div>
          </div>
        </div>

        {/* Section 2: Pricing */}
        <div className="bg-divar-surface border border-divar-border rounded-2xl p-5 md:p-6">
          <h2 className="text-sm font-bold text-divar-text mb-5 flex items-center gap-2">
            <i className="fa-solid fa-tags text-brand-500" />
            قیمت‌گذاری
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-medium text-divar-muted mb-1.5">قیمت پیشنهادی فروش (تومان) <span className="text-red-500">*</span></label>
              <input type="text" required value={sellPrice} onChange={e => handleAmountChange(e.target.value, setSellPrice)} placeholder="مبلغ فروش امتیاز"
                className="w-full bg-divar-bg border border-brand-800/30 focus:border-brand-500 text-divar-text rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all text-left font-mono" dir="ltr" />
              {sellPrice && <p className="text-[11px] text-brand-500 mt-1.5 font-medium">{toTomanText(sellPrice)}</p>}
              <div className="mt-2 bg-brand-500/10 border border-brand-500/20 rounded-xl p-3 flex items-center gap-2">
                <i className="fa-solid fa-lightbulb text-brand-500 text-sm" />
                <p className="text-[11px] text-brand-600 dark:text-brand-400 font-medium">توصیه سیستم: ۲۵ تا ۳۵ میلیون تومان</p>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-divar-muted mb-1.5">شماره شبا <span className="text-red-500">*</span></label>
              <input type="text" required placeholder="IR------------------------" className="w-full bg-divar-bg border border-divar-border text-divar-text rounded-xl py-3 px-4 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all text-left font-mono" dir="ltr" />
              <p className="text-[10px] text-divar-muted mt-1">برای واریز وجه پس از تکمیل معامله</p>
            </div>
          </div>
        </div>

        {/* Section 3: Details */}
        <div className="bg-divar-surface border border-divar-border rounded-2xl p-5 md:p-6">
          <h2 className="text-sm font-bold text-divar-text mb-5 flex items-center gap-2">
            <i className="fa-solid fa-file-lines text-brand-500" />
            توضیحات تکمیلی
          </h2>
          <div>
            <label className="block text-xs font-medium text-divar-muted mb-1.5">شرایط ضامن و توضیحات <span className="text-red-500">*</span></label>
            <textarea required rows={4} placeholder="توضیحات مربوط به شرایط ضامن، شهر، و نحوه انتقال را بنویسید..."
              className="w-full bg-divar-bg border border-divar-border text-divar-text rounded-xl py-3 px-4 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all resize-none" />
          </div>
        </div>

        {/* Section 4: Documents */}
        <div className="bg-divar-surface border border-divar-border rounded-2xl p-5 md:p-6">
          <h2 className="text-sm font-bold text-divar-text mb-5 flex items-center gap-2">
            <i className="fa-solid fa-cloud-arrow-up text-brand-500" />
            آپلود مدارک
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="border-2 border-dashed border-divar-border bg-divar-bg rounded-xl p-6 text-center cursor-pointer hover:border-brand-500/50 hover:bg-brand-500/5 transition-all group">
              <div className="w-12 h-12 mx-auto bg-divar-surface border border-divar-border rounded-xl flex items-center justify-center mb-3 group-hover:border-brand-500/30 transition-colors">
                <i className="fa-solid fa-cloud-arrow-up text-xl text-divar-muted group-hover:text-brand-500 transition-colors" />
              </div>
              <p className="text-sm text-divar-text font-medium">تصویر موجودی/امتیاز وام</p>
              <p className="text-[10px] text-divar-muted mt-1">JPG, PNG (حداکثر 5MB)</p>
              <input type="file" className="hidden" />
            </label>
            <label className="border-2 border-dashed border-divar-border bg-divar-bg rounded-xl p-6 text-center cursor-pointer hover:border-brand-500/50 hover:bg-brand-500/5 transition-all group">
              <div className="w-12 h-12 mx-auto bg-divar-surface border border-divar-border rounded-xl flex items-center justify-center mb-3 group-hover:border-brand-500/30 transition-colors">
                <i className="fa-solid fa-id-card text-xl text-divar-muted group-hover:text-brand-500 transition-colors" />
              </div>
              <p className="text-sm text-divar-text font-medium">تصویر کارت ملی</p>
              <p className="text-[10px] text-divar-muted mt-1">جهت تطبیق با حساب بانکی</p>
              <input type="file" className="hidden" />
            </label>
          </div>
        </div>

        {/* Agreement */}
        <div className="bg-brand-500/5 border border-brand-500/20 rounded-2xl p-5 flex items-start gap-3">
          <input type="checkbox" required id="agreement" className="mt-1 w-4 h-4 rounded cursor-pointer accent-brand-500" />
          <label htmlFor="agreement" className="text-xs text-divar-muted leading-relaxed cursor-pointer">
            من <Link href="/rules" className="text-brand-500 hover:underline">قوانین سیستم معامله امن</Link> و شرایط انتقال وجه پلتفرم &quot;وام اینجاست&quot; را مطالعه کرده و می‌پذیرم. می‌دانم که اطلاعات دستگاه و آی‌پی من جهت جلوگیری از کلاهبرداری ثبت می‌شود.
          </label>
        </div>

        {/* Submit */}
        <button type="submit" className="w-full bg-brand-600 hover:bg-brand-700 text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-brand-600/20 text-base flex items-center justify-center gap-2 cursor-pointer">
          <i className="fa-solid fa-paper-plane" />
          ثبت و ارسال برای تایید
        </button>
      </form>
    </div>
  );
}
