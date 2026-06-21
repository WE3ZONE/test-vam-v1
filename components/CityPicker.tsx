'use client';

import { useAuth, allCities } from './AuthContext';

export default function CityPicker() {
  const auth = useAuth();

  if (!auth.showCityPicker) return null;

  const cityLabel = auth.selectedCities.size === 0
    ? 'همه شهرها'
    : Array.from(auth.selectedCities).join('، ');

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-[90]" onClick={auth.closeCityPicker} />
      <div className="fixed bottom-0 md:bottom-auto md:top-1/2 md:-translate-y-1/2 left-0 right-0 md:left-1/2 md:-translate-x-1/2 md:w-[400px] md:rounded-xl z-[90] bg-divar-surface border-t md:border border-divar-border rounded-t-2xl md:rounded-xl shadow-2xl animate-slideUp md:animate-fadeIn max-h-[85vh] overflow-hidden flex flex-col">
        <div className="p-5 border-b border-divar-border flex items-center justify-between flex-shrink-0">
          <h3 className="text-lg font-bold text-white">انتخاب شهر</h3>
          <button onClick={auth.closeCityPicker} className="text-divar-muted hover:text-white transition">
            <i className="fa-solid fa-xmark text-lg" />
          </button>
        </div>

        <div className="p-4 border-b border-divar-border flex-shrink-0">
          <div className="text-xs text-divar-muted mb-1">
            {auth.selectedCities.size === 0 ? 'همه شهرها انتخاب شده' : `${auth.selectedCities.size} شهر انتخاب شده: ${cityLabel}`}
          </div>
          {auth.selectedCities.size > 0 && (
            <button onClick={auth.clearCities} className="text-xs text-divar-primary hover:text-red-400 mt-1">
              حذف انتخاب‌ها (نمایش همه)
            </button>
          )}
        </div>

        <div className="overflow-y-auto flex-1 p-2">
          {allCities.map((city, i) => (
            <button
              key={city}
              onClick={() => auth.toggleCity(city)}
              className={`w-full flex items-center justify-between p-3.5 rounded-lg text-sm transition mb-1 ${
                auth.selectedCities.has(city)
                  ? 'bg-brand-900/20 text-white border border-brand-800'
                  : 'text-divar-text hover:bg-divar-bg border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <i className={`fa-solid fa-location-dot ${auth.selectedCities.has(city) ? 'text-brand-400' : 'text-divar-muted'}`} />
                <span className="font-medium">{city}</span>
                {i === 0 && <span className="text-[10px] bg-brand-600 text-white px-1.5 py-0.5 rounded">پیشنهادی</span>}
              </div>
              {auth.selectedCities.has(city) && (
                <i className="fa-solid fa-check text-brand-400" />
              )}
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-divar-border flex-shrink-0">
          <button
            onClick={auth.closeCityPicker}
            className="w-full bg-brand-600 hover:bg-brand-500 text-white py-3 rounded-lg text-sm font-bold transition"
          >
            تایید
          </button>
        </div>
      </div>
    </>
  );
}
