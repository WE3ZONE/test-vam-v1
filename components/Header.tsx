'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from './AuthContext';
import { useApp } from './AppContext';
import { useTheme } from './ThemeContext';

export default function Header() {
  const auth = useAuth();
  const { theme, toggleTheme } = useTheme();
  const app = useApp();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleNewAd() {
    setMenuOpen(false);
    if (auth.isLoggedIn) {
      router.push('/new-ad');
    } else {
      auth.setPendingNavigation('/new-ad');
      auth.openLoginModal();
    }
  }

  const isAdminOrOperator = app.currentUser?.role === 'admin' || app.currentUser?.role === 'operator';

  const navLinks = [
    { href: '/listings', label: 'آگهی‌های وام' },
    { href: '/banks', label: 'بانک‌های تحت پوشش' },
    { href: '/rules', label: 'قوانین (Escrow)' },
    { href: '/blog', label: 'وبلاگ' },
    { href: '/support', label: 'پشتیبانی' },
    ...(isAdminOrOperator ? [{ href: '/admin', label: 'پنل مدیریت' }] : []),
  ];

  const cityLabel = auth.selectedCities.size === 0
    ? 'همه شهرها'
    : auth.selectedCities.size <= 2
      ? Array.from(auth.selectedCities).join('، ')
      : `${auth.selectedCities.size} شهر`;

  return (
    <>
      <header className="sticky top-0 z-50 bg-divar-surface/95 backdrop-blur-md border-b border-divar-border shadow-sm">
        <div className="max-w-[1440px] mx-auto px-4 h-14 md:h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 lg:gap-6 flex-1 min-w-0">
            <button
              onClick={(e) => { e.stopPropagation(); setMenuOpen(v => !v); }}
              className="lg:hidden text-divar-muted hover:text-divar-text transition text-lg w-8 h-8 flex items-center justify-center relative z-[60]"
            >
              <i className={`fa-solid ${menuOpen ? 'fa-xmark' : 'fa-bars'}`} />
            </button>

            <Link href="/" className="text-divar-primary font-black text-lg md:text-2xl tracking-tighter flex items-center gap-1.5 flex-shrink-0">
              <i className="fa-solid fa-hand-holding-dollar" />
              <span className="hidden xs:inline">وام‌اینجاست</span>
              <span className="xs:hidden">وام</span>
            </Link>

            <button
              onClick={auth.openCityPicker}
              className="hidden md:flex items-center text-divar-text text-sm hover:text-divar-text cursor-pointer transition ml-2 bg-divar-bg px-3 py-1.5 rounded-full border border-divar-border gap-1"
            >
              <i className="fa-solid fa-location-dot ml-1 text-divar-muted" />
              <span className="max-w-[120px] truncate">{cityLabel}</span>
              {auth.selectedCities.size > 0 && (
                <span className="bg-brand-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold mr-1">{auth.selectedCities.size}</span>
              )}
            </button>

            <nav className="hidden lg:flex items-center gap-6 text-sm text-divar-muted">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`hover:text-divar-text transition ${pathname === link.href ? 'text-divar-text' : ''}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2 md:gap-5 text-sm flex-shrink-0">
            <button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-full bg-divar-bg flex items-center justify-center border border-divar-border text-divar-muted hover:text-divar-text transition"
              title={theme === 'dark' ? 'حالت روشن' : 'حالت تاریک'}
            >
              <i className={`fa-solid ${theme === 'dark' ? 'fa-sun text-yellow-400' : 'fa-moon'}`} />
            </button>

            {!auth.isLoggedIn ? (
              <button onClick={auth.openLoginModal} className="flex items-center text-divar-muted hover:text-divar-text transition group">
                <div className="w-8 h-8 rounded-full bg-divar-bg flex items-center justify-center border border-divar-border group-hover:border-divar-border transition md:ml-2">
                  <i className="fa-regular fa-user" />
                </div>
                <span className="hidden sm:block">ورود / ثبت‌نام</span>
              </button>
            ) : (
              <Link href={isAdminOrOperator ? '/admin' : '/dashboard'} className="flex items-center text-divar-muted hover:text-divar-text transition group">
                <div className="w-8 h-8 rounded-full bg-brand-900 text-brand-500 flex items-center justify-center border border-brand-600 md:ml-2">
                  <i className="fa-solid fa-user-check" />
                </div>
                <span className="hidden sm:block">{isAdminOrOperator ? 'پنل مدیریت' : 'داشبورد من'}</span>
              </Link>
            )}

            <button
              onClick={handleNewAd}
              className="bg-divar-primary hover:bg-divar-primaryHover text-divar-text px-2.5 md:px-4 py-2 rounded-md font-medium transition duration-200 shadow-lg shadow-red-900/20 whitespace-nowrap flex items-center gap-1.5 text-xs md:text-sm"
            >
              <i className="fa-solid fa-plus text-xs" />
              <span className="hidden sm:inline">ثبت آگهی</span>
              <span className="sm:hidden">آگهی</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="fixed top-14 inset-x-0 bottom-0 z-40 lg:hidden" onClick={() => setMenuOpen(false)}>
          <div className="absolute inset-0 bg-black/60" />
          <nav
            className="absolute top-0 right-0 w-64 bg-divar-surface border-l border-divar-border shadow-2xl h-full overflow-y-auto animate-fadeIn"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 border-b border-divar-border">
              <button
                onClick={() => { setMenuOpen(false); auth.openCityPicker(); }}
                className="w-full flex items-center text-divar-text text-sm bg-divar-bg px-3 py-2.5 rounded-lg border border-divar-border gap-2"
              >
                <i className="fa-solid fa-location-dot text-divar-muted" />
                <span className="flex-1 text-right truncate">{cityLabel}</span>
                {auth.selectedCities.size > 0 && (
                  <span className="bg-brand-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{auth.selectedCities.size}</span>
                )}
                <i className="fa-solid fa-chevron-left text-divar-muted text-xs" />
              </button>
            </div>

            <div className="py-2">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`block px-5 py-3.5 text-sm transition border-r-4 ${
                    pathname === link.href
                      ? 'text-divar-text bg-divar-bg border-brand-500'
                      : 'text-divar-muted hover:text-divar-text hover:bg-divar-bg border-transparent'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="border-t border-divar-border p-4">
              {!auth.isLoggedIn ? (
                <button
                  onClick={() => { setMenuOpen(false); auth.openLoginModal(); }}
                  className="w-full bg-divar-bg border border-divar-border text-divar-text py-3 rounded-lg text-sm font-medium transition hover:bg-divar-surfaceHover flex items-center justify-center gap-2"
                >
                  <i className="fa-regular fa-user" />
                  ورود / ثبت‌نام
                </button>
              ) : (
                <Link
                  href={isAdminOrOperator ? '/admin' : '/dashboard'}
                  onClick={() => setMenuOpen(false)}
                  className="w-full bg-divar-bg border border-divar-border text-divar-text py-3 rounded-lg text-sm font-medium transition hover:bg-divar-surfaceHover flex items-center justify-center gap-2"
                >
                  <i className="fa-solid fa-user-check" />
                  {isAdminOrOperator ? 'پنل مدیریت' : 'داشبورد من'}
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
