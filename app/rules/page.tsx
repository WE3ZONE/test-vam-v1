import Link from 'next/link';

export default function RulesPage() {
  return (
    <div className="max-w-[800px] mx-auto w-full px-4 py-8 animate-fadeIn">
      <div className="bg-divar-surface border border-divar-border rounded-xl p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-white mb-6 border-b border-divar-border pb-4">قوانین معامله واسطه‌ای (Escrow)</h1>
        <div className="space-y-6 text-sm text-gray-300 leading-relaxed">
          <p>سیستم معامله امن یا Escrow در پلتفرم &quot;وام اینجاست&quot; جهت حفظ امنیت مالی خریداران و فروشندگان طراحی شده است. مراحل آن مطابق PRD پلتفرم به شرح زیر است:</p>
          <ol className="list-decimal list-inside space-y-3 mr-4 bg-divar-bg p-5 rounded-lg border border-divar-border">
            <li>پس از ثبت درخواست خرید، اپراتور با فروشنده تماس می‌گیرد تا از موجود بودن امتیاز اطمینان حاصل کند.</li>
            <li>در صورت تایید، به خریدار اطلاع داده می‌شود تا وجه معامله را به حساب واسط پلتفرم واریز نماید (Payment Pending).</li>
            <li>فروشنده دقیقاً <strong className="text-red-400">۷ روز کاری</strong> فرصت دارد تا انتقال امتیاز را در بانک انجام دهد.</li>
            <li>در صورت عدم انتقال در موعد مقرر، معامله لغو شده و وجه بدون کسر کارمزد به خریدار بازگردانده می‌شود.</li>
            <li>پس از تایید انتقال توسط طرفین و ثبت کد OTP دوطرفه، وجه آزاد شده و به حساب فروشنده واریز می‌گردد.</li>
            <li>کارمزد تضمین امنیت معامله در زمان آزادسازی وجه، از مبلغ پرداختی کسر می‌شود.</li>
          </ol>
          <Link href="/" className="mt-6 text-brand-400 hover:text-brand-300 inline-block">بازگشت به صفحه اصلی</Link>
        </div>
      </div>
    </div>
  );
}
