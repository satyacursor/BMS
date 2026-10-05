import React from 'react';
import { LayoutDashboard, Layers, ClipboardEdit, IndianRupee, Menu } from 'lucide-react';

export type MainTabType = 'dashboard' | 'batches' | 'operations' | 'finance' | 'more';

interface BottomNavProps {
  currentTab: MainTabType;
  onChangeTab: (tab: MainTabType) => void;
  unreadAlertsCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onChangeTab,
  unreadAlertsCount,
}) => {
  const navItems = [
    {
      id: 'dashboard' as MainTabType,
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'batches' as MainTabType,
      label: 'Batches',
      icon: Layers,
    },
    {
      id: 'operations' as MainTabType,
      label: 'Daily Ops',
      icon: ClipboardEdit,
    },
    {
      id: 'finance' as MainTabType,
      label: 'Finance',
      icon: IndianRupee,
    },
    {
      id: 'more' as MainTabType,
      label: 'Modules',
      icon: Menu,
      badge: unreadAlertsCount > 0 ? unreadAlertsCount : undefined,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] no-print pb-safe">
      <div className="max-w-md mx-auto grid grid-cols-5 h-16 items-center px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChangeTab(item.id)}
              className={`relative flex flex-col items-center justify-center h-full py-1 transition-transform active:scale-95 ${
                isActive ? 'text-[#0d2b45]' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <div
                className={`relative flex items-center justify-center w-10 h-7 rounded-full transition-colors ${
                  isActive ? 'bg-blue-50 text-blue-900 font-bold' : ''
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.4px] text-[#0d2b45]' : 'stroke-[1.8px]'}`} />
                {item.badge !== undefined && (
                  <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-sm">
                    {item.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] tracking-tight mt-0.5 truncate max-w-[62px] ${
                  isActive ? 'font-bold text-[#0d2b45]' : 'font-medium'
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1 rounded-full bg-emerald-500 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
