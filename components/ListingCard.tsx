import Link from 'next/link';
import { Listing, colorMap } from '@/data/types';
import FavoriteButton from './FavoriteButton';
import StatusBadge from './StatusBadge';

export default function ListingCard({ ad, showStatus = false, showFavorite = true }: { ad: Listing; showStatus?: boolean; showFavorite?: boolean }) {
  const colors = colorMap[ad.color] || colorMap.blue;

  return (
    <Link
      href={`/listings/${ad.id}`}
      className="bg-divar-surface border border-divar-border rounded-2xl p-3 flex gap-3 hover:border-brand-500/40 hover:shadow-xl hover:shadow-brand-500/5 cursor-pointer transition-all duration-200 group h-[148px] relative"
    >
      {showFavorite && (
        <div className="absolute top-2.5 left-2.5 z-10">
          <FavoriteButton listingId={ad.id} size="sm" />
        </div>
      )}

      <div className={`w-[100px] sm:w-[120px] h-full bg-gradient-to-br ${colors.gradient} rounded-xl flex flex-col items-center justify-center text-white relative overflow-hidden flex-shrink-0 border ${colors.border}`}>
        <i className={`fa-solid fa-${ad.icon} text-2xl mb-1.5 opacity-80 group-hover:scale-110 transition-transform duration-200`} />
        <span className="text-[11px] font-bold text-center px-1">{ad.bank}</span>
      </div>

      <div className="flex flex-col justify-between flex-1 py-0.5 min-w-0">
        <div>
          <h3 className="text-sm font-bold text-divar-text line-clamp-2 leading-snug group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors mb-1">
            وام {ad.bank} {ad.amount} تومان
          </h3>
          <div className="text-[11px] text-divar-muted mb-1.5">اقساط: {ad.installments} ماهه · سود: {ad.interest}</div>
          {showStatus && ad.status !== 'published' ? (
            <StatusBadge type="listing" status={ad.status} />
          ) : (
            <div className="text-[10px] text-brand-600 dark:text-brand-400 flex items-center gap-1 font-medium bg-brand-500/10 w-fit px-2 py-0.5 rounded-md">
              <i className="fa-solid fa-shield-check" /> معامله امن
            </div>
          )}
        </div>
        <div className="pt-1.5 border-t border-divar-border/50">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-divar-text">{ad.price} تومان</span>
            <span className="text-[10px] text-divar-muted flex items-center gap-0.5">
              <i className="fa-solid fa-location-dot text-[8px] opacity-60" />{ad.location}
            </span>
          </div>
          {ad.urgent && (
            <span className="inline-block mt-1 bg-red-500/10 text-red-500 border border-red-500/20 px-1.5 py-0.5 rounded text-[10px] font-bold">فوری</span>
          )}
        </div>
      </div>
    </Link>
  );
}
