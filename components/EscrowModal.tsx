'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Listing } from '@/data/types';
import { useApp } from './AppContext';
import { useAlert } from './AlertModal';

interface Props {
  listing: Listing;
  open: boolean;
  onClose: () => void;
}

export default function EscrowModal({ listing, open, onClose }: Props) {
  const app = useApp();
  const alert = useAlert();
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [agreed, setAgreed] = useState(false);
  const [otp, setOtp] = useState('');

  if (!open) return null;

  function handleConfirm() {
    const trxId = app.createTransaction(listing.id);
    if (trxId) {
      onClose();
      setStep(1);
      setAgreed(false);
      setOtp('');
      alert.showAlert('درخواست ثبت شد', `درخواست خرید امن شما با شناسه ${trxId} ثبت شد. اپراتور به زودی با فروشنده تماس خواهد گرفت.`, 'success');
      router.push('/dashboard');
    }
  }

  function handleOtp() {
    if (otp.length === 5) {
      handleConfirm();
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[100] flex items-center justify-center" onClick={onClose} />
      <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[480px] bg-divar-surface border border-divar-border rounded-xl shadow-2xl z-[101] max-h-[90vh] overflow-y-auto">
        <div className="p-5 border-b border-divar-border flex items-center justify-between">
          <h3 className="text-lg font-bold text-divar-text">
            {step === 1 ? 'قرارداد دیجیتال' : step === 2 ? 'خلاصه معامله' : 'تایید نهایی'}
          </h3>
          <div className="flex items-center gap-3">
            <span className="text-xs text-divar-muted">مرحله {step} از ۳</span>
            <button onClick={onClose} className="text-divar-muted hover:text-divar-text"><i className="fa-solid fa-xmark text-lg" /></button>
          </div>
        </div>

        <div className="p-5">
          {step === 1 && (
            <>
              <div className="bg-divar-bg border border-divar-border rounded-lg p-4 mb-4 max-h-48 overflow-y-auto text-xs text-divar-text leading-relaxed">
                <p className="mb-3">با تایید این قرارداد، شما موافقت خود را با شرایط زیر اعلام می‌دارید:</p>
                <ol className="list-decimal list-inside space-y-2 mr-2">
                  <li>وجه معامله تا زمان انتقال قطعی امتیاز وام در حساب واسط پلتفرم بلوکه می‌ماند.</li>
                  <li>فروشنده ۷ روز کاری فرصت انتقال امتیاز را دارد.</li>
                  <li>در صورت عدم انتقال، وجه بدون کسر کارمزد به خریدار بازگردانده می‌شود.</li>
                  <li>کارمزد تضمین امنیت معامله در زمان آزادسازی وجه کسر می‌شود.</li>
                  <li>اطلاعات دستگاه و آی‌پی شما جهت جلوگیری از تقلب ثبت می‌شود.</li>
                </ol>
              </div>
              <label className="flex items-start gap-3 cursor-pointer mb-5">
                <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="mt-1 w-4 h-4 rounded" />
                <span className="text-xs text-divar-text">قوانین و شرایط معامله امن را مطالعه کردم و می‌پذیرم.</span>
              </label>
              <button
                onClick={() => setStep(2)}
                disabled={!agreed}
                className="w-full bg-brand-600 hover:bg-brand-500 disabled:bg-divar-surfaceHover disabled:text-divar-muted text-white py-3 rounded-lg font-bold transition"
              >
                مرحله بعد
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="space-y-3 mb-5">
                <div className="bg-divar-bg border border-divar-border rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="text-divar-muted text-xs mb-1">بانک</div>
                      <div className="text-divar-text font-medium">{listing.bank}</div>
                    </div>
                    <div>
                      <div className="text-divar-muted text-xs mb-1">مبلغ وام</div>
                      <div className="text-divar-text font-medium">{listing.amount}</div>
                    </div>
                    <div>
                      <div className="text-divar-muted text-xs mb-1">قیمت امتیاز</div>
                      <div className="text-divar-text font-bold">{listing.price} تومان</div>
                    </div>
                    <div>
                      <div className="text-divar-muted text-xs mb-1">کارمزد پلتفرم</div>
                      <div className="text-brand-400 font-medium">۵٪ مبلغ معامله</div>
                    </div>
                  </div>
                </div>
                <div className="bg-brand-900/10 border border-brand-900/30 rounded-lg p-3 flex items-start gap-2">
                  <i className="fa-solid fa-shield-check text-brand-400 mt-0.5" />
                  <p className="text-[11px] text-divar-muted leading-relaxed">وجه شما تا تایید نهایی انتقال در حساب واسط پلتفرم بلوکه می‌ماند.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 bg-divar-bg border border-divar-border text-divar-text py-3 rounded-lg font-bold transition hover:bg-divar-surfaceHover">بازگشت</button>
                <button onClick={() => setStep(3)} className="flex-1 bg-brand-600 hover:bg-brand-500 text-white py-3 rounded-lg font-bold transition">تایید و ادامه</button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <p className="text-sm text-divar-muted mb-5 text-center">کد تایید ۵ رقمی ارسال شده به شماره موبایل خود را وارد کنید.</p>
              <input
                type="text"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                placeholder="- - - - -"
                className="w-full bg-divar-bg border border-divar-border text-divar-text rounded-lg py-3 px-4 mb-5 text-center tracking-[1em] font-mono text-2xl focus:outline-none focus:border-brand-500 transition"
                dir="ltr"
                maxLength={5}
              />
              <p className="text-[10px] text-divar-muted text-center mb-5">برای دمو: هر ۵ رقمی را وارد کنید</p>
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="flex-1 bg-divar-bg border border-divar-border text-divar-text py-3 rounded-lg font-bold transition hover:bg-divar-surfaceHover">بازگشت</button>
                <button
                  onClick={handleOtp}
                  disabled={otp.length !== 5}
                  className="flex-1 bg-brand-600 hover:bg-brand-500 disabled:bg-divar-surfaceHover disabled:text-divar-muted text-white py-3 rounded-lg font-bold transition"
                >
                  ثبت نهایی
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
