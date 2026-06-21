import { mockBanks } from '@/data/mockData';

const iconMap: Record<string, string> = {
  blue: 'fa-building-columns text-blue-500',
  teal: 'fa-leaf text-teal-500',
  green: 'fa-ring text-green-500',
  indigo: 'fa-house-chimney text-indigo-500',
  red: 'fa-building-columns text-red-500',
};

export default function BanksPage() {
  return (
    <div className="max-w-[1024px] mx-auto w-full px-4 py-8 animate-fadeIn">
      <h1 className="text-2xl font-bold text-white mb-6">بانک‌ها و موسسات تحت پوشش</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mockBanks.map(bank => (
          <div key={bank.id} className="bg-divar-surface border border-divar-border rounded-xl p-6 text-center hover:border-brand-500 transition">
            <i className={`fa-solid ${iconMap[bank.color] || 'fa-building-columns text-blue-500'} text-4xl mb-4`} />
            <h3 className="text-lg font-bold text-white mb-2">{bank.name}</h3>
            <p className="text-xs text-divar-muted mb-3">{bank.type} — سود {bank.interest}</p>
            <p className="text-xs text-divar-muted">حداکثر: {bank.maxAmount} | اقساط: {bank.maxInstallments}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
