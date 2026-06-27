import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-divar-surface border-t border-divar-border">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div>
            <div className="text-brand-600 dark:text-brand-400 font-black text-lg flex items-center gap-1.5 mb-3">
              <i className="fa-solid fa-hand-holding-dollar" />
              وام‌اینجاست
            </div>
            <p className="text-xs text-divar-muted leading-relaxed">پلتفرم معامله امن امتیاز وام</p>
          </div>
          <div>
            <h4 className="text-sm font-bold text-divar-text mb-3">دسترسی سریع</h4>
            <div className="space-y-2 text-xs">
              <Link href="/listings" className="block text-divar-muted hover:text-brand-500 transition-colors cursor-pointer">آگهی‌های وام</Link>
              <Link href="/banks" className="block text-divar-muted hover:text-brand-500 transition-colors cursor-pointer">بانک‌ها</Link>
              <Link href="/rules" className="block text-divar-muted hover:text-brand-500 transition-colors cursor-pointer">قوانین</Link>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold text-divar-text mb-3">پشتیبانی</h4>
            <div className="space-y-2 text-xs">
              <Link href="/support" className="block text-divar-muted hover:text-brand-500 transition-colors cursor-pointer">تماس با ما</Link>
              <Link href="/rules" className="block text-divar-muted hover:text-brand-500 transition-colors cursor-pointer">سوالات متداول</Link>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold text-divar-text mb-3">نماد اعتماد</h4>
            <div className="w-16 h-16 bg-divar-bg border border-divar-border rounded-lg flex items-center justify-center text-divar-muted text-[10px] font-bold">
              اینماد
            </div>
          </div>
        </div>
        <div className="border-t border-divar-border pt-4 text-center text-[11px] text-divar-muted">
          © تمامی حقوق برای پلتفرم وام‌اینجاست محفوظ است.
        </div>
      </div>
    </footer>
  );
}
