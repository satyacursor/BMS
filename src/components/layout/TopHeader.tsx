import React from 'react';
import { Menu, Bell, Search, ShieldCheck, Wifi, WifiOff } from 'lucide-react';
import { User, FarmAlert } from '../../types';

interface TopHeaderProps {
  currentUser: User;
  alerts: FarmAlert[];
  onOpenDrawer: () => void;
  onOpenSearch: () => void;
  onOpenAlerts: () => void;
  onOpenUserModal: () => void;
  isOnline: boolean;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentUser,
  alerts,
  onOpenDrawer,
  onOpenSearch,
  onOpenAlerts,
  onOpenUserModal,
  isOnline,
}) => {
  const unreadAlertsCount = alerts.filter((a) => !a.read).length;

  return (
    <header className="sticky top-0 z-40 bg-[#0d2b45] text-white shadow-md border-b border-blue-900/60 no-print select-none">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 h-14 flex items-center justify-between gap-2">
        {/* Left: Hamburger & Brand Lockup */}
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            type="button"
            onClick={onOpenDrawer}
            aria-label="Open Navigation Menu"
            className="w-10 h-10 -ml-1 rounded-lg flex items-center justify-center text-slate-200 hover:text-white hover:bg-white/10 active:bg-white/20 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 min-w-0 cursor-pointer" onClick={onOpenDrawer}>
            <img
              src="/src/assets/images/ec_farm_pro_logo_1791187666008.jpg"
              alt="EC Farm Pro Logo"
              className="w-8 h-8 rounded-md object-cover ring-1 ring-emerald-400/40 shrink-0"
              referrerPolicy="no-referrer"
              onError={(e) => {
                // Fallback SVG if image not found
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="min-w-0 flex flex-col justify-center">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-bold text-sm tracking-tight text-white whitespace-nowrap">
                  EC FARM PRO
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
              </div>
              <span className="text-[9px] tracking-wider font-semibold text-emerald-300 uppercase truncate">
                BOILER MANAGEMENT SYSTEM
              </span>
            </div>
          </div>
        </div>

        {/* Right: Search, Notifications, User Role pill */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Online / Offline indicator */}
          <div
            title={isOnline ? 'Connected to Farm Network' : 'Working Offline (Cached Local Storage)'}
            className="hidden xs:flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] text-slate-300 bg-white/5 border border-white/10"
          >
            {isOnline ? (
              <>
                <Wifi className="w-3 h-3 text-emerald-400" />
                <span className="hidden sm:inline text-emerald-300 font-medium">Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3 text-amber-400" />
                <span className="text-amber-300 font-medium">Offline</span>
              </>
            )}
          </div>

          {/* Quick Search */}
          <button
            type="button"
            onClick={onOpenSearch}
            aria-label="Search"
            className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-200 hover:text-white hover:bg-white/10 active:bg-white/20 transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Alerts Bell */}
          <button
            type="button"
            onClick={onOpenAlerts}
            aria-label="Alerts"
            className="w-9 h-9 relative rounded-lg flex items-center justify-center text-slate-200 hover:text-white hover:bg-white/10 active:bg-white/20 transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadAlertsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-sm ring-1 ring-[#0d2b45]">
                {unreadAlertsCount}
              </span>
            )}
          </button>

          {/* User Account / Role Pill */}
          <button
            type="button"
            onClick={onOpenUserModal}
            className="flex items-center gap-1.5 pl-1.5 pr-2 py-1 rounded-lg bg-blue-900/60 hover:bg-blue-800/80 active:bg-blue-800 border border-blue-700/50 text-left transition-colors max-w-[130px] sm:max-w-[160px]"
          >
            <div className="w-6 h-6 rounded-md bg-emerald-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {currentUser.name.charAt(0)}
            </div>
            <div className="min-w-0 flex flex-col">
              <span className="text-[11px] font-medium text-white truncate leading-none">
                {currentUser.name.split(' ')[0]}
              </span>
              <span className="text-[9px] text-blue-200/90 truncate flex items-center gap-0.5 leading-tight">
                <ShieldCheck className="w-2.5 h-2.5 text-emerald-400 shrink-0 inline" />
                {currentUser.role}
              </span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
