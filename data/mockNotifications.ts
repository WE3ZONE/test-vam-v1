import { Favorite, NotificationSubscription, Dispute, AuditLogEntry, Radar } from './types';

export const mockFavorites: Favorite[] = [
  { userId: 'u-demo', listingId: 1, addedAt: '۱۴۰۳/۰۳/۱۲' },
  { userId: 'u-demo', listingId: 3, addedAt: '۱۴۰۳/۰۳/۱۳' },
  { userId: 'u-demo', listingId: 5, addedAt: '۱۴۰۳/۰۳/۱۴' },
  { userId: 'u6', listingId: 2, addedAt: '۱۴۰۳/۰۳/۱۵' },
];

export const mockNotificationSubs: NotificationSubscription[] = [
  {
    id: 'ns1',
    userId: 'u-demo',
    bank: 'رسالت',
    loanType: 'gharz_hasaneh',
    minAmount: '۱۰۰,۰۰۰,۰۰۰',
    maxAmount: '۳۰۰,۰۰۰,۰۰۰',
    city: 'تهران',
    createdAt: '۱۴۰۳/۰۳/۱۰',
  },
  {
    id: 'ns2',
    userId: 'u-demo',
    bank: '',
    loanType: 'ezdevaj',
    minAmount: '',
    maxAmount: '۵۰۰,۰۰۰,۰۰۰',
    city: '',
    createdAt: '۱۴۰۳/۰۳/۱۲',
  },
];

export const mockDisputes: Dispute[] = [
  {
    id: 'DSP-001',
    transactionId: 'TRX-4890',
    reporterId: 'u4',
    reason: 'مهلت ۷ روزه انتقال امتیاز وام منقضی شده و فروشنده هنوز اقدامی انجام نداده است.',
    status: 'open',
    createdAt: '۱۴۰۳/۰۳/۰۹',
  },
];

export const mockRadars: Radar[] = [
  {
    id: 'rd1',
    userId: 'u-demo',
    title: 'رادار وام رسالت',
    minAmount: '۱۰۰,۰۰۰,۰۰۰',
    maxAmount: '۳۰۰,۰۰۰,۰۰۰',
    installments: '۶۰',
    maxInterest: '۲٪',
    bank: 'رسالت',
    loanType: 'gharz_hasaneh',
    city: 'تهران',
    isActive: true,
    createdAt: '۱۴۰۳/۰۳/۱۰',
    matchCount: 3,
  },
  {
    id: 'rd2',
    userId: 'u-demo',
    title: 'رادار وام ازدواج',
    minAmount: '۲۰۰,۰۰۰,۰۰۰',
    maxAmount: '۵۰۰,۰۰۰,۰۰۰',
    installments: '۱۲۰',
    maxInterest: '۴٪',
    bank: '',
    loanType: 'ezdevaj',
    city: '',
    isActive: true,
    createdAt: '۱۴۰۳/۰۳/۰۸',
    matchCount: 2,
  },
];

export const mockAuditLog: AuditLogEntry[] = [
  { id: 'al1', userId: 'u1', action: 'تایید آگهی', target: 'آگهی #1', timestamp: '۱۴۰۳/۰۳/۱۰ - ۰۹:۰۰', details: 'آگهی وام رسالت ۳۰۰ میلیون تایید شد' },
  { id: 'al2', userId: 'u2', action: 'تایید پرداخت', target: 'TRX-7742', timestamp: '۱۴۰۳/۰۳/۰۹ - ۱۰:۰۰', details: 'پرداخت ۲۴ میلیون تومان تایید شد' },
  { id: 'al3', userId: 'u1', action: 'تعلیق کاربر', target: 'کاربر #u7', timestamp: '۱۴۰۳/۰۳/۰۸ - ۱۵:۰۰', details: 'به دلیل مدارک جعلی' },
  { id: 'al4', userId: 'u2', action: 'رد آگهی', target: 'آگهی #9', timestamp: '۱۴۰۳/۰۳/۰۲ - ۱۱:۰۰', details: 'تصویر ناخوانا' },
  { id: 'al5', userId: 'u1', action: 'تایید هویت', target: 'کاربر u3', timestamp: '۱۴۰۳/۰۲/۰۵ - ۰۸:۳۰', details: 'احراز هویت علی محمدی تایید شد' },
  { id: 'al6', userId: 'u2', action: 'تایید آگهی', target: 'آگهی #3', timestamp: '۱۴۰۳/۰۳/۱۲ - ۱۴:۰۰', details: 'آگهی وام ازدواج ۳۵۰ میلیون تایید شد' },
  { id: 'al7', userId: 'u1', action: 'بروزرسانی تنظیمات', target: 'قیمت‌گذاری', timestamp: '۱۴۰۳/۰۳/۰۱ - ۱۰:۰۰', details: 'حداقل قیمت فروش ۵ درصد مبلغ وام تنظیم شد' },
];
