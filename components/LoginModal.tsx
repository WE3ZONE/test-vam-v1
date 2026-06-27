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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={close}>
      <div className="bg-divar-surface border border-divar-border rounded-2xl w-full max-w-[400px] shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="p-5 pb-0 flex justify-between items-center">
          <h3 className="text-lg font-bold text-divar-text">ورود / ثبت‌نام</h3>
          <button onClick={close} className="w-8 h-8 rounded-lg bg-divar-bg flex items-center justify-center text-divar-muted hover:text-divar-text transition-colors cursor-pointer">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <div className="p-5">
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className={`w-8 h-1 rounded-full transition-colors ${step >= 1 ? 'bg-brand-500' : 'bg-divar-border'}`} />
            <div className={`w-8 h-1 rounded-full transition-colors ${step >= 2 ? 'bg-brand-500' : 'bg-divar-border'}`} />
          </div>

          {step === 1 ? (
            <div>
              <div className="w-16 h-16 mx-auto bg-brand-500/10 rounded-2xl flex items-center justify-center mb-4">
                <i className="fa-solid fa-mobile-screen text-2xl text-brand-500" />
              </div>
              <p className="text-sm text-divar-muted mb-5 text-center leading-relaxed">
                شماره موبایل خود را وارد کنید
              </p>
              <input
                type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                placeholder="09123456789"
                className="w-full bg-divar-bg border border-divar-border text-divar-text rounded-xl py-3.5 px-4 mb-4 text-center font-mono focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all text-lg tracking-widest" dir="ltr" maxLength={11}
              />
              <button onClick={requestOTP} className="w-full bg-brand-600 hover:bg-brand-700 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-brand-600/20 cursor-pointer">
                ارسال کد تایید
              </button>
            </div>
          ) : (
            <div>
              <div className="w-16 h-16 mx-auto bg-brand-500/10 rounded-2xl flex items-center justify-center mb-4">
                <i className="fa-solid fa-shield-check text-2xl text-brand-500" />
              </div>
              <p className="text-sm text-divar-muted mb-5 text-center">
                کد ۵ رقمی ارسال شده به <span className="text-brand-500 font-mono font-bold" dir="ltr">{phone}</span>
              </p>
              <input
                type="text" value={code} onChange={e => setCode(e.target.value)}
                placeholder="- - - - -"
                className="w-full bg-divar-bg border border-divar-border text-divar-text rounded-xl py-3.5 px-4 mb-4 text-center tracking-[1em] font-mono text-2xl focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all" dir="ltr" maxLength={5}
              />
              <button onClick={verifyOTP} className="w-full bg-brand-600 hover:bg-brand-700 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-brand-600/20 cursor-pointer">
                تایید و ورود
              </button>
              <button onClick={() => { setStep(1); setCode(''); }} className="w-full text-xs text-divar-muted hover:text-brand-500 mt-4 transition-colors cursor-pointer">
                تغییر شماره موبایل
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
