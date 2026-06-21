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
        <div
          className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[100] flex items-center justify-center"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-divar-surface border border-divar-border rounded-xl w-[90%] max-w-[400px] p-6 shadow-2xl text-center"
            onClick={e => e.stopPropagation()}
          >
            <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center text-3xl mb-5 shadow-inner ${
              type === 'success'
                ? 'bg-green-900/20 border border-green-800'
                : type === 'confirm'
                ? 'bg-red-900/20 border border-red-800'
                : 'bg-divar-bg border border-divar-border'
            }`}>
              <i className={
                type === 'success' ? 'fa-solid fa-check text-green-500'
                : type === 'confirm' ? 'fa-solid fa-triangle-exclamation text-red-500'
                : 'fa-solid fa-bell text-brand-400'
              } />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
            <p className="text-sm text-gray-300 mb-8 leading-relaxed px-2">{message}</p>

            {type === 'confirm' ? (
              <div className="flex gap-3">
                <button
                  onClick={() => setOpen(false)}
                  className="flex-1 bg-divar-bg border border-divar-border hover:bg-gray-700 text-white py-3 rounded-lg transition font-bold shadow-sm"
                >
                  انصراف
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 bg-red-700 hover:bg-red-600 text-white py-3 rounded-lg transition font-bold shadow-sm"
                >
                  حذف
                </button>
              </div>
            ) : (
              <button
                onClick={() => setOpen(false)}
                className="w-full bg-divar-bg border border-divar-border hover:bg-gray-700 text-white py-3 rounded-lg transition font-bold shadow-sm"
              >
                متوجه شدم
              </button>
            )}
          </div>
        </div>
      )}
    </AlertContext.Provider>
  );
}
