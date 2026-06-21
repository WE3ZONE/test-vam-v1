export type ListingStatus =
  | 'draft'
  | 'pending_verification'
  | 'rejected'
  | 'published'
  | 'reserved'
  | 'payment_pending'
  | 'transfer_in_progress'
  | 'completed'
  | 'cancelled'
  | 'expired'
  | 'reported';

export type LoanType = 'gharz_hasaneh' | 'ezdevaj' | 'farzandavari' | 'maskan' | 'tejari' | 'other';

export type ListingType = 'standard' | 'urgent';

export type UserRole = 'buyer' | 'seller' | 'operator' | 'admin';

export type KycStatus = 'not_submitted' | 'pending' | 'verified' | 'rejected';

export type TransactionStatus =
  | 'requested'
  | 'seller_confirmed'
  | 'payment_pending'
  | 'payment_verified'
  | 'transfer_in_progress'
  | 'transfer_confirmed'
  | 'completed'
  | 'disputed'
  | 'cancelled';

export interface User {
  id: string;
  phone: string;
  name: string;
  nationalId: string;
  iban: string;
  cardNumber: string;
  role: UserRole;
  kycStatus: KycStatus;
  kycDocuments: { type: string; uploaded: boolean; verified: boolean }[];
  isSuspended: boolean;
  isBlacklisted: boolean;
  createdAt: string;
  city: string;
}

export interface Listing {
  id: number;
  sellerId: string;
  bank: string;
  loanType: LoanType;
  loanProvider: string;
  amount: string;
  installments: string;
  interest: string;
  duration: string;
  price: string;
  suggestedPrice: string;
  location: string;
  province: string;
  urgent: boolean;
  listingType: ListingType;
  status: ListingStatus;
  guarantorRequirements: string;
  description: string;
  createdAt: string;
  views: number;
  color: string;
  icon: string;
  rejectionReason?: string;
}

export type TransactionMode = 'escrow' | 'direct';

export interface Transaction {
  id: string;
  listingId: number;
  buyerId: string;
  sellerId: string;
  amount: string;
  platformFee: string;
  mode: TransactionMode;
  status: TransactionStatus;
  createdAt: string;
  paymentDeadline: string;
  transferDeadline: string;
  buyerOtpConfirmed: boolean;
  sellerOtpConfirmed: boolean;
  documents: { name: string; uploaded: boolean }[];
  timeline: { status: TransactionStatus; date: string; note: string }[];
}

export interface Ticket {
  id: string;
  userId: string;
  subject: string;
  category: string;
  status: 'open' | 'in_progress' | 'closed';
  priority: 'low' | 'medium' | 'high';
  date: string;
  messages: { sender: 'user' | 'support' | 'system'; text: string; time: string }[];
}

export interface NotificationSubscription {
  id: string;
  userId: string;
  bank: string;
  loanType: LoanType;
  minAmount: string;
  maxAmount: string;
  city: string;
  createdAt: string;
}

export interface Favorite {
  userId: string;
  listingId: number;
  addedAt: string;
}

export interface Dispute {
  id: string;
  transactionId: string;
  reporterId: string;
  reason: string;
  status: 'open' | 'investigating' | 'resolved' | 'rejected';
  createdAt: string;
  resolution?: string;
}

export interface AuditLogEntry {
  id: string;
  userId: string;
  action: string;
  target: string;
  timestamp: string;
  details: string;
}

export interface Bank {
  id: number;
  name: string;
  type: string;
  maxAmount: string;
  interest: string;
  maxInstallments: string;
  color: string;
  active: boolean;
}

export const loanTypeLabels: Record<LoanType, string> = {
  gharz_hasaneh: 'قرض‌الحسنه',
  ezdevaj: 'وام ازدواج',
  farzandavari: 'وام فرزندآوری',
  maskan: 'وام مسکن',
  tejari: 'تجاری',
  other: 'سایر',
};

export const listingStatusLabels: Record<ListingStatus, string> = {
  draft: 'پیش‌نویس',
  pending_verification: 'در انتظار بررسی',
  rejected: 'رد شده',
  published: 'منتشر شده',
  reserved: 'رزرو شده',
  payment_pending: 'در انتظار پرداخت',
  transfer_in_progress: 'در حال انتقال',
  completed: 'تکمیل شده',
  cancelled: 'لغو شده',
  expired: 'منقضی شده',
  reported: 'گزارش شده',
};

export const transactionStatusLabels: Record<TransactionStatus, string> = {
  requested: 'درخواست ثبت شده',
  seller_confirmed: 'تایید فروشنده',
  payment_pending: 'در انتظار پرداخت',
  payment_verified: 'پرداخت تایید شده',
  transfer_in_progress: 'در حال انتقال',
  transfer_confirmed: 'انتقال تایید شده',
  completed: 'تکمیل شده',
  disputed: 'اختلاف',
  cancelled: 'لغو شده',
};

export const kycStatusLabels: Record<KycStatus, string> = {
  not_submitted: 'ارسال نشده',
  pending: 'در انتظار بررسی',
  verified: 'تایید شده',
  rejected: 'رد شده',
};

export const colorMap: Record<string, { gradient: string; border: string }> = {
  blue: { gradient: 'from-blue-900 to-blue-700', border: 'border-blue-800' },
  teal: { gradient: 'from-teal-900 to-teal-700', border: 'border-teal-800' },
  green: { gradient: 'from-green-900 to-green-700', border: 'border-green-800' },
  red: { gradient: 'from-red-900 to-red-700', border: 'border-red-800' },
  indigo: { gradient: 'from-indigo-900 to-indigo-700', border: 'border-indigo-800' },
};
