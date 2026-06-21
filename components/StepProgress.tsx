import { TransactionStatus, transactionStatusLabels } from '@/data/types';

const steps: TransactionStatus[] = [
  'requested', 'seller_confirmed', 'payment_pending', 'payment_verified',
  'transfer_in_progress', 'transfer_confirmed', 'completed',
];

const shortLabels: Record<string, string> = {
  requested: 'درخواست',
  seller_confirmed: 'تایید فروشنده',
  payment_pending: 'پرداخت',
  payment_verified: 'تایید پرداخت',
  transfer_in_progress: 'انتقال',
  transfer_confirmed: 'تایید انتقال',
  completed: 'تکمیل',
};

export default function StepProgress({ currentStatus }: { currentStatus: TransactionStatus }) {
  const currentIndex = steps.indexOf(currentStatus);
  const isTerminal = currentStatus === 'disputed' || currentStatus === 'cancelled';

  if (isTerminal) {
    return (
      <div className="flex items-center gap-2 text-xs">
        <span className={`px-2 py-1 rounded font-bold border ${
          currentStatus === 'disputed' ? 'bg-red-900/30 text-red-400 border-red-800' : 'bg-gray-800 text-gray-400 border-gray-700'
        }`}>
          {transactionStatusLabels[currentStatus]}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-0.5 overflow-x-auto pb-1">
      {steps.map((step, i) => {
        const isPast = i < currentIndex;
        const isCurrent = i === currentIndex;
        return (
          <div key={step} className="flex items-center flex-shrink-0">
            <div className="flex flex-col items-center">
              <div className={`w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center text-[10px] font-bold border-2 ${
                isPast ? 'bg-green-600 border-green-600 text-white' :
                isCurrent ? 'bg-brand-600 border-brand-600 text-white' :
                'bg-divar-bg border-divar-border text-divar-muted'
              }`}>
                {isPast ? <i className="fa-solid fa-check" /> : i + 1}
              </div>
              <span className={`text-[8px] md:text-[9px] mt-1 text-center leading-tight max-w-[50px] ${
                isCurrent ? 'text-white font-bold' : isPast ? 'text-green-400' : 'text-divar-muted'
              }`}>
                {shortLabels[step]}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-4 md:w-6 h-0.5 mx-0.5 mt-[-12px] ${
                isPast ? 'bg-green-600' : 'bg-divar-border'
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
