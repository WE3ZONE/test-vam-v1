'use client';

import { useRouter } from 'next/navigation';
import { useAlert } from '@/components/AlertModal';

export default function SupportPage() {
  const alert = useAlert();
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    alert.showAlert('موفق', 'پیام شما به واحد پشتیبانی ارسال شد.', 'success');
    router.push('/');
  }

  return (
    <div className="max-w-[600px] mx-auto w-full px-4 py-8 animate-fadeIn">
      <div className="bg-divar-surface border border-divar-border rounded-xl p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-white mb-2">پشتیبانی پلتفرم</h1>
        <p className="text-sm text-divar-muted mb-8 border-b border-divar-border pb-6">در صورت بروز اختلاف در معاملات یا نیاز به راهنمایی با ما در ارتباط باشید.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2">موضوع</label>
            <input type="text" required className="w-full bg-divar-bg border border-divar-border text-white rounded-lg py-3 px-4 focus:outline-none focus:border-brand-500" />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">شناسه معامله (اختیاری)</label>
            <input type="text" className="w-full bg-divar-bg border border-divar-border text-white rounded-lg py-3 px-4 focus:outline-none focus:border-brand-500 text-left font-mono" dir="ltr" />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">متن پیام</label>
            <textarea required rows={4} className="w-full bg-divar-bg border border-divar-border text-white rounded-lg py-3 px-4 focus:outline-none focus:border-brand-500" />
          </div>
          <button type="submit" className="w-full bg-brand-600 hover:bg-brand-500 text-white py-3 rounded-lg font-bold transition">ارسال تیکت</button>
        </form>
      </div>
    </div>
  );
}
