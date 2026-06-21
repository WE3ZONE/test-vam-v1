import { ListingStatus, TransactionStatus, KycStatus, listingStatusLabels, transactionStatusLabels, kycStatusLabels } from '@/data/types';

const listingStatusColors: Record<ListingStatus, string> = {
  draft: 'bg-gray-800 text-gray-400 border-gray-700',
  pending_verification: 'bg-yellow-900/30 text-yellow-500 border-yellow-700',
  rejected: 'bg-red-900/30 text-red-400 border-red-800',
  published: 'bg-green-900/30 text-green-500 border-green-800',
  reserved: 'bg-blue-900/30 text-blue-400 border-blue-700',
  payment_pending: 'bg-yellow-900/30 text-yellow-500 border-yellow-700',
  transfer_in_progress: 'bg-blue-900/30 text-blue-400 border-blue-700',
  completed: 'bg-green-900/30 text-green-500 border-green-800',
  cancelled: 'bg-red-900/30 text-red-400 border-red-800',
  expired: 'bg-gray-800 text-gray-400 border-gray-700',
  reported: 'bg-red-900/30 text-red-400 border-red-800',
};

const transactionStatusColors: Record<TransactionStatus, string> = {
  requested: 'bg-yellow-900/30 text-yellow-500 border-yellow-700',
  seller_confirmed: 'bg-blue-900/30 text-blue-400 border-blue-700',
  payment_pending: 'bg-yellow-900/30 text-yellow-500 border-yellow-700',
  payment_verified: 'bg-green-900/30 text-green-400 border-green-800',
  transfer_in_progress: 'bg-blue-900/30 text-blue-400 border-blue-700',
  transfer_confirmed: 'bg-green-900/30 text-green-400 border-green-800',
  completed: 'bg-green-900/30 text-green-500 border-green-800',
  disputed: 'bg-red-900/30 text-red-400 border-red-800',
  cancelled: 'bg-gray-800 text-gray-400 border-gray-700',
};

const kycStatusColors: Record<KycStatus, string> = {
  not_submitted: 'bg-gray-800 text-gray-400 border-gray-700',
  pending: 'bg-yellow-900/30 text-yellow-500 border-yellow-700',
  verified: 'bg-green-900/30 text-green-500 border-green-800',
  rejected: 'bg-red-900/30 text-red-400 border-red-800',
};

type BadgeProps =
  | { type: 'listing'; status: ListingStatus }
  | { type: 'transaction'; status: TransactionStatus }
  | { type: 'kyc'; status: KycStatus };

export default function StatusBadge(props: BadgeProps) {
  let colorClass: string;
  let label: string;

  if (props.type === 'listing') {
    colorClass = listingStatusColors[props.status];
    label = listingStatusLabels[props.status];
  } else if (props.type === 'transaction') {
    colorClass = transactionStatusColors[props.status];
    label = transactionStatusLabels[props.status];
  } else {
    colorClass = kycStatusColors[props.status];
    label = kycStatusLabels[props.status];
  }

  return (
    <span className={`${colorClass} border px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap`}>
      {label}
    </span>
  );
}
