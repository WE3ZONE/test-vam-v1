export type { Listing, Bank, LoanType, ListingStatus, ListingType, User, Transaction, Ticket, NotificationSubscription, Favorite, Dispute, AuditLogEntry, UserRole, KycStatus, TransactionStatus } from './types';
export { colorMap, loanTypeLabels, listingStatusLabels, transactionStatusLabels, kycStatusLabels } from './types';
export { mockListingsExpanded } from './mockListings';
export { mockUsers } from './mockUsers';
export { mockTransactions } from './mockTransactions';
export { mockTicketsData } from './mockTickets';
export { mockFavorites, mockNotificationSubs, mockDisputes, mockAuditLog } from './mockNotifications';

import { mockListingsExpanded } from './mockListings';
import { Bank } from './types';

export const mockListings = mockListingsExpanded;

export const mockBanks: Bank[] = [
  { id: 1, name: 'بانک رسالت', type: 'قرض‌الحسنه', maxAmount: '۳۰۰ میلیون', interest: '۲٪', maxInstallments: '۶۰ ماه', color: 'blue', active: true },
  { id: 2, name: 'بانک مهر ایران', type: 'قرض‌الحسنه', maxAmount: '۲۰۰ میلیون', interest: '۴٪', maxInstallments: '۶۰ ماه', color: 'teal', active: true },
  { id: 3, name: 'وام ازدواج/فرزندآوری', type: 'دولتی', maxAmount: '۵۰۰ میلیون', interest: '۴٪', maxInstallments: '۱۲۰ ماه', color: 'green', active: true },
  { id: 4, name: 'بانک مسکن / اوراق', type: 'تجاری', maxAmount: '۱ میلیارد', interest: '۲۲٪', maxInstallments: '۱۸۰ ماه', color: 'indigo', active: true },
  { id: 5, name: 'بانک ملت', type: 'تجاری', maxAmount: '۲۰۰ میلیون', interest: '۱۸٪', maxInstallments: '۶۰ ماه', color: 'red', active: true },
  { id: 6, name: 'صندوق جاویدان', type: 'قرض‌الحسنه', maxAmount: '۱۵۰ میلیون', interest: '۲٪', maxInstallments: '۴۸ ماه', color: 'teal', active: true },
];
