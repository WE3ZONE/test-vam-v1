import Link from 'next/link';
import { Listing, colorMap } from '@/data/types';
import FavoriteButton from './FavoriteButton';
import StatusBadge from './StatusBadge';

export default function ListingCard({ ad, showStatus = false, showFavorite = true }: { ad: Listing; showStatus?: boolean; showFavorite?: boolean }) {
  const colors = colorMap[ad.color] || colorMap.blue;

  return (
    <Link
      href={`/listings/${ad.id}`}
      className="bg-divar-surface border border-divar-border rounded-xl p-3 flex gap-4 hover:border-brand-500 cursor-pointer transition-all duration-300 group h-40 shadow-sm hover:shadow-lg relative"
    >
      {showFavorite && (
        <div className="absolute top-2 left-2 z-10">
          <FavoriteButton listingId={ad.id} size="sm" />
        </div>
      )}

      <div className={`w-28 sm:w-32 h-full bg-gradient-to-br ${colors.gradient} rounded-lg flex flex-col items-center justify-center text-white relative overflow-hidden flex-shrink-0 border ${colors.border}`}>
        <i className={`fa-solid fa-${ad.icon} text-3xl mb-2 opacity-80 group-hover:scale-110 transition-transform duration-300`} />
        <span className="text-xs font-bold text-center px-1 z-10">{ad.bank}</span>
      </div>

      <div className="flex flex-col justify-between flex-1 py-1 min-w-0">
        <div>
          <h3 className="text-sm font-bold text-white line-clamp-2 leading-tight group-hover:text-brand-400 transition mb-1">
            فروش امتیاز وام {ad.bank} {ad.amount} تومان
          </h3>
          <div className="text-[11px] text-divar-muted mb-1">اقساط: {ad.installments} ماهه - سود: {ad.interest}</div>
          {showStatus && ad.status !== 'published' ? (
            <StatusBadge type="listing" status={ad.status} />
          ) : (
            <div className="text-[10px] text-brand-500 flex items-center gap-1 font-medium bg-brand-900/20 w-fit px-1.5 py-0.5 rounded">
              <i className="fa-solid fa-shield-check" /> معامله امن
            </div>
          )}
        </div>
        <div className="mt-2 pt-2 border-t border-divar-border/50">
          <div className="text-xs font-bold text-gray-200 mb-1">قیمت: {ad.price}</div>
          <div className="text-[10px] text-divar-muted flex justify-between items-center">
            {ad.urgent && (
              <span className="bg-red-900/40 text-red-400 border border-red-800 px-1.5 py-0.5 rounded text-[10px] font-bold">فوری</span>
            )}
            <span className="truncate ml-1">
              <i className="fa-solid fa-location-dot text-[9px] ml-0.5 opacity-50" />{ad.location}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
