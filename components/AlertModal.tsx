'use client';

import { createContext, useContext, useState, useCallback, useRef, ReactNode } from 'react';

interface AlertState {
  showAlert: (title: string, message: string, type?: 'info' | 'success') => void;
  showConfirm: (title: string, message: string, onConfirm: () => void) => void;
}

const AlertContext = createContext<AlertState | null>(null);

export function useAlert() {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error('useAlert must be used within AlertProvider');
  return ctx;
}

export function AlertProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'info' | 'success' | 'confirm'>('info');
  const onConfirmRef = useRef<(() => void) | null>(null);

  const showAlert = useCallback((t: string, m: string, tp: 'info' | 'success' = 'info') => {
    setTitle(t);
    setMessage(m);
    setType(tp);
    onConfirmRef.current = null;
    setOpen(true);
  }, []);

  const showConfirm = useCallback((t: string, m: string, onConfirm: () => void) => {
    setTitle(t);
    setMessage(m);
    setType('confirm');
    onConfirmRef.current = onConfirm;
    setOpen(true);
  }, []);

  function handleConfirm() {
    setOpen(false);
    onConfirmRef.current?.();
    onConfirmRef.current = null;
  }

  return (
    <AlertContext.Provider value={{ showAlert, showConfirm }}>
      {children}
      {open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div className="bg-divar-surface border border-divar-border rounded-2xl w-full max-w-[380px] p-6 shadow-2xl text-center" onClick={e => e.stopPropagation()}>
            <div className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-3xl mb-5 ${
              type === 'success' ? 'bg-green-500/10' : type === 'confirm' ? 'bg-red-500/10' : 'bg-brand-500/10'
            }`}>
              <i className={
                type === 'success' ? 'fa-solid fa-check text-green-500'
                : type === 'confirm' ? 'fa-solid fa-triangle-exclamation text-red-500'
                : 'fa-solid fa-bell text-brand-500'
              } />
            </div>
            <h3 className="text-lg font-bold text-divar-text mb-2">{title}</h3>
            <p className="text-sm text-divar-muted mb-6 leading-relaxed">{message}</p>

            {type === 'confirm' ? (
              <div className="flex gap-3">
                <button onClick={() => setOpen(false)} className="flex-1 bg-divar-bg border border-divar-border hover:bg-divar-surfaceHover text-divar-text py-3 rounded-xl transition-all font-bold cursor-pointer">
                  انصراف
                </button>
                <button onClick={handleConfirm} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl transition-all font-bold cursor-pointer">
                  حذف
                </button>
              </div>
            ) : (
              <button onClick={() => setOpen(false)} className="w-full bg-divar-bg border border-divar-border hover:bg-divar-surfaceHover text-divar-text py-3 rounded-xl transition-all font-bold cursor-pointer">
                متوجه شدم
              </button>
            )}
          </div>
        </div>
      )}
    </AlertContext.Provider>
  );
}
