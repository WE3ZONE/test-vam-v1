'use client';

import { useState } from 'react';
import { useApp } from '@/components/AppContext';
import { useAlert } from '@/components/AlertModal';
import AdminSidebar from '@/components/AdminSidebar';
import StatusBadge from '@/components/StatusBadge';
import TransactionTimeline from '@/components/TransactionTimeline';
import { ListingStatus, TransactionStatus, loanTypeLabels } from '@/data/types';

type AdminTab = 'dashboard' | 'users' | 'verification' | 'listings' | 'transactions' | 'disputes' | 'reports' | 'settings';

export default function AdminPage() {
  const app = useApp();
  const alert = useAlert();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [listingFilter, setListingFilter] = useState<ListingStatus | ''>('');
  const [transactionFilter, setTransactionFilter] = useState<TransactionStatus | ''>('');
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedListing, setSelectedListing] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectTarget, setRejectTarget] = useState<{ type: 'listing' | 'user'; id: string | number } | null>(null);

  const pendingVerifications = app.users.filter(u => u.kycStatus === 'pending');
  const pendingListings = app.listings.filter(l => l.status === 'pending_verification');
  const activeTransactions = app.transactions.filter(t => !['completed', 'cancelled'].includes(t.status));
  const openDisputes = app.disputes.filter(d => d.status === 'open' || d.status === 'investigating');

  const tabs = [
    { id: 'dashboard', label: 'داشبورد', shortLabel: 'داشبورد', icon: 'fa-chart-pie' },
    { id: 'users', label: 'کاربران', shortLabel: 'کاربران', icon: 'fa-users' },
    { id: 'verification', label: 'صف احراز هویت', shortLabel: 'احراز هویت', icon: 'fa-id-card', badge: pendingVerifications.length },
    { id: 'listings', label: 'آگهی‌ها', shortLabel: 'آگهی‌ها', icon: 'fa-bullhorn', badge: pendingListings.length },
    { id: 'transactions', label: 'تراکنش‌ها', shortLabel: 'تراکنش‌ها', icon: 'fa-exchange-alt', badge: activeTransactions.length },
    { id: 'disputes', label: 'اختلافات', shortLabel: 'اختلافات', icon: 'fa-gavel', badge: openDisputes.length },
    { id: 'reports', label: 'گزارشات', shortLabel: 'گزارشات', icon: 'fa-chart-bar' },
    { id: 'settings', label: 'تنظیمات', shortLabel: 'تنظیمات', icon: 'fa-gear' },
  ];

  const filteredListings = listingFilter ? app.listings.filter(l => l.status === listingFilter) : app.listings;
  const filteredTransactions = transactionFilter ? app.transactions.filter(t => t.status === transactionFilter) : app.transactions;
  const selectedTrx = selectedTransaction ? app.transactions.find(t => t.id === selectedTransaction) : null;
  const selectedUserData = selectedUser ? app.users.find(u => u.id === selectedUser) : null;
  const selectedListingData = selectedListing ? app.listings.find(l => l.id === selectedListing) : null;

  const completedTrx = app.transactions.filter(t => t.status === 'completed');
  const totalVolume = completedTrx.length * 25000000;

  return (
    <div className="max-w-[1440px] mx-auto w-full px-4 py-4 md:py-8 animate-fadeIn">
      <h1 className="text-xl md:text-2xl font-bold text-divar-text mb-4 md:mb-6 flex items-center gap-2">
        <i className="fa-solid fa-shield-halved text-brand-400" /> پنل مدیریت
      </h1>

      <div className="flex flex-col md:flex-row gap-6">
        <AdminSidebar tabs={tabs} activeTab={activeTab} onTabChange={id => { setActiveTab(id as AdminTab); setSelectedTransaction(null); setSelectedUser(null); setSelectedListing(null); }} />

        <section className="flex-1 bg-divar-surface border border-divar-border rounded-xl p-4 md:p-6 shadow-lg min-h-[400px]">

          {/* Dashboard */}
          {activeTab === 'dashboard' && (
            <div>
              <h2 className="text-lg font-bold text-divar-text mb-4">نمای کلی</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {[
                  { label: 'کل کاربران', value: app.users.length, icon: 'fa-users', color: 'text-brand-500' },
                  { label: 'آگهی‌های فعال', value: app.listings.filter(l => l.status === 'published').length, icon: 'fa-bullhorn', color: 'text-green-500' },
                  { label: 'تراکنش‌های فعال', value: activeTransactions.length, icon: 'fa-exchange-alt', color: 'text-blue-400' },
                  { label: 'در انتظار بررسی', value: pendingVerifications.length + pendingListings.length, icon: 'fa-clock', color: 'text-yellow-500' },
                  { label: 'معاملات موفق', value: completedTrx.length, icon: 'fa-check-circle', color: 'text-green-400' },
                  { label: 'اختلافات باز', value: openDisputes.length, icon: 'fa-gavel', color: 'text-red-400' },
                  { label: 'درآمد تخمینی', value: `${(totalVolume * 0.05 / 1000000).toFixed(0)}M`, icon: 'fa-coins', color: 'text-yellow-400' },
                  { label: 'کل آگهی‌ها', value: app.listings.length, icon: 'fa-list', color: 'text-indigo-400' },
                ].map(s => (
                  <div key={s.label} className="bg-divar-bg border border-divar-border rounded-lg p-3 md:p-4 text-center">
                    <i className={`fa-solid ${s.icon} ${s.color} text-lg md:text-xl mb-2`} />
                    <div className="text-lg md:text-xl font-bold text-divar-text">{s.value}</div>
                    <div className="text-[10px] text-divar-muted">{s.label}</div>
                  </div>
                ))}
              </div>
              <h3 className="text-sm font-bold text-divar-text mb-3">آخرین فعالیت‌ها</h3>
              <div className="space-y-2">
                {app.auditLog.slice(0, 5).map(log => (
                  <div key={log.id} className="bg-divar-bg border border-divar-border rounded-lg p-3 flex items-center gap-3 text-xs">
                    <i className="fa-solid fa-clock text-divar-muted" />
                    <div className="flex-1"><span className="text-divar-text font-medium">{log.action}</span> — <span className="text-divar-text">{log.details}</span></div>
                    <span className="text-divar-muted text-[10px] flex-shrink-0">{log.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Users - List */}
          {activeTab === 'users' && !selectedUserData && (
            <div>
              <h2 className="text-lg font-bold text-divar-text mb-4">مدیریت کاربران ({app.users.length})</h2>
              <div className="space-y-3">
                {app.users.map(u => (
                  <button key={u.id} onClick={() => setSelectedUser(u.id)} className="w-full bg-divar-bg border border-divar-border rounded-lg p-4 text-right hover:border-brand-500/50 transition">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-divar-surface border border-divar-border flex items-center justify-center text-divar-muted flex-shrink-0"><i className="fa-solid fa-user" /></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-divar-text font-medium text-sm">{u.name}</span>
                          <StatusBadge type="kyc" status={u.kycStatus} />
                        </div>
                        <div className="text-xs text-divar-muted flex items-center gap-3">
                          <span className="font-mono" dir="ltr">{u.phone}</span>
                          <span>{u.city}</span>
                          <span>{u.role === 'admin' ? 'مدیر' : u.role === 'operator' ? 'اپراتور' : u.role === 'seller' ? 'فروشنده' : 'خریدار'}</span>
                          {u.isSuspended && <span className="text-red-400">تعلیق شده</span>}
                        </div>
                      </div>
                      <i className="fa-solid fa-chevron-left text-divar-muted text-xs" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Users - Detail */}
          {activeTab === 'users' && selectedUserData && (
            <div>
              <button onClick={() => setSelectedUser(null)} className="text-divar-muted hover:text-divar-text transition flex items-center gap-2 mb-4 text-sm"><i className="fa-solid fa-arrow-right" /> بازگشت</button>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-divar-bg border-2 border-brand-500 flex items-center justify-center text-brand-500 text-xl flex-shrink-0"><i className="fa-solid fa-user" /></div>
                <div>
                  <h2 className="text-lg font-bold text-divar-text">{selectedUserData.name}</h2>
                  <div className="text-xs text-divar-muted mt-1 flex items-center gap-3 flex-wrap">
                    <span className="font-mono" dir="ltr">{selectedUserData.phone}</span>
                    <span>{selectedUserData.city}</span>
                    <StatusBadge type="kyc" status={selectedUserData.kycStatus} />
                    {selectedUserData.isSuspended && <span className="text-red-400 font-bold">تعلیق شده</span>}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-divar-bg border border-divar-border rounded-lg p-4">
                  <h3 className="text-xs text-divar-muted mb-2">اطلاعات هویتی</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-divar-muted">کد ملی:</span><span className="text-divar-text font-mono" dir="ltr">{selectedUserData.nationalId || '—'}</span></div>
                    <div className="flex justify-between"><span className="text-divar-muted">شماره شبا:</span><span className="text-divar-text font-mono text-xs" dir="ltr">{selectedUserData.iban || '—'}</span></div>
                    <div className="flex justify-between"><span className="text-divar-muted">شماره کارت:</span><span className="text-divar-text font-mono" dir="ltr">{selectedUserData.cardNumber || '—'}</span></div>
                    <div className="flex justify-between"><span className="text-divar-muted">تاریخ عضویت:</span><span className="text-divar-text">{selectedUserData.createdAt}</span></div>
                  </div>
                </div>
                <div className="bg-divar-bg border border-divar-border rounded-lg p-4">
                  <h3 className="text-xs text-divar-muted mb-2">مدارک</h3>
                  <div className="space-y-2">
                    {selectedUserData.kycDocuments.map(d => (
                      <div key={d.type} className="flex items-center justify-between text-sm">
                        <span className="text-divar-text">{d.type}</span>
                        <span className={`text-xs flex items-center gap-1 ${d.uploaded ? (d.verified ? 'text-green-400' : 'text-yellow-500') : 'text-red-400'}`}>
                          <i className={`fa-solid ${d.uploaded ? (d.verified ? 'fa-check-circle' : 'fa-clock') : 'fa-xmark'}`} />
                          {d.uploaded ? (d.verified ? 'تایید شده' : 'بررسی نشده') : 'آپلود نشده'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="bg-divar-bg border border-divar-border rounded-lg p-4 mb-4">
                <h3 className="text-xs text-divar-muted mb-2">آمار کاربر</h3>
                <div className="grid grid-cols-3 gap-4 text-center text-sm">
                  <div><div className="text-divar-text font-bold">{app.listings.filter(l => l.sellerId === selectedUserData.id).length}</div><div className="text-[10px] text-divar-muted">آگهی</div></div>
                  <div><div className="text-divar-text font-bold">{app.transactions.filter(t => t.buyerId === selectedUserData.id || t.sellerId === selectedUserData.id).length}</div><div className="text-[10px] text-divar-muted">تراکنش</div></div>
                  <div><div className="text-divar-text font-bold">{app.tickets.filter(t => t.userId === selectedUserData.id).length}</div><div className="text-[10px] text-divar-muted">تیکت</div></div>
                </div>
              </div>
              <div className="flex gap-3 flex-wrap">
                {selectedUserData.kycStatus === 'pending' && (
                  <>
                    <button onClick={() => { app.updateUserKyc(selectedUserData.id, 'verified'); alert.showAlert('تایید', `احراز هویت ${selectedUserData.name} تایید شد.`, 'success'); }} className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded text-xs font-bold transition">تایید احراز هویت</button>
                    <button onClick={() => { setRejectTarget({ type: 'user', id: selectedUserData.id }); setRejectReason(''); }} className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded text-xs font-bold transition">رد احراز هویت</button>
                  </>
                )}
                {!selectedUserData.isSuspended ? (
                  <button onClick={() => { app.suspendUser(selectedUserData.id, true); alert.showAlert('تعلیق', `${selectedUserData.name} تعلیق شد.`); }} className="bg-yellow-700 hover:bg-yellow-600 text-white px-4 py-2 rounded text-xs font-bold transition">تعلیق کاربر</button>
                ) : (
                  <button onClick={() => { app.suspendUser(selectedUserData.id, false); alert.showAlert('رفع تعلیق', `تعلیق برداشته شد.`, 'success'); }} className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded text-xs font-bold transition">رفع تعلیق</button>
                )}
                <button onClick={() => { app.blacklistUser(selectedUserData.id, true); alert.showAlert('لیست سیاه', `${selectedUserData.name} به لیست سیاه اضافه شد.`); }} className="bg-red-900 hover:bg-red-800 text-white px-4 py-2 rounded text-xs font-bold transition">لیست سیاه</button>
              </div>
            </div>
          )}

          {/* Verification Queue */}
          {activeTab === 'verification' && (
            <div>
              <h2 className="text-lg font-bold text-divar-text mb-4">صف احراز هویت ({pendingVerifications.length})</h2>
              {pendingVerifications.length === 0 ? (
                <div className="text-center text-divar-muted py-12"><i className="fa-solid fa-check-circle text-3xl text-green-500 mb-3" /><p>صف خالی است</p></div>
              ) : (
                <div className="space-y-4">
                  {pendingVerifications.map(u => (
                    <div key={u.id} className="bg-divar-bg border border-divar-border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div><h3 className="text-divar-text font-bold">{u.name}</h3><div className="text-xs text-divar-muted font-mono" dir="ltr">{u.phone} | {u.nationalId}</div></div>
                        <StatusBadge type="kyc" status={u.kycStatus} />
                      </div>
                      <div className="text-xs text-divar-text mb-3">
                        <span className="text-divar-muted">مدارک: </span>
                        {u.kycDocuments.map(d => <span key={d.type} className={`ml-2 ${d.uploaded ? 'text-green-400' : 'text-red-400'}`}><i className={`fa-solid ${d.uploaded ? 'fa-check' : 'fa-xmark'} ml-1`} />{d.type}</span>)}
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => { app.updateUserKyc(u.id, 'verified'); alert.showAlert('تایید', `احراز هویت ${u.name} تایید شد.`, 'success'); }} className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded text-xs font-bold transition">تایید</button>
                        <button onClick={() => { app.updateUserKyc(u.id, 'rejected'); alert.showAlert('رد شد', `احراز هویت ${u.name} رد شد.`); }} className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded text-xs font-bold transition">رد</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Listings - List */}
          {activeTab === 'listings' && !selectedListingData && (
            <div>
              <div className="flex justify-between items-center mb-4 gap-3 flex-wrap">
                <h2 className="text-lg font-bold text-divar-text">مدیریت آگهی‌ها ({filteredListings.length})</h2>
                <select value={listingFilter} onChange={e => setListingFilter(e.target.value as ListingStatus | '')} className="bg-divar-bg border border-divar-border text-divar-text text-xs rounded-md px-3 py-2 outline-none">
                  <option value="">همه وضعیت‌ها</option>
                  <option value="pending_verification">در انتظار بررسی</option>
                  <option value="published">منتشر شده</option>
                  <option value="rejected">رد شده</option>
                  <option value="draft">پیش‌نویس</option>
                  <option value="reserved">رزرو شده</option>
                  <option value="completed">تکمیل شده</option>
                </select>
              </div>
              <div className="space-y-3">
                {filteredListings.map(l => {
                  const seller = app.getUserById(l.sellerId);
                  return (
                    <button key={l.id} onClick={() => setSelectedListing(l.id)} className="w-full bg-divar-bg border border-divar-border rounded-lg p-4 text-right hover:border-brand-500/50 transition">
                      <div className="flex justify-between items-start mb-1 gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="text-divar-text text-sm font-bold truncate">{l.bank} — {l.amount} تومان</div>
                          <div className="text-[11px] text-divar-muted mt-0.5 flex items-center gap-2 flex-wrap">
                            <span className="font-mono">L-{l.id}</span>
                            <span>{loanTypeLabels[l.loanType]}</span>
                            <span>فروشنده: {seller?.name}</span>
                            <span>{l.location}</span>
                          </div>
                        </div>
                        <StatusBadge type="listing" status={l.status} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Listings - Detail */}
          {activeTab === 'listings' && selectedListingData && (
            <div>
              <button onClick={() => setSelectedListing(null)} className="text-divar-muted hover:text-divar-text transition flex items-center gap-2 mb-4 text-sm"><i className="fa-solid fa-arrow-right" /> بازگشت</button>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-lg font-bold text-divar-text">آگهی L-{selectedListingData.id}</h2>
                  <div className="text-xs text-divar-muted mt-1">{selectedListingData.bank} | {loanTypeLabels[selectedListingData.loanType]} | {selectedListingData.location}</div>
                </div>
                <StatusBadge type="listing" status={selectedListingData.status} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-divar-bg border border-divar-border rounded-lg p-4">
                  <h3 className="text-xs text-divar-muted mb-3">اطلاعات وام</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-divar-muted">مبلغ وام:</span><span className="text-divar-text font-bold">{selectedListingData.amount} تومان</span></div>
                    <div className="flex justify-between"><span className="text-divar-muted">اقساط:</span><span className="text-divar-text">{selectedListingData.installments} ماهه</span></div>
                    <div className="flex justify-between"><span className="text-divar-muted">نرخ سود:</span><span className="text-divar-text">{selectedListingData.interest}</span></div>
                    <div className="flex justify-between"><span className="text-divar-muted">مدت:</span><span className="text-divar-text">{selectedListingData.duration}</span></div>
                    <div className="flex justify-between"><span className="text-divar-muted">قیمت فروش:</span><span className="text-divar-text font-bold">{selectedListingData.price} تومان</span></div>
                    <div className="flex justify-between"><span className="text-divar-muted">پیشنهاد سیستم:</span><span className="text-brand-400">{selectedListingData.suggestedPrice} تومان</span></div>
                  </div>
                </div>
                <div className="bg-divar-bg border border-divar-border rounded-lg p-4">
                  <h3 className="text-xs text-divar-muted mb-3">اطلاعات فروشنده</h3>
                  {(() => { const s = app.getUserById(selectedListingData.sellerId); return s ? (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-divar-muted">نام:</span><span className="text-divar-text">{s.name}</span></div>
                      <div className="flex justify-between"><span className="text-divar-muted">تلفن:</span><span className="text-divar-text font-mono" dir="ltr">{s.phone}</span></div>
                      <div className="flex justify-between"><span className="text-divar-muted">شهر:</span><span className="text-divar-text">{s.city}</span></div>
                      <div className="flex justify-between"><span className="text-divar-muted">احراز هویت:</span><StatusBadge type="kyc" status={s.kycStatus} /></div>
                    </div>
                  ) : <span className="text-divar-muted text-xs">نامشخص</span>; })()}
                </div>
              </div>
              {selectedListingData.guarantorRequirements && (
                <div className="bg-divar-bg border border-divar-border rounded-lg p-4 mb-4">
                  <h3 className="text-xs text-divar-muted mb-2">شرایط ضامن</h3>
                  <p className="text-sm text-divar-text">{selectedListingData.guarantorRequirements}</p>
                </div>
              )}
              {selectedListingData.description && (
                <div className="bg-divar-bg border border-divar-border rounded-lg p-4 mb-4">
                  <h3 className="text-xs text-divar-muted mb-2">توضیحات</h3>
                  <p className="text-sm text-divar-text">{selectedListingData.description}</p>
                </div>
              )}
              {selectedListingData.rejectionReason && (
                <div className="bg-red-900/10 border border-red-800/30 rounded-lg p-4 mb-4">
                  <h3 className="text-xs text-red-400 mb-1">دلیل رد:</h3>
                  <p className="text-sm text-divar-text">{selectedListingData.rejectionReason}</p>
                </div>
              )}
              <div className="flex gap-3 flex-wrap">
                {selectedListingData.status === 'pending_verification' && (
                  <>
                    <button onClick={() => { app.updateListingStatus(selectedListingData.id, 'published'); alert.showAlert('تایید', `آگهی L-${selectedListingData.id} منتشر شد.`, 'success'); setSelectedListing(null); }} className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded text-xs font-bold transition">تایید و انتشار</button>
                    <button onClick={() => { setRejectTarget({ type: 'listing', id: selectedListingData.id }); setRejectReason(''); }} className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded text-xs font-bold transition">رد آگهی</button>
                  </>
                )}
                {selectedListingData.status === 'published' && (
                  <button onClick={() => { app.updateListingStatus(selectedListingData.id, 'expired'); alert.showAlert('بسته شد', 'آگهی بسته شد.'); setSelectedListing(null); }} className="bg-yellow-700 hover:bg-yellow-600 text-white px-4 py-2 rounded text-xs font-bold transition">بستن آگهی</button>
                )}
              </div>
            </div>
          )}

          {/* Transactions */}
          {activeTab === 'transactions' && !selectedTrx && (
            <div>
              <div className="flex justify-between items-center mb-4 gap-3 flex-wrap">
                <h2 className="text-lg font-bold text-divar-text">مدیریت تراکنش‌ها</h2>
                <select value={transactionFilter} onChange={e => setTransactionFilter(e.target.value as TransactionStatus | '')} className="bg-divar-bg border border-divar-border text-divar-text text-xs rounded-md px-3 py-2 outline-none">
                  <option value="">همه</option>
                  <option value="requested">درخواست</option>
                  <option value="payment_pending">انتظار پرداخت</option>
                  <option value="transfer_in_progress">در حال انتقال</option>
                  <option value="completed">تکمیل</option>
                  <option value="disputed">اختلاف</option>
                </select>
              </div>
              <div className="space-y-3">
                {filteredTransactions.map(t => {
                  const listing = app.getListingById(t.listingId);
                  const buyer = app.getUserById(t.buyerId);
                  return (
                    <button key={t.id} onClick={() => setSelectedTransaction(t.id)} className="w-full bg-divar-bg border border-divar-border rounded-lg p-4 text-right hover:border-brand-500/50 transition">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-mono text-xs text-divar-text">{t.id}</div>
                        <StatusBadge type="transaction" status={t.status} />
                      </div>
                      <div className="text-sm text-divar-text font-medium mb-1">{listing?.bank} — {t.amount} تومان</div>
                      <div className="text-xs text-divar-muted">خریدار: {buyer?.name} | تاریخ: {t.createdAt}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'transactions' && selectedTrx && (
            <div>
              <button onClick={() => setSelectedTransaction(null)} className="text-divar-muted hover:text-divar-text transition flex items-center gap-2 mb-4 text-sm">
                <i className="fa-solid fa-arrow-right" /> بازگشت
              </button>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-lg font-bold text-divar-text">{selectedTrx.id}</h2>
                  <div className="text-xs text-divar-muted">{selectedTrx.amount} تومان | کارمزد: {selectedTrx.platformFee}</div>
                </div>
                <StatusBadge type="transaction" status={selectedTrx.status} />
              </div>
              <div className="bg-divar-bg border border-divar-border rounded-lg p-4 mb-4">
                <TransactionTimeline transaction={selectedTrx} />
              </div>
              <div className="flex gap-3 flex-wrap">
                {selectedTrx.status === 'payment_pending' && (
                  <button onClick={() => { app.updateTransactionStatus(selectedTrx.id, 'payment_verified', 'پرداخت توسط اپراتور تایید شد'); alert.showAlert('تایید', 'پرداخت تایید شد.', 'success'); }} className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded text-xs font-bold transition">تایید پرداخت</button>
                )}
                {selectedTrx.status === 'payment_verified' && (
                  <button onClick={() => { app.updateTransactionStatus(selectedTrx.id, 'transfer_in_progress', 'فروشنده ۷ روز فرصت انتقال دارد'); alert.showAlert('شروع انتقال', 'مرحله انتقال شروع شد.', 'success'); }} className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded text-xs font-bold transition">شروع انتقال</button>
                )}
                {['requested', 'seller_confirmed', 'payment_pending', 'transfer_in_progress'].includes(selectedTrx.status) && (
                  <button onClick={() => { app.updateTransactionStatus(selectedTrx.id, 'cancelled', 'لغو توسط اپراتور'); alert.showAlert('لغو', 'تراکنش لغو شد.'); }} className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded text-xs font-bold transition">لغو تراکنش</button>
                )}
              </div>
            </div>
          )}

          {/* Disputes */}
          {activeTab === 'disputes' && (
            <div>
              <h2 className="text-lg font-bold text-divar-text mb-4">مدیریت اختلافات ({app.disputes.length})</h2>
              {app.disputes.length === 0 ? (
                <div className="text-center text-divar-muted py-12"><p>اختلافی ثبت نشده</p></div>
              ) : (
                <div className="space-y-4">
                  {app.disputes.map(d => {
                    const reporter = app.getUserById(d.reporterId);
                    return (
                      <div key={d.id} className="bg-divar-bg border border-divar-border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-mono text-xs text-divar-text">{d.id} — تراکنش {d.transactionId}</div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${d.status === 'open' ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800' : d.status === 'investigating' ? 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700' : 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'}`}>{d.status === 'open' ? 'باز' : d.status === 'investigating' ? 'در حال بررسی' : 'حل شده'}</span>
                        </div>
                        <p className="text-sm text-divar-text mb-2">{d.reason}</p>
                        <div className="text-xs text-divar-muted mb-3">گزارش‌دهنده: {reporter?.name} | تاریخ: {d.createdAt}</div>
                        {d.status === 'open' && (
                          <div className="flex gap-3">
                            <button onClick={() => { app.resolveDispute(d.id, 'بررسی شد و مشکل حل شد.'); alert.showAlert('حل شد', 'اختلاف حل شد.', 'success'); }} className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded text-xs font-bold transition">حل اختلاف</button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Reports */}
          {activeTab === 'reports' && (
            <div>
              <h2 className="text-lg font-bold text-divar-text mb-4">گزارشات</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-divar-bg border border-divar-border rounded-lg p-5 text-center">
                  <div className="text-2xl font-bold text-divar-text mb-1">{completedTrx.length}</div>
                  <div className="text-xs text-divar-muted">معاملات موفق</div>
                </div>
                <div className="bg-divar-bg border border-divar-border rounded-lg p-5 text-center">
                  <div className="text-2xl font-bold text-brand-400 mb-1">{(totalVolume * 0.05 / 1000000).toFixed(0)}M</div>
                  <div className="text-xs text-divar-muted">درآمد کارمزد (تومان)</div>
                </div>
                <div className="bg-divar-bg border border-divar-border rounded-lg p-5 text-center">
                  <div className="text-2xl font-bold text-green-400 mb-1">{app.listings.filter(l => l.status === 'published').length}</div>
                  <div className="text-xs text-divar-muted">آگهی فعال</div>
                </div>
              </div>
              <h3 className="text-sm font-bold text-divar-text mb-3">آگهی‌ها بر اساس بانک</h3>
              <div className="space-y-2">
                {['رسالت', 'مهر ایران', 'وام ازدواج', 'بانک ملت', 'وام مسکن'].map(bank => {
                  const count = app.listings.filter(l => l.bank.includes(bank.replace('وام ', ''))).length;
                  return (
                    <div key={bank} className="flex items-center gap-3">
                      <span className="text-xs text-divar-text w-24">{bank}</span>
                      <div className="flex-1 bg-divar-bg rounded-full h-4 border border-divar-border overflow-hidden">
                        <div className="h-full bg-brand-600 rounded-full" style={{ width: `${(count / app.listings.length) * 100}%` }} />
                      </div>
                      <span className="text-xs text-divar-muted w-6">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Settings */}
          {activeTab === 'settings' && (
            <div>
              <h2 className="text-lg font-bold text-divar-text mb-4">تنظیمات</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-divar-text mb-3">بانک‌ها و موسسات</h3>
                  <div className="space-y-2">
                    {['بانک رسالت', 'بانک مهر ایران', 'بانک مسکن', 'بانک ملت', 'بانک ملی'].map(bank => (
                      <div key={bank} className="bg-divar-bg border border-divar-border rounded-lg p-3 flex items-center justify-between">
                        <span className="text-sm text-divar-text">{bank}</span>
                        <span className="bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800 px-2 py-0.5 rounded text-[10px] font-bold">فعال</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

        </section>
      </div>

      {/* Reject reason modal */}
      {rejectTarget && (
        <>
          <div className="fixed inset-0 bg-black/75 z-[100]" onClick={() => setRejectTarget(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-divar-surface border border-divar-border rounded-xl p-6 w-[90%] max-w-[400px] z-[101] shadow-2xl">
            <h3 className="text-lg font-bold text-divar-text mb-4">دلیل رد</h3>
            <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="دلیل رد را بنویسید..." className="w-full bg-divar-bg border border-divar-border text-divar-text rounded-lg py-3 px-4 mb-4 text-sm focus:outline-none focus:border-brand-500" rows={3} />
            <div className="flex gap-3">
              <button onClick={() => setRejectTarget(null)} className="flex-1 bg-divar-bg border border-divar-border text-divar-text py-2.5 rounded-lg font-bold transition hover:bg-divar-surfaceHover">انصراف</button>
              <button onClick={() => {
                if (rejectTarget.type === 'listing') {
                  app.updateListingStatus(rejectTarget.id as number, 'rejected', rejectReason);
                  alert.showAlert('رد شد', `آگهی رد شد.`);
                } else {
                  app.updateUserKyc(rejectTarget.id as string, 'rejected');
                  alert.showAlert('رد شد', `احراز هویت رد شد.`);
                }
                setRejectTarget(null);
              }} className="flex-1 bg-red-700 hover:bg-red-600 text-white py-2.5 rounded-lg font-bold transition">رد</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
