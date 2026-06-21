'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthContext';
import { useAlert } from './AlertModal';

export default function LoginModal() {
  const auth = useAuth();
  const alert = useAlert();
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');

  if (!auth.showLoginModal) return null;

  function requestOTP() {
    if (!phone || phone.length < 10) {
      alert.showAlert('خطا', 'لطفا شماره موبایل معتبر وارد کنید.');
      return;
    }
    setStep(2);
  }

  function verifyOTP() {
    if (code.length === 5) {
      auth.login(phone);
      if (auth.pendingNavigation) {
        const target = auth.pendingNavigation;
        auth.setPendingNavigation(null);
        router.push(target);
      } else {
        alert.showAlert('خوش آمدید', 'ورود شما به سیستم با موفقیت انجام شد.', 'success');
      }
      resetForm();
    } else {
      alert.showAlert('خطا', 'کد وارد شده صحیح نیست. (کد تستی 5 رقمی وارد کنید)');
    }
  }

  function resetForm() {
    setStep(1);
    setPhone('');
    setCode('');
  }

  function close() {
    auth.closeLoginModal();
    resetForm();
  }

  return (
    <div
      className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[100] flex items-center justify-center"
      onClick={close}
    >
      <div
        className="bg-divar-surface border border-divar-border rounded-xl w-[90%] max-w-[400px] p-6 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6 border-b border-divar-border pb-4">
          <h3 className="text-lg font-bold text-white">ورود / ثبت‌نام</h3>
          <button onClick={close} className="text-divar-muted hover:text-white transition">
            <i className="fa-solid fa-xmark text-xl" />
          </button>
        </div>

        {step === 1 ? (
          <div>
            <p className="text-sm text-divar-muted mb-5 leading-relaxed text-center">
              جهت استفاده از خدمات، شماره موبایل خود را وارد کنید.
            </p>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="مثال: 09123456789"
              className="w-full bg-divar-bg border border-divar-border text-white rounded-lg py-3 px-4 mb-5 text-center font-mono focus:outline-none focus:border-brand-500 transition text-lg tracking-widest"
              dir="ltr"
              maxLength={11}
            />
            <button
              onClick={requestOTP}
              className="w-full bg-divar-primary hover:bg-divar-primaryHover text-white py-3.5 rounded-lg font-bold transition shadow-lg"
            >
              ارسال کد تایید
            </button>
          </div>
        ) : (
          <div>
            <p className="text-sm text-divar-muted mb-5 text-center">
              کد ۵ رقمی پیامک شده به <span className="text-brand-400 font-mono" dir="ltr">{phone}</span> را وارد کنید.
            </p>
            <input
              type="text"
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="- - - - -"
              className="w-full bg-divar-bg border border-divar-border text-white rounded-lg py-3 px-4 mb-5 text-center tracking-[1em] font-mono text-2xl focus:outline-none focus:border-brand-500 transition"
              dir="ltr"
              maxLength={5}
            />
            <button
              onClick={verifyOTP}
              className="w-full bg-brand-600 hover:bg-brand-500 text-white py-3.5 rounded-lg font-bold transition shadow-lg"
            >
              تایید و ورود
            </button>
            <button
              onClick={() => { setStep(1); setCode(''); }}
              className="w-full text-xs text-divar-muted hover:text-white mt-5 transition"
            >
              تغییر شماره موبایل
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
