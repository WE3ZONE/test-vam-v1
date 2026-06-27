'use client';

interface Tab {
  id: string;
  label: string;
  shortLabel: string;
  icon: string;
  badge?: number;
}

interface Props {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
}

export default function AdminSidebar({ tabs, activeTab, onTabChange }: Props) {
  return (
    <>
      {/* Mobile: horizontal scrollable tab bar */}
      <div className="md:hidden mb-4">
        <div className="bg-divar-surface border border-divar-border rounded-xl overflow-hidden">
          <div className="flex overflow-x-auto scrollbar-hide">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex-1 min-w-[80px] flex flex-col items-center gap-1 py-3 px-2 text-center transition relative ${
                  activeTab === tab.id ? 'text-divar-text' : 'text-divar-muted'
                }`}
              >
                <div className="relative">
                  <i className={`fa-solid ${tab.icon} text-base ${activeTab === tab.id ? 'text-brand-400' : ''}`} />
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className="absolute -top-1.5 -left-2 bg-red-600 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{tab.badge}</span>
                  )}
                </div>
                <span className="text-[9px] font-medium whitespace-nowrap">{tab.shortLabel}</span>
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-2 right-2 h-[3px] bg-brand-500 rounded-t-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop: vertical sidebar */}
      <aside className="hidden md:block w-56 flex-shrink-0">
        <div className="bg-divar-surface border border-divar-border rounded-xl overflow-hidden shadow-lg sticky top-24">
          <div className="p-4 border-b border-divar-border">
            <h2 className="text-sm font-bold text-divar-text flex items-center gap-2">
              <i className="fa-solid fa-shield-halved text-brand-400" />
              پنل مدیریت
            </h2>
          </div>
          <nav className="flex flex-col text-sm">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`text-right p-3.5 transition border-l-4 flex items-center justify-between ${
                  activeTab === tab.id
                    ? 'text-divar-text bg-divar-bg border-brand-500'
                    : 'text-divar-muted hover:text-divar-text hover:bg-divar-bg border-transparent'
                }`}
              >
                <span>
                  <i className={`fa-solid ${tab.icon} w-5 ml-2 text-center`} />
                  {tab.label}
                </span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">{tab.badge}</span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}
