import Link from 'next/link';

const steps = [
  {
    title: 'تماس با فروشنده',
    description: 'پس از ثبت درخواست خرید، اپراتور با فروشنده تماس می‌گیرد تا از موجود بودن امتیاز اطمینان حاصل کند.',
  },
  {
    title: 'واریز وجه به حساب واسط',
    description: 'در صورت تایید، به خریدار اطلاع داده می‌شود تا وجه معامله را به حساب واسط پلتفرم واریز نماید (Payment Pending).',
  },
  {
    title: 'مهلت انتقال امتیاز',
    description: 'فروشنده دقیقاً ۷ روز کاری فرصت دارد تا انتقال امتیاز را در بانک انجام دهد.',
    highlight: '۷ روز کاری',
  },
  {
    title: 'بازگشت وجه در صورت عدم انتقال',
    description: 'در صورت عدم انتقال در موعد مقرر، معامله لغو شده و وجه بدون کسر کارمزد به خریدار بازگردانده می‌شود.',
  },
  {
    title: 'تایید و آزادسازی وجه',
    description: 'پس از تایید انتقال توسط طرفین و ثبت کد OTP دوطرفه، وجه آزاد شده و به حساب فروشنده واریز می‌گردد.',
  },
  {
    title: 'کسر کارمزد',
    description: 'کارمزد تضمین امنیت معامله در زمان آزادسازی وجه، از مبلغ پرداختی کسر می‌شود.',
  },
];

export default function RulesPage() {
  return (
    <div className="max-w-[800px] mx-auto w-full px-4 py-8 animate-fadeIn">
      {/* Page Header */}
      <div className="flex items-center gap-4 mb-3">
        <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center flex-shrink-0">
          <i className="fa-solid fa-shield-halved text-brand-500 text-xl" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-divar-text">قوانین معامله واسطه‌ای (Escrow)</h1>
          <p className="text-sm text-divar-muted mt-1">مراحل معامله امن در پلتفرم وام‌اینجاست</p>
        </div>
      </div>

      {/* Intro Text */}
      <div className="bg-divar-surface border border-divar-border rounded-2xl p-5 mb-8 shadow-sm">
        <p className="text-sm text-divar-text leading-relaxed">
          سیستم معامله امن یا Escrow در پلتفرم &quot;وام اینجاست&quot; جهت حفظ امنیت مالی خریداران و فروشندگان طراحی شده است. مراحل آن مطابق PRD پلتفرم به شرح زیر است:
        </p>
      </div>

      {/* Steps */}
      <div className="relative">
        {steps.map((step, index) => (
          <div key={index} className="flex gap-4 mb-0">
            {/* Number Column + Connector */}
            <div className="flex flex-col items-center">
              <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center flex-shrink-0 text-white text-sm font-bold shadow-sm">
                {index + 1}
              </div>
              {index < steps.length - 1 && (
                <div className="w-0.5 bg-divar-border flex-1 my-1 min-h-[24px]" />
              )}
            </div>

            {/* Card */}
            <div className="bg-divar-surface border border-divar-border rounded-2xl p-4 mb-4 flex-1 shadow-sm hover:shadow-lg hover:border-brand-500/40 transition-all duration-200">
              <h3 className="text-sm font-bold text-divar-text mb-1.5">{step.title}</h3>
              <p className="text-xs text-divar-muted leading-relaxed">
                {step.highlight ? (
                  <>
                    {step.description.split(step.highlight)[0]}
                    <span className="inline-block bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 font-bold px-1.5 py-0.5 rounded-md mx-0.5">
                      {step.highlight}
                    </span>
                    {step.description.split(step.highlight)[1]}
                  </>
                ) : (
                  step.description
                )}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Back Link */}
      <div className="mt-8 pt-6 border-t border-divar-border">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-brand-500 hover:text-brand-400 font-medium cursor-pointer transition-all duration-200"
        >
          <i className="fa-solid fa-arrow-right text-xs" />
          بازگشت به صفحه اصلی
        </Link>
      </div>
    </div>
  );
}
