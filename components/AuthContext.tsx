'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export const allCities = [
  'سبزوار', 'تهران', 'مشهد', 'اصفهان', 'شیراز', 'تبریز',
  'کرج', 'اهواز', 'قم', 'کرمانشاه', 'رشت',
];

interface AuthState {
  isLoggedIn: boolean;
  userPhone: string;
  pendingNavigation: string | null;
  showLoginModal: boolean;
  selectedCities: Set<string>;
  showCityPicker: boolean;
  login: (phone: string) => void;
  logout: () => void;
  setPendingNavigation: (path: string | null) => void;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  toggleCity: (city: string) => void;
  clearCities: () => void;
  openCityPicker: () => void;
  closeCityPicker: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userPhone, setUserPhone] = useState('');
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedCities, setSelectedCities] = useState<Set<string>>(new Set());
  const [showCityPicker, setShowCityPicker] = useState(false);

  const login = useCallback((phone: string) => {
    setIsLoggedIn(true);
    setUserPhone(phone);
    setShowLoginModal(false);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUserPhone('');
  }, []);

  const openLoginModal = useCallback(() => setShowLoginModal(true), []);
  const closeLoginModal = useCallback(() => setShowLoginModal(false), []);

  const toggleCity = useCallback((city: string) => {
    setSelectedCities(prev => {
      const next = new Set(prev);
      if (next.has(city)) next.delete(city);
      else next.add(city);
      return next;
    });
  }, []);

  const clearCities = useCallback(() => setSelectedCities(new Set()), []);
  const openCityPicker = useCallback(() => setShowCityPicker(true), []);
  const closeCityPicker = useCallback(() => setShowCityPicker(false), []);

  return (
    <AuthContext.Provider value={{
      isLoggedIn, userPhone, pendingNavigation, showLoginModal,
      selectedCities, showCityPicker,
      login, logout, setPendingNavigation, openLoginModal, closeLoginModal,
      toggleCity, clearCities, openCityPicker, closeCityPicker,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
