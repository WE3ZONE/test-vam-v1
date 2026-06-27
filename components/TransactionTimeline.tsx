import { Transaction, transactionStatusLabels } from '@/data/types';

export default function TransactionTimeline({ transaction }: { transaction: Transaction }) {
  return (
    <div className="relative pr-6">
      <div className="absolute right-2 top-0 bottom-0 w-0.5 bg-divar-border" />
      {transaction.timeline.map((entry, i) => {
        const isLast = i === transaction.timeline.length - 1;
        return (
          <div key={i} className="relative mb-4 last:mb-0">
            <div className={`absolute right-0 w-5 h-5 rounded-full flex items-center justify-center text-[9px] border-2 ${
              isLast
                ? 'bg-brand-600 border-brand-600 text-white'
                : 'bg-green-600 border-green-600 text-white'
            }`}>
              {isLast ? <i className="fa-solid fa-circle text-[5px]" /> : <i className="fa-solid fa-check" />}
            </div>
            <div className="mr-8">
              <div className="text-xs font-bold text-divar-text">{transactionStatusLabels[entry.status]}</div>
              <div className="text-[10px] text-divar-muted mt-0.5">{entry.date}</div>
              <div className="text-[11px] text-divar-text mt-1">{entry.note}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
