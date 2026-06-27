'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAlert } from '@/components/AlertModal';

const faqs = [
  {
    question: 'معامله Escrow چیست؟',
    answer: 'معامله Escrow یک سیستم واسطه‌ای امن است که وجه خریدار را تا تایید انتقال امتیاز توسط هر دو طرف، در حساب واسط پلتفرم نگه می‌دارد.',
  },
  {
    question: 'اگر فروشنده امتیاز را منتقل نکند چه می‌شود؟',
    answer: 'در صورت عدم انتقال در مهلت ۷ روز کاری، معامله به‌طور خودکار لغو شده و وجه بدون کسر کارمزد به حساب خریدار بازگردانده می‌شود.',
  },
  {
    question: 'کارمزد پلتفرم چقدر است؟',
    answer: 'کارمزد بسته به نوع معامله و مبلغ آن متفاوت است. جزییات کارمزد پیش از تایید نهایی معامله به هر دو طرف نمایش داده می‌شود.',
  },
  {
    question: 'چگونه امتیاز وام خود را بفروشم؟',
    answer: 'کافیست یک آگهی فروش امتیاز ثبت کنید. پس از تایید اپراتور، آگهی شما در پلتفرم نمایش داده شده و خریداران می‌توانند درخواست خرید ارسال کنند.',
  },
];

export default function SupportPage() {
  const alert = useAlert();
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    alert.showAlert('موفق', 'پیام شما به واحد پشتیبانی ارسال شد.', 'success');
    router.push('/');
  }

  return (
    <div className="max-w-[1024px] mx-auto w-full px-4 py-8 animate-fadeIn">
      {/* Page Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center flex-shrink-0">
          <i className="fa-solid fa-headset text-brand-500 text-xl" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-divar-text">پشتیبانی پلتفرم</h1>
          <p className="text-sm text-divar-muted mt-1">در صورت بروز اختلاف در معاملات یا نیاز به راهنمایی با ما در ارتباط باشید</p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Column: Info + FAQ */}
        <div className="lg:col-span-2 space-y-5">
          {/* Contact Info Cards */}
          <div className="bg-divar-surface border border-divar-border rounded-2xl p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-divar-text mb-1">راه‌های ارتباطی</h2>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <i className="fa-solid fa-envelope text-blue-500 text-sm" />
              </div>
              <div>
                <p className="text-xs text-divar-muted">ایمیل</p>
                <p className="text-sm text-divar-text font-medium" dir="ltr">support@vaminjast.ir</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                <i className="fa-solid fa-phone text-emerald-500 text-sm" />
              </div>
              <div>
                <p className="text-xs text-divar-muted">تلفن پشتیبانی</p>
                <p className="text-sm text-divar-text font-medium" dir="ltr">021-9100XXXX</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                <i className="fa-solid fa-clock text-purple-500 text-sm" />
              </div>
              <div>
                <p className="text-xs text-divar-muted">ساعات پاسخگویی</p>
                <p className="text-sm text-divar-text font-medium">شنبه تا چهارشنبه، ۹ تا ۱۷</p>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="bg-divar-surface border border-divar-border rounded-2xl p-5 shadow-sm">
            <h2 className="text-sm font-bold text-divar-text mb-3">سوالات متداول</h2>
            <div className="space-y-2">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-divar-border rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full flex items-center justify-between px-4 py-3 text-right cursor-pointer hover:bg-divar-surfaceHover transition-all duration-200"
                  >
                    <span className="text-xs font-medium text-divar-text">{faq.question}</span>
                    <i className={`fa-solid fa-chevron-down text-[10px] text-divar-muted transition-transform duration-200 ${openFaq === index ? 'rotate-180' : ''}`} />
                  </button>
                  {openFaq === index && (
                    <div className="px-4 pb-3 border-t border-divar-border">
                      <p className="text-xs text-divar-muted leading-relaxed pt-3">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="lg:col-span-3">
          <div className="bg-divar-surface border border-divar-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-divar-text mb-1">ارسال تیکت پشتیبانی</h2>
            <p className="text-xs text-divar-muted mb-5">فرم زیر را تکمیل کنید تا در اسرع وقت پاسخ داده شود</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-divar-text mb-1.5">
                  <i className="fa-solid fa-tag text-divar-muted text-[10px] ml-1" />
                  موضوع
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثلا: مشکل در پرداخت"
                  className="w-full bg-divar-bg border border-divar-border text-divar-text rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20 transition-all duration-200 placeholder:text-divar-muted/50"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-divar-text mb-1.5">
                  <i className="fa-solid fa-hashtag text-divar-muted text-[10px] ml-1" />
                  شناسه معامله (اختیاری)
                </label>
                <input
                  type="text"
                  placeholder="TXN-XXXXX"
                  className="w-full bg-divar-bg border border-divar-border text-divar-text rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20 transition-all duration-200 text-left font-mono placeholder:text-divar-muted/50"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-divar-text mb-1.5">
                  <i className="fa-solid fa-message text-divar-muted text-[10px] ml-1" />
                  متن پیام
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="جزییات مشکل یا سوال خود را شرح دهید..."
                  className="w-full bg-divar-bg border border-divar-border text-divar-text rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20 transition-all duration-200 resize-none placeholder:text-divar-muted/50"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-brand-600 hover:bg-brand-500 text-white py-3 rounded-xl font-bold text-sm cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-lg"
              >
                <i className="fa-solid fa-paper-plane text-xs" />
                ارسال تیکت
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
