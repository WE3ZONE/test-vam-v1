'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import { useAlert } from '@/components/AlertModal';
import { useApp } from '@/components/AppContext';
import StatusBadge from '@/components/StatusBadge';
import StepProgress from '@/components/StepProgress';
import TransactionTimeline from '@/components/TransactionTimeline';
import { Transaction, transactionStatusLabels, LoanType } from '@/data/types';
import ListingCard from '@/components/ListingCard';

type Tab = 'requests' | 'ads' | 'favorites' | 'radar' | 'tickets' | 'kyc';

export default function DashboardPage() {
  const auth = useAuth();
  const alert = useAlert();
  const app = useApp();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('requests');
  const [selectedTrx, setSelectedTrx] = useState<Transaction | null>(null);
  const [openTicket, setOpenTicket] = useState<string | null>(null);
  const [showRadarForm, setShowRadarForm] = useState(false);
  const [radarForm, setRadarForm] = useState({ title: '', minAmount: '', maxAmount: '', installments: '', maxInterest: '', bank: '', loanType: '' as LoanType | '', city: '' });

  useEffect(() => {
    if (!auth.isLoggedIn) {
      auth.setPendingNavigation('/dashboard');
      auth.openLoginModal();
    }
  }, [auth.isLoggedIn]);

  function handleLogout() {
    auth.logout();
    router.push('/');
    alert.showAlert('خروج', 'شما با موفقیت از حساب کاربری خارج شدید.', 'info');
  }

  const tabs: { id: Tab; label: string; shortLabel: string; icon: string }[] = [
    { id: 'requests', label: 'درخواست‌های خرید', shortLabel: 'درخواست‌ها', icon: 'fa-file-invoice-dollar' },
    { id: 'ads', label: 'آگهی‌های من', shortLabel: 'آگهی‌ها', icon: 'fa-bullhorn' },
    { id: 'favorites', label: 'علاقه‌مندی‌ها', shortLabel: 'علاقه‌مندی', icon: 'fa-heart' },
    { id: 'radar', label: 'رادار وام', shortLabel: 'رادار', icon: 'fa-satellite-dish' },
    { id: 'tickets', label: 'تیکت‌های پشتیبانی', shortLabel: 'تیکت‌ها', icon: 'fa-headset' },
    { id: 'kyc', label: 'اطلاعات هویتی', shortLabel: 'هویتی', icon: 'fa-id-card' },
  ];

  const myTransactions = app.currentUser
    ? app.transactions.filter(t => t.buyerId === app.currentUser!.id || t.sellerId === app.currentUser!.id)
    : [];

  const myListings = app.currentUser
    ? app.listings.filter(l => l.sellerId === app.currentUser!.id)
    : [];

  const myTickets = app.currentUser
    ? app.tickets.filter(t => t.userId === app.currentUser!.id)
    : app.tickets;

  const openTicketData = openTicket ? app.tickets.find(t => t.id === openTicket) : null;

  function advanceTransaction(trx: Transaction) {
    const nextMap: Record<string, string> = {
      requested: 'seller_confirmed',
      seller_confirmed: 'payment_pending',
      payment_pending: 'payment_verified',
      payment_verified: 'transfer_in_progress',
      transfer_in_progress: 'transfer_confirmed',
      transfer_confirmed: 'completed',
    };
    const next = nextMap[trx.status];
    if (next) {
      app.updateTransactionStatus(trx.id, next as Transaction['status'], transactionStatusLabels[next as Transaction['status']]);
      alert.showAlert('بروزرسانی', `وضعیت تراکنش به "${transactionStatusLabels[next as Transaction['status']]}" تغییر کرد.`, 'success');
    }
  }

  return (
    <div className="max-w-[1440px] mx-auto w-full px-4 py-4 md:py-8 animate-fadeIn">
      <h1 className="text-xl md:text-2xl font-bold text-divar-text mb-4 md:mb-6">داشبورد کاربری من</h1>

      {/* Mobile tabs */}
      <div className="md:hidden mb-4">
        <div className="bg-divar-surface border border-divar-border rounded-xl p-3 flex items-center gap-2 mb-3">
          <div className="w-10 h-10 bg-divar-bg border-2 border-brand-500 rounded-full flex items-center justify-center text-brand-500 text-lg flex-shrink-0">
            <i className="fa-solid fa-user" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-divar-text font-medium text-sm truncate">{app.currentUser?.name || auth.userPhone}</div>
            <div className="text-[10px] text-green-400 flex items-center gap-1">
              <i className="fa-solid fa-shield-check" /> {app.currentUser?.kycStatus === 'verified' ? 'احراز هویت شده' : 'در انتظار احراز هویت'}
            </div>
          </div>
          <button onClick={handleLogout} className="text-red-400 text-xs px-2 py-1 hover:bg-red-900/10 rounded transition">
            <i className="fa-solid fa-arrow-right-from-bracket" />
          </button>
        </div>
        <div className="bg-divar-surface border border-divar-border rounded-xl overflow-hidden">
          <div className="flex overflow-x-auto scrollbar-hide">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSelectedTrx(null); setOpenTicket(null); setShowRadarForm(false); }}
                className={`flex-1 min-w-[25%] flex flex-col items-center gap-1 py-3 px-2 text-center transition relative ${activeTab === tab.id ? 'text-divar-text' : 'text-divar-muted'}`}>
                <i className={`fa-solid ${tab.icon} text-base ${activeTab === tab.id ? 'text-brand-400' : ''}`} />
                <span className="text-[10px] font-medium whitespace-nowrap">{tab.shortLabel}</span>
                {activeTab === tab.id && <div className="absolute bottom-0 left-2 right-2 h-[3px] bg-brand-500 rounded-t-full" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <div className="bg-divar-surface border border-divar-border rounded-xl overflow-hidden shadow-lg">
            <div className="p-6 border-b border-divar-border text-center">
              <div className="w-16 h-16 mx-auto bg-divar-bg border-2 border-brand-500 rounded-full flex items-center justify-center text-brand-500 text-2xl mb-3 shadow-inner">
                <i className="fa-solid fa-user" />
              </div>
              <div className="text-divar-text font-medium">{app.currentUser?.name || auth.userPhone}</div>
              <div className="text-xs text-green-400 mt-1 flex items-center justify-center gap-1 bg-green-900/20 py-1 rounded mx-4">
                <i className="fa-solid fa-shield-check" /> {app.currentUser?.kycStatus === 'verified' ? 'احراز هویت شده' : 'در انتظار'}
              </div>
            </div>
            <nav className="flex flex-col text-sm">
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSelectedTrx(null); setOpenTicket(null); setShowRadarForm(false); }}
                  className={`text-right p-4 transition border-l-4 ${activeTab === tab.id ? 'text-divar-text bg-divar-bg border-brand-500' : 'text-divar-muted hover:text-divar-text hover:bg-divar-bg border-transparent'}`}>
                  <i className={`fa-solid ${tab.icon} w-5 ml-2 text-center`} />{tab.label}
                </button>
              ))}
              <button onClick={handleLogout} className="text-right p-4 text-red-400 hover:bg-red-900/10 transition border-l-4 border-transparent mt-2 border-t border-divar-border">
                <i className="fa-solid fa-arrow-right-from-bracket w-5 ml-2 text-center" />خروج از حساب
              </button>
            </nav>
          </div>
        </aside>

        {/* Content */}
        <section className="flex-1 bg-divar-surface border border-divar-border rounded-xl p-4 md:p-6 shadow-lg min-h-[300px] md:min-h-[400px]">

          {/* REQUESTS TAB */}
          {activeTab === 'requests' && !selectedTrx && (
            <div>
              <h2 className="text-base md:text-lg font-bold text-divar-text mb-4">درخواست‌های خرید و فروش ({myTransactions.length})</h2>
              {myTransactions.length === 0 ? (
                <div className="text-center py-12 text-divar-muted">
                  <i className="fa-solid fa-inbox text-3xl mb-3" />
                  <p className="text-sm">هنوز درخواستی ثبت نشده</p>
                  <button onClick={() => router.push('/listings')} className="text-brand-400 text-sm mt-2 hover:underline">مشاهده آگهی‌ها</button>
                </div>
              ) : (
                <div className="space-y-3">
                  {myTransactions.map(trx => {
                    const listing = app.getListingById(trx.listingId);
                    const isBuyer = trx.buyerId === app.currentUser?.id;
                    return (
                      <button key={trx.id} onClick={() => setSelectedTrx(trx)} className="w-full bg-divar-bg border border-divar-border rounded-lg p-4 text-right hover:border-brand-500/50 transition">
                        <div className="flex justify-between items-start mb-2 gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="text-divar-text text-sm font-bold truncate">{listing?.bank} — {trx.amount} تومان</div>
                            <div className="text-[11px] text-divar-muted mt-0.5 flex items-center gap-2">
                              <span className="font-mono">{trx.id}</span>
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${trx.mode === 'escrow' ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400' : 'bg-divar-bg text-divar-muted'}`}>
                                {trx.mode === 'escrow' ? 'معامله امن' : 'مستقیم'}
                              </span>
                              <span>{isBuyer ? 'خریدار' : 'فروشنده'}</span>
                            </div>
                          </div>
                          <StatusBadge type="transaction" status={trx.status} />
                        </div>
                        {trx.mode === 'escrow' && !['completed', 'cancelled', 'disputed'].includes(trx.status) && (
                          <div className="mt-3"><StepProgress currentStatus={trx.status} /></div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TRANSACTION DETAIL */}
          {activeTab === 'requests' && selectedTrx && (
            <div>
              <button onClick={() => setSelectedTrx(null)} className="text-divar-muted hover:text-divar-text transition flex items-center gap-2 mb-4 text-sm">
                <i className="fa-solid fa-arrow-right" /> بازگشت
              </button>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-lg font-bold text-divar-text">{selectedTrx.id}</h2>
                  <div className="text-xs text-divar-muted mt-1 flex items-center gap-3">
                    <span>مبلغ: {selectedTrx.amount} تومان</span>
                    {selectedTrx.platformFee && <span>کارمزد: {selectedTrx.platformFee}</span>}
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${selectedTrx.mode === 'escrow' ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400' : 'bg-divar-bg text-divar-muted'}`}>
                      {selectedTrx.mode === 'escrow' ? 'معامله امن' : 'مستقیم'}
                    </span>
                  </div>
                </div>
                <StatusBadge type="transaction" status={selectedTrx.status} />
              </div>

              {selectedTrx.mode === 'escrow' && !['completed', 'cancelled', 'disputed'].includes(selectedTrx.status) && (
                <div className="mb-4 bg-divar-bg border border-divar-border rounded-lg p-4">
                  <StepProgress currentStatus={selectedTrx.status} />
                </div>
              )}

              <div className="bg-divar-bg border border-divar-border rounded-lg p-4 mb-4">
                <h3 className="text-sm font-bold text-divar-text mb-3">تاریخچه تراکنش</h3>
                <TransactionTimeline transaction={selectedTrx} />
              </div>

              {selectedTrx.transferDeadline && (
                <div className="bg-yellow-900/10 border border-yellow-800/30 rounded-lg p-3 mb-4 flex items-center gap-2 text-xs">
                  <i className="fa-solid fa-clock text-yellow-500" />
                  <span className="text-divar-text">مهلت انتقال: <span className="text-divar-text font-bold">{selectedTrx.transferDeadline}</span></span>
                </div>
              )}

              {/* Demo simulate button */}
              {selectedTrx.mode === 'escrow' && !['completed', 'cancelled', 'disputed'].includes(selectedTrx.status) && (
                <button onClick={() => { advanceTransaction(selectedTrx); setSelectedTrx(null); }}
                  className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-2.5 rounded-lg text-xs font-bold transition flex items-center gap-2">
                  <i className="fa-solid fa-forward" /> شبیه‌سازی مرحله بعد (دمو)
                </button>
              )}
            </div>
          )}

          {/* ADS TAB */}
          {activeTab === 'ads' && (
            <div>
              <div className="flex justify-between items-center mb-4 md:mb-6 gap-3">
                <h2 className="text-base md:text-lg font-bold text-divar-text">آگهی‌های من ({myListings.length})</h2>
                <button onClick={() => router.push('/new-ad')} className="bg-brand-600 hover:bg-brand-500 text-white px-3 md:px-4 py-2 rounded-md text-xs md:text-sm transition shadow-md flex items-center gap-1.5 flex-shrink-0">
                  <i className="fa-solid fa-plus" /> آگهی جدید
                </button>
              </div>
              {myListings.length === 0 ? (
                <div className="text-center py-12 text-divar-muted">
                  <i className="fa-solid fa-bullhorn text-3xl mb-3" />
                  <p className="text-sm">هنوز آگهی ثبت نکرده‌اید</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {myListings.map(l => (
                    <div key={l.id} className={`bg-divar-bg border rounded-lg p-4 md:p-5 ${l.status === 'draft' ? 'border-dashed border-divar-border' : 'border-divar-border'}`}>
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-divar-text text-sm font-bold">{l.bank} {l.amount}</h3>
                        <StatusBadge type="listing" status={l.status} />
                      </div>
                      <p className="text-xs text-divar-muted mb-2">قیمت: {l.price} تومان | {l.location}</p>
                      {l.status === 'published' && <p className="text-xs text-divar-muted mb-3">بازدید: {l.views} نفر</p>}
                      {l.rejectionReason && <p className="text-xs text-red-400 mb-3 bg-red-900/10 p-2 rounded"><i className="fa-solid fa-xmark ml-1" />{l.rejectionReason}</p>}
                      <div className="flex gap-4">
                        {l.status === 'published' && (
                          <button onClick={() => router.push(`/listings/${l.id}`)} className="text-blue-400 text-xs hover:text-divar-text transition flex items-center gap-1"><i className="fa-solid fa-eye" /> پیشنمایش</button>
                        )}
                        <button onClick={() => router.push('/new-ad')} className="text-brand-400 text-xs hover:text-divar-text transition flex items-center gap-1"><i className="fa-solid fa-pen" /> ویرایش</button>
                        <button onClick={() => alert.showConfirm('حذف آگهی', `آیا مطمئن هستید که می‌خواهید آگهی «${l.bank} ${l.amount}» را حذف کنید؟`, () => { app.updateListingStatus(l.id, 'cancelled'); alert.showAlert('حذف شد', 'آگهی حذف شد.', 'success'); })} className="text-red-400 text-xs hover:text-red-300 transition flex items-center gap-1"><i className="fa-solid fa-trash" /> حذف</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* FAVORITES TAB */}
          {activeTab === 'favorites' && (
            <div>
              <h2 className="text-base md:text-lg font-bold text-divar-text mb-4">آگهی‌های مورد علاقه</h2>
              {(() => {
                const favListings = app.favorites
                  .filter(f => f.userId === app.currentUser?.id)
                  .map(f => app.getListingById(f.listingId))
                  .filter(Boolean);
                return favListings.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {favListings.map(l => l && <ListingCard key={l.id} ad={l} />)}
                  </div>
                ) : (
                  <div className="text-center py-12 text-divar-muted">
                    <i className="fa-regular fa-heart text-3xl mb-3" />
                    <p className="text-sm">هنوز آگهی‌ای به علاقه‌مندی‌ها اضافه نکرده‌اید</p>
                    <button onClick={() => router.push('/listings')} className="text-brand-500 text-sm mt-2 hover:underline">مشاهده آگهی‌ها</button>
                  </div>
                );
              })()}
            </div>
          )}

          {/* RADAR TAB */}
          {activeTab === 'radar' && (
            <div>
              <div className="flex justify-between items-center mb-5 gap-3">
                <div>
                  <h2 className="text-base md:text-lg font-bold text-divar-text flex items-center gap-2">
                    <i className="fa-solid fa-satellite-dish text-brand-500" /> رادار وام
                  </h2>
                  <p className="text-xs text-divar-muted mt-0.5">وقتی وام مورد نظرت پیدا بشه، بهت اطلاع می‌دیم</p>
                </div>
                <button
                  onClick={() => setShowRadarForm(true)}
                  className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 flex-shrink-0 cursor-pointer"
                >
                  <i className="fa-solid fa-plus" /> رادار جدید
                </button>
              </div>

              {/* Active radars */}
              {(() => {
                const myRadars = app.radars.filter(r => r.userId === (app.currentUser?.id ?? ''));
                return myRadars.length === 0 ? (
                  <div className="bg-divar-bg border border-dashed border-divar-border rounded-2xl p-10 text-center">
                    <div className="w-16 h-16 mx-auto bg-brand-500/10 rounded-2xl flex items-center justify-center mb-4">
                      <i className="fa-solid fa-satellite-dish text-brand-500 text-2xl" />
                    </div>
                    <h3 className="text-sm font-bold text-divar-text mb-1">رادار فعالی ندارید</h3>
                    <p className="text-xs text-divar-muted mb-4 leading-relaxed">معیارهای وام مورد نظرتان را وارد کنید تا به محض ثبت آگهی مشابه، اعلان دریافت کنید.</p>
                    <button onClick={() => setShowRadarForm(true)} className="bg-brand-600 hover:bg-brand-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer">
                      <i className="fa-solid fa-plus ml-1" /> اولین رادار را بسازید
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {myRadars.map(radar => (
                      <div key={radar.id} className={`bg-divar-bg border rounded-2xl p-4 transition ${radar.isActive ? 'border-divar-border' : 'border-dashed border-divar-border opacity-60'}`}>
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${radar.isActive ? 'bg-brand-500/10' : 'bg-divar-surface'}`}>
                              <i className={`fa-solid fa-satellite-dish text-sm ${radar.isActive ? 'text-brand-500' : 'text-divar-muted'}`} />
                            </div>
                            <div>
                              <div className="text-sm font-bold text-divar-text">{radar.title}</div>
                              <div className="text-[10px] text-divar-muted">{radar.createdAt}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {radar.matchCount !== undefined && radar.matchCount > 0 && (
                              <span className="bg-brand-500/10 text-brand-600 dark:text-brand-400 text-[10px] font-bold px-2 py-1 rounded-lg">
                                {radar.matchCount} آگهی مشابه
                              </span>
                            )}
                            <button onClick={() => app.toggleRadarActive(radar.id)} className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition cursor-pointer ${radar.isActive ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800' : 'bg-divar-surface text-divar-muted border-divar-border'}`}>
                              {radar.isActive ? 'فعال' : 'غیرفعال'}
                            </button>
                            <button onClick={() => alert.showConfirm('حذف رادار', `رادار «${radar.title}» حذف شود؟`, () => { app.removeRadar(radar.id); alert.showAlert('حذف شد', 'رادار حذف شد.', 'success'); })} className="text-divar-muted hover:text-red-500 transition cursor-pointer">
                              <i className="fa-solid fa-trash text-sm" />
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {radar.minAmount && radar.maxAmount && (
                            <span className="bg-divar-surface border border-divar-border text-divar-text text-[10px] px-2 py-1 rounded-lg flex items-center gap-1">
                              <i className="fa-solid fa-money-bill text-brand-500 text-[9px]" />
                              {radar.minAmount} – {radar.maxAmount} تومان
                            </span>
                          )}
                          {radar.installments && (
                            <span className="bg-divar-surface border border-divar-border text-divar-text text-[10px] px-2 py-1 rounded-lg flex items-center gap-1">
                              <i className="fa-solid fa-calendar-days text-blue-500 text-[9px]" />
                              تا {radar.installments} ماه
                            </span>
                          )}
                          {radar.maxInterest && (
                            <span className="bg-divar-surface border border-divar-border text-divar-text text-[10px] px-2 py-1 rounded-lg flex items-center gap-1">
                              <i className="fa-solid fa-percent text-yellow-500 text-[9px]" />
                              سود حداکثر {radar.maxInterest}
                            </span>
                          )}
                          {radar.bank && (
                            <span className="bg-divar-surface border border-divar-border text-divar-text text-[10px] px-2 py-1 rounded-lg flex items-center gap-1">
                              <i className="fa-solid fa-building-columns text-indigo-500 text-[9px]" />
                              {radar.bank}
                            </span>
                          )}
                          {radar.city && (
                            <span className="bg-divar-surface border border-divar-border text-divar-text text-[10px] px-2 py-1 rounded-lg flex items-center gap-1">
                              <i className="fa-solid fa-location-dot text-red-500 text-[9px]" />
                              {radar.city}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}

              {/* Radar form modal */}
              {showRadarForm && (
                <>
                  <div className="fixed inset-0 bg-black/60 z-[100]" onClick={() => setShowRadarForm(false)} />
                  <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-divar-surface border border-divar-border rounded-2xl p-6 w-[90%] max-w-[440px] z-[101] shadow-2xl max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-10 h-10 bg-brand-500/10 rounded-xl flex items-center justify-center">
                        <i className="fa-solid fa-satellite-dish text-brand-500" />
                      </div>
                      <h3 className="text-lg font-bold text-divar-text">رادار جدید</h3>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs text-divar-muted mb-1.5">نام رادار (برای شناسایی خودتان)</label>
                        <input value={radarForm.title} onChange={e => setRadarForm(p => ({...p, title: e.target.value}))} placeholder="مثلا: رادار رسالت تهران" className="w-full bg-divar-bg border border-divar-border text-divar-text rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-brand-500 transition" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-divar-muted mb-1.5">حداقل مبلغ (تومان)</label>
                          <input value={radarForm.minAmount} onChange={e => setRadarForm(p => ({...p, minAmount: e.target.value}))} placeholder="مثلا: 100,000,000" className="w-full bg-divar-bg border border-divar-border text-divar-text rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-brand-500 transition font-mono" dir="ltr" />
                        </div>
                        <div>
                          <label className="block text-xs text-divar-muted mb-1.5">حداکثر مبلغ (تومان)</label>
                          <input value={radarForm.maxAmount} onChange={e => setRadarForm(p => ({...p, maxAmount: e.target.value}))} placeholder="مثلا: 300,000,000" className="w-full bg-divar-bg border border-divar-border text-divar-text rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-brand-500 transition font-mono" dir="ltr" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-divar-muted mb-1.5">اقساط (ماه)</label>
                          <input value={radarForm.installments} onChange={e => setRadarForm(p => ({...p, installments: e.target.value}))} placeholder="مثلا: 60" className="w-full bg-divar-bg border border-divar-border text-divar-text rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-brand-500 transition" dir="ltr" />
                        </div>
                        <div>
                          <label className="block text-xs text-divar-muted mb-1.5">حداکثر نرخ سود</label>
                          <select value={radarForm.maxInterest} onChange={e => setRadarForm(p => ({...p, maxInterest: e.target.value}))} className="w-full bg-divar-bg border border-divar-border text-divar-text rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-brand-500 transition cursor-pointer">
                            <option value="">مهم نیست</option>
                            <option value="۲٪">۲٪ (قرض‌الحسنه)</option>
                            <option value="۴٪">۴٪</option>
                            <option value="۱۰٪">۱۰٪</option>
                            <option value="۱۸٪">۱۸٪</option>
                            <option value="۲۲٪">۲۲٪</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-divar-muted mb-1.5">بانک (اختیاری)</label>
                          <select value={radarForm.bank} onChange={e => setRadarForm(p => ({...p, bank: e.target.value}))} className="w-full bg-divar-bg border border-divar-border text-divar-text rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-brand-500 transition cursor-pointer">
                            <option value="">همه بانک‌ها</option>
                            <option value="رسالت">رسالت</option>
                            <option value="مهر ایران">مهر ایران</option>
                            <option value="جاویدان">جاویدان</option>
                            <option value="بانک ملت">بانک ملت</option>
                            <option value="وام مسکن">وام مسکن</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-divar-muted mb-1.5">شهر (اختیاری)</label>
                          <input value={radarForm.city} onChange={e => setRadarForm(p => ({...p, city: e.target.value}))} placeholder="مثلا: تهران" className="w-full bg-divar-bg border border-divar-border text-divar-text rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-brand-500 transition" />
                        </div>
                      </div>
                      <div className="flex gap-3 pt-1">
                        <button onClick={() => setShowRadarForm(false)} className="flex-1 bg-divar-bg border border-divar-border text-divar-text py-3 rounded-xl font-bold transition hover:bg-divar-surfaceHover cursor-pointer">انصراف</button>
                        <button
                          onClick={() => {
                            if (!radarForm.minAmount || !radarForm.maxAmount) { alert.showAlert('خطا', 'لطفا حداقل مبلغ را وارد کنید.'); return; }
                            app.addRadar({
                              userId: app.currentUser?.id ?? '',
                              title: radarForm.title || `رادار ${radarForm.bank || 'همه بانک‌ها'}`,
                              minAmount: radarForm.minAmount,
                              maxAmount: radarForm.maxAmount,
                              installments: radarForm.installments,
                              maxInterest: radarForm.maxInterest,
                              bank: radarForm.bank,
                              loanType: radarForm.loanType,
                              city: radarForm.city,
                              isActive: true,
                            });
                            setShowRadarForm(false);
                            setRadarForm({ title: '', minAmount: '', maxAmount: '', installments: '', maxInterest: '', bank: '', loanType: '', city: '' });
                            alert.showAlert('رادار فعال شد', 'رادار شما با موفقیت ثبت شد. به محض ثبت آگهی مشابه، اعلان دریافت می‌کنید.', 'success');
                          }}
                          className="flex-1 bg-brand-600 hover:bg-brand-500 text-white py-3 rounded-xl font-bold transition cursor-pointer"
                        >
                          ثبت رادار
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* TICKETS TAB */}
          {activeTab === 'tickets' && !openTicketData && (
            <div>
              <div className="flex justify-between items-center mb-4 gap-3">
                <h2 className="text-base md:text-lg font-bold text-divar-text">تیکت‌های پشتیبانی</h2>
                <button onClick={() => router.push('/support')} className="bg-brand-600 hover:bg-brand-500 text-white px-3 py-2 rounded-md text-xs transition flex items-center gap-1.5"><i className="fa-solid fa-plus" /> تیکت جدید</button>
              </div>
              <div className="space-y-3">
                {myTickets.map(ticket => (
                  <button key={ticket.id} onClick={() => setOpenTicket(ticket.id)} className="w-full bg-divar-bg border border-divar-border rounded-lg p-4 text-right hover:border-brand-500/50 transition group">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-divar-text text-sm font-bold group-hover:text-brand-400 transition">{ticket.subject}</h3>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border flex-shrink-0 mr-2 ${ticket.status === 'open' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' : ticket.status === 'in_progress' ? 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700' : 'bg-divar-bg text-divar-muted border-divar-border'}`}>
                        {ticket.status === 'open' ? 'باز' : ticket.status === 'in_progress' ? 'در حال بررسی' : 'بسته شده'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-divar-muted">
                      <span className="font-mono">{ticket.id}</span>
                      <div className="flex items-center gap-3">
                        <span>{ticket.date}</span>
                        <span className="flex items-center gap-1"><i className="fa-regular fa-message" /> {ticket.messages.length}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'tickets' && openTicketData && (
            <div className="flex flex-col h-full min-h-[400px]">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-divar-border">
                <button onClick={() => setOpenTicket(null)} className="text-divar-muted hover:text-divar-text transition"><i className="fa-solid fa-arrow-right text-lg" /></button>
                <div className="flex-1 min-w-0">
                  <h3 className="text-divar-text text-sm font-bold truncate">{openTicketData.subject}</h3>
                  <div className="text-[11px] text-divar-muted flex items-center gap-2 mt-0.5">
                    <span className="font-mono">{openTicketData.id}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${openTicketData.status === 'open' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' : 'bg-divar-bg text-divar-muted border-divar-border'}`}>
                      {openTicketData.status === 'open' ? 'باز' : openTicketData.status === 'in_progress' ? 'بررسی' : 'بسته'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                {openTicketData.messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-3 ${msg.sender === 'user' ? 'bg-brand-600 text-white rounded-bl-sm' : msg.sender === 'system' ? 'bg-yellow-900/20 border border-yellow-800/30 text-yellow-300 rounded-br-sm' : 'bg-divar-bg border border-divar-border text-divar-text rounded-br-sm'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold opacity-70">{msg.sender === 'user' ? 'شما' : msg.sender === 'system' ? 'سیستم' : 'پشتیبانی'}</span>
                        <span className="text-[10px] opacity-50">{msg.time}</span>
                      </div>
                      <p className="text-xs md:text-sm leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              {openTicketData.status !== 'closed' && (
                <div className="flex gap-2 pt-3 border-t border-divar-border">
                  <input type="text" placeholder="پیام خود را بنویسید..." className="flex-1 bg-divar-bg border border-divar-border text-divar-text rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:border-brand-500" />
                  <button onClick={() => alert.showAlert('ارسال شد', 'پیام شما ارسال شد.', 'success')} className="bg-brand-600 hover:bg-brand-500 text-white px-4 rounded-lg transition flex-shrink-0"><i className="fa-solid fa-paper-plane" /></button>
                </div>
              )}
            </div>
          )}

          {/* KYC TAB */}
          {activeTab === 'kyc' && (
            <div>
              <h2 className="text-base md:text-lg font-bold text-divar-text mb-2">احراز هویت و اطلاعات بانکی</h2>
              <p className="text-xs md:text-sm text-divar-muted mb-4 md:mb-6 bg-brand-900/10 p-3 rounded border border-brand-900/30">تطابق کامل کد ملی و شماره شبا الزامی است.</p>
              <div className="max-w-md space-y-4">
                <div>
                  <label className="block text-xs text-divar-muted mb-1">نام و نام خانوادگی</label>
                  <input type="text" defaultValue={app.currentUser?.name || ''} disabled className="w-full bg-divar-bg border border-divar-border text-divar-muted rounded-md py-2.5 px-3 text-sm cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-xs text-divar-muted mb-1">کد ملی</label>
                  <input type="text" defaultValue={app.currentUser?.nationalId || ''} disabled className="w-full bg-divar-bg border border-divar-border text-divar-muted rounded-md py-2.5 px-3 text-sm cursor-not-allowed text-left" dir="ltr" />
                </div>
                <div>
                  <label className="block text-xs text-divar-muted mb-1">شماره شبا (IBAN)</label>
                  <div className="flex items-center gap-3">
                    <input type="text" defaultValue={app.currentUser?.iban || ''} disabled className="w-full bg-divar-bg border border-green-800/50 text-green-400 rounded-md py-2.5 px-3 text-xs md:text-sm cursor-not-allowed font-mono text-left bg-green-900/5" dir="ltr" />
                    {app.currentUser?.kycStatus === 'verified' && <i className="fa-solid fa-check-circle text-green-500 text-xl flex-shrink-0" />}
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-divar-muted mb-2">مدارک</label>
                  <div className="space-y-2">
                    {app.currentUser?.kycDocuments.map(d => (
                      <div key={d.type} className="bg-divar-bg border border-divar-border rounded-lg p-3 flex items-center justify-between">
                        <span className="text-sm text-divar-text">{d.type}</span>
                        <span className={`text-xs flex items-center gap-1 ${d.uploaded ? (d.verified ? 'text-green-400' : 'text-yellow-500') : 'text-red-400'}`}>
                          <i className={`fa-solid ${d.uploaded ? (d.verified ? 'fa-check-circle' : 'fa-clock') : 'fa-xmark'}`} />
                          {d.uploaded ? (d.verified ? 'تایید شده' : 'در انتظار بررسی') : 'آپلود نشده'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
