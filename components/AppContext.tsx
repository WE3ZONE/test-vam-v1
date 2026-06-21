'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import {
  Listing, Transaction, User, Ticket, Favorite, NotificationSubscription, Dispute, AuditLogEntry,
  ListingStatus, TransactionStatus, KycStatus,
} from '@/data/types';
import { mockListingsExpanded } from '@/data/mockListings';
import { mockUsers, DEMO_USER_ID } from '@/data/mockUsers';
import { mockTransactions } from '@/data/mockTransactions';
import { mockTicketsData } from '@/data/mockTickets';
import { mockFavorites, mockNotificationSubs, mockDisputes, mockAuditLog } from '@/data/mockNotifications';
import { useAuth } from './AuthContext';

interface AppState {
  listings: Listing[];
  transactions: Transaction[];
  users: User[];
  tickets: Ticket[];
  favorites: Favorite[];
  notifications: NotificationSubscription[];
  disputes: Dispute[];
  auditLog: AuditLogEntry[];
  currentUser: User | null;

  updateListingStatus: (id: number, status: ListingStatus, reason?: string) => void;
  addListing: (listing: Omit<Listing, 'id' | 'views' | 'createdAt'>) => void;
  updateTransactionStatus: (id: string, status: TransactionStatus, note?: string) => void;
  createTransaction: (listingId: number) => string | null;
  updateUserKyc: (userId: string, status: KycStatus) => void;
  suspendUser: (userId: string, suspend: boolean) => void;
  blacklistUser: (userId: string, blacklist: boolean) => void;
  toggleFavorite: (listingId: number) => void;
  isFavorite: (listingId: number) => boolean;
  addNotificationSub: (sub: Omit<NotificationSubscription, 'id' | 'createdAt'>) => void;
  removeNotificationSub: (id: string) => void;
  createDispute: (transactionId: string, reason: string) => void;
  resolveDispute: (id: string, resolution: string) => void;
  addTicketMessage: (ticketId: string, text: string) => void;
  getUserById: (id: string) => User | undefined;
  getListingById: (id: number) => Listing | undefined;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const [listings, setListings] = useState<Listing[]>(mockListingsExpanded);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [tickets, setTickets] = useState<Ticket[]>(mockTicketsData);
  const [favorites, setFavorites] = useState<Favorite[]>(mockFavorites);
  const [notifications, setNotifications] = useState<NotificationSubscription[]>(mockNotificationSubs);
  const [disputes, setDisputes] = useState<Dispute[]>(mockDisputes);
  const [auditLog] = useState<AuditLogEntry[]>(mockAuditLog);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    if (auth.isLoggedIn && auth.userPhone) {
      const demoUser = users.find(u => u.id === DEMO_USER_ID);
      if (demoUser) {
        const updated = { ...demoUser, phone: auth.userPhone };
        setCurrentUser(updated);
      }
    } else {
      setCurrentUser(null);
    }
  }, [auth.isLoggedIn, auth.userPhone]);

  const updateListingStatus = useCallback((id: number, status: ListingStatus, reason?: string) => {
    setListings(prev => prev.map(l => l.id === id ? { ...l, status, rejectionReason: reason || l.rejectionReason } : l));
  }, []);

  const addListing = useCallback((listing: Omit<Listing, 'id' | 'views' | 'createdAt'>) => {
    setListings(prev => [...prev, {
      ...listing,
      id: Math.max(...prev.map(l => l.id)) + 1,
      views: 0,
      createdAt: '۱۴۰۳/۰۳/۱۶',
    } as Listing]);
  }, []);

  const updateTransactionStatus = useCallback((id: string, status: TransactionStatus, note?: string) => {
    setTransactions(prev => prev.map(t => {
      if (t.id !== id) return t;
      return {
        ...t,
        status,
        timeline: [...t.timeline, {
          status,
          date: '۱۴۰۳/۰۳/۱۶ - ' + new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
          note: note || transactionStatusLabels[status],
        }],
        buyerOtpConfirmed: status === 'completed' ? true : t.buyerOtpConfirmed,
        sellerOtpConfirmed: status === 'completed' ? true : t.sellerOtpConfirmed,
      };
    }));
  }, []);

  const createTransaction = useCallback((listingId: number): string | null => {
    if (!currentUser) return null;
    const listing = listings.find(l => l.id === listingId);
    if (!listing) return null;
    const id = `TRX-${Math.floor(1000 + Math.random() * 9000)}`;
    const trx: Transaction = {
      id,
      listingId,
      buyerId: currentUser.id,
      sellerId: listing.sellerId,
      amount: listing.price,
      platformFee: '۵٪ مبلغ معامله',
      mode: 'escrow',
      status: 'requested',
      createdAt: '۱۴۰۳/۰۳/۱۶',
      paymentDeadline: '۱۴۰۳/۰۳/۱۸',
      transferDeadline: '',
      buyerOtpConfirmed: false,
      sellerOtpConfirmed: false,
      documents: [],
      timeline: [{ status: 'requested', date: '۱۴۰۳/۰۳/۱۶ - ' + new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }), note: 'درخواست خرید توسط خریدار ثبت شد' }],
    };
    setTransactions(prev => [...prev, trx]);
    updateListingStatus(listingId, 'reserved');
    return id;
  }, [currentUser, listings, updateListingStatus]);

  const updateUserKyc = useCallback((userId: string, status: KycStatus) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, kycStatus: status } : u));
    if (currentUser?.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, kycStatus: status } : prev);
    }
  }, [currentUser]);

  const suspendUser = useCallback((userId: string, suspend: boolean) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, isSuspended: suspend } : u));
  }, []);

  const blacklistUser = useCallback((userId: string, blacklist: boolean) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, isBlacklisted: blacklist } : u));
  }, []);

  const toggleFavorite = useCallback((listingId: number) => {
    if (!currentUser) return;
    setFavorites(prev => {
      const exists = prev.find(f => f.userId === currentUser.id && f.listingId === listingId);
      if (exists) return prev.filter(f => !(f.userId === currentUser.id && f.listingId === listingId));
      return [...prev, { userId: currentUser.id, listingId, addedAt: '۱۴۰۳/۰۳/۱۶' }];
    });
  }, [currentUser]);

  const isFavorite = useCallback((listingId: number) => {
    if (!currentUser) return false;
    return favorites.some(f => f.userId === currentUser.id && f.listingId === listingId);
  }, [currentUser, favorites]);

  const addNotificationSub = useCallback((sub: Omit<NotificationSubscription, 'id' | 'createdAt'>) => {
    setNotifications(prev => [...prev, { ...sub, id: `ns-${Date.now()}`, createdAt: '۱۴۰۳/۰۳/۱۶' }]);
  }, []);

  const removeNotificationSub = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const createDispute = useCallback((transactionId: string, reason: string) => {
    if (!currentUser) return;
    setDisputes(prev => [...prev, {
      id: `DSP-${Math.floor(100 + Math.random() * 900)}`,
      transactionId,
      reporterId: currentUser.id,
      reason,
      status: 'open',
      createdAt: '۱۴۰۳/۰۳/۱۶',
    }]);
  }, [currentUser]);

  const resolveDispute = useCallback((id: string, resolution: string) => {
    setDisputes(prev => prev.map(d => d.id === id ? { ...d, status: 'resolved' as const, resolution } : d));
  }, []);

  const addTicketMessage = useCallback((ticketId: string, text: string) => {
    setTickets(prev => prev.map(t => {
      if (t.id !== ticketId) return t;
      return { ...t, messages: [...t.messages, { sender: 'user' as const, text, time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }) }] };
    }));
  }, []);

  const getUserById = useCallback((id: string) => users.find(u => u.id === id), [users]);
  const getListingById = useCallback((id: number) => listings.find(l => l.id === id), [listings]);

  return (
    <AppContext.Provider value={{
      listings, transactions, users, tickets, favorites, notifications, disputes, auditLog, currentUser,
      updateListingStatus, addListing, updateTransactionStatus, createTransaction,
      updateUserKyc, suspendUser, blacklistUser,
      toggleFavorite, isFavorite, addNotificationSub, removeNotificationSub,
      createDispute, resolveDispute, addTicketMessage,
      getUserById, getListingById,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

import { transactionStatusLabels } from '@/data/types';
