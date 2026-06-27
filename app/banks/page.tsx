import { mockBanks } from '@/data/mockData';

const iconMap: Record<string, string> = {
  blue: 'fa-building-columns text-blue-500',
  teal: 'fa-leaf text-teal-500',
  green: 'fa-ring text-green-500',
  indigo: 'fa-house-chimney text-indigo-500',
  red: 'fa-building-columns text-red-500',
};

const bgMap: Record<string, string> = {
  blue: 'bg-blue-500/10',
  teal: 'bg-teal-500/10',
  green: 'bg-green-500/10',
  indigo: 'bg-indigo-500/10',
  red: 'bg-red-500/10',
};

const badgeMap: Record<string, string> = {
  'قرض‌الحسنه': 'bg-emerald-500/10 text-emerald-500',
  'دولتی': 'bg-blue-500/10 text-blue-500',
  'تجاری': 'bg-amber-500/10 text-amber-500',
};

export default function BanksPage() {
  return (
    <div className="max-w-[1024px] mx-auto w-full px-4 py-8 animate-fadeIn">
      {/* Page Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center flex-shrink-0">
          <i className="fa-solid fa-building-columns text-brand-500 text-xl" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-divar-text">بانک‌ها و موسسات تحت پوشش</h1>
          <p className="text-sm text-divar-muted mt-1">لیست بانک‌ها و صندوق‌هایی که امتیاز وام آن‌ها در پلتفرم قابل معامله است</p>
        </div>
      </div>

      {/* Bank Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {mockBanks.map(bank => (
          <div
            key={bank.id}
            className="bg-divar-surface border border-divar-border rounded-2xl p-5 cursor-pointer hover:border-brand-500 hover:shadow-lg shadow-sm transition-all duration-200 group"
          >
            {/* Top: Icon + Name + Badge */}
            <div className="flex items-start gap-3 mb-4">
              <div className={`w-11 h-11 rounded-xl ${bgMap[bank.color] || 'bg-blue-500/10'} flex items-center justify-center flex-shrink-0`}>
                <i className={`fa-solid ${iconMap[bank.color] || 'fa-building-columns text-blue-500'} text-lg`} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-divar-text leading-tight">{bank.name}</h3>
                <span className={`inline-block text-[11px] font-medium mt-1.5 px-2 py-0.5 rounded-md ${badgeMap[bank.type] || 'bg-gray-500/10 text-gray-500'}`}>
                  {bank.type}
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-divar-border my-3" />

            {/* Details */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-divar-muted">نرخ سود</span>
                <span className="text-sm font-bold text-brand-500">{bank.interest}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-divar-muted">سقف وام</span>
                <span className="text-sm font-medium text-divar-text">{bank.maxAmount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-divar-muted">تعداد اقساط</span>
                <span className="text-sm font-medium text-divar-text">{bank.maxInstallments}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
