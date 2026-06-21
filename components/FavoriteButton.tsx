'use client';

import { useApp } from './AppContext';
import { useAuth } from './AuthContext';

export default function FavoriteButton({ listingId, size = 'md' }: { listingId: number; size?: 'sm' | 'md' }) {
  const app = useApp();
  const auth = useAuth();
  const fav = app.isFavorite(listingId);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!auth.isLoggedIn) {
      auth.openLoginModal();
      return;
    }
    app.toggleFavorite(listingId);
  }

  return (
    <button
      onClick={handleClick}
      className={`transition transform hover:scale-110 ${
        fav ? 'text-red-500' : 'text-divar-muted hover:text-red-400'
      } ${size === 'sm' ? 'text-sm' : 'text-lg'}`}
      title={fav ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
    >
      <i className={`fa-${fav ? 'solid' : 'regular'} fa-heart`} />
    </button>
  );
}
