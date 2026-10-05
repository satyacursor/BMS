import React from 'react';
import {
  X,
  LayoutDashboard,
  Database,
  ArrowLeftRight,
  Boxes,
  IndianRupee,
  Users,
  Truck,
  UserCheck,
  Search,
  FileSpreadsheet,
  Bell,
  Settings,
  ChevronRight,
  Building2,
  Layers,
  Wheat,
  Syringe,
  Wallet,
  Receipt,
  LogOut,
} from 'lucide-react';
import { User } from '../../types';

export type ActiveModule =
  | 'dashboard'
  | 'master-sheds'
  | 'master-batches'
  | 'master-feed'
  | 'master-vaccines'
  | 'master-employees'
  | 'master-suppliers'
  | 'master-buyers'
  | 'master-expenses'
  | 'trans-daily'
  | 'trans-feed'
  | 'trans-sales'
  | 'trans-vaccination'
  | 'trans-closing'
  | 'inventory'
  | 'finance'
  | 'customers'
  | 'suppliers'
  | 'hr-payroll'
  | 'search'
  | 'reports'
  | 'alerts'
  | 'settings';

interface NavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeModule: ActiveModule;
  onSelectModule: (module: ActiveModule) => void;
  currentUser: User;
  unreadAlertsCount: number;
  onLogout: () => void;
}

export const NavDrawer: React.FC<NavDrawerProps> = ({
  isOpen,
  onClose,
  activeModule,
  onSelectModule,
  currentUser,
  unreadAlertsCount,
  onLogout,
}) => {
  if (!isOpen) return null;

  const navigateTo = (mod: ActiveModule) => {
    onSelectModule(mod);
    onClose();
  };

  const menuSections = [
    {
      title: 'Main',
      items: [
        {
          id: 'dashboard' as ActiveModule,
          label: 'Dashboard',
          icon: LayoutDashboard,
          badge: null,
        },
      ],
    },
    {
      title: 'Master Data',
      icon: Database,
      items: [
        { id: 'master-sheds' as ActiveModule, label: 'Farm & Sheds', icon: Building2 },
        { id: 'master-batches' as ActiveModule, label: 'Poultry Batches', icon: Layers },
        { id: 'master-feed' as ActiveModule, label: 'Feed Master', icon: Wheat },
        { id: 'master-vaccines' as ActiveModule, label: 'Vaccination Master', icon: Syringe },
        { id: 'master-buyers' as ActiveModule, label: 'Buyer / Customer Master', icon: Users },
        { id: 'master-suppliers' as ActiveModule, label: 'Supplier Master', icon: Truck },
        { id: 'master-employees' as ActiveModule, label: 'Employee Master', icon: UserCheck },
        { id: 'master-expenses' as ActiveModule, label: 'Expense Categories', icon: Wallet },
      ],
    },
    {
      title: 'Transactions',
      icon: ArrowLeftRight,
      items: [
        { id: 'trans-daily' as ActiveModule, label: 'Daily Shed Record & Log', icon: LayoutDashboard },
        { id: 'trans-feed' as ActiveModule, label: 'Feed Stock Entry', icon: Wheat },
        { id: 'trans-sales' as ActiveModule, label: 'Bird Sales & Weighbridge', icon: Receipt },
        { id: 'trans-vaccination' as ActiveModule, label: 'Vaccination Schedule', icon: Syringe },
        { id: 'trans-closing' as ActiveModule, label: 'Batch Closing & P&L', icon: Layers },
      ],
    },
    {
      title: 'Operations & Management',
      items: [
        { id: 'inventory' as ActiveModule, label: 'Inventory & Stock Ledger', icon: Boxes },
        { id: 'finance' as ActiveModule, label: 'Finance & Accounts', icon: IndianRupee },
        { id: 'customers' as ActiveModule, label: 'Customers & Receivables', icon: Users },
        { id: 'suppliers' as ActiveModule, label: 'Suppliers & Payables', icon: Truck },
        { id: 'hr-payroll' as ActiveModule, label: 'HR & Payroll (Salary Slips)', icon: UserCheck },
      ],
    },
    {
      title: 'Analysis & Administration',
      items: [
        { id: 'search' as ActiveModule, label: 'Search Information', icon: Search },
        { id: 'reports' as ActiveModule, label: 'Report Center (10+ Suites)', icon: FileSpreadsheet },
        {
          id: 'alerts' as ActiveModule,
          label: 'Alert Center',
          icon: Bell,
          badge: unreadAlertsCount > 0 ? unreadAlertsCount : null,
        },
        { id: 'settings' as ActiveModule, label: 'Settings & Database', icon: Settings },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex select-none no-print">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-xs sm:max-w-sm bg-white h-full flex flex-col shadow-2xl z-10 animate-in slide-in-from-left duration-200">
        {/* Drawer Header */}
        <div className="bg-[#0d2b45] text-white p-4 flex items-center justify-between border-b border-blue-900">
          <div className="flex items-center gap-3">
            <img
              src="/src/assets/images/ec_farm_pro_logo_1791187666008.jpg"
              alt="Logo"
              className="w-10 h-10 rounded-lg object-cover ring-1 ring-emerald-400/50 shrink-0"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div>
              <h2 className="font-bold text-base leading-tight text-white">EC FARM PRO</h2>
              <p className="text-[10px] font-semibold text-emerald-300 uppercase tracking-wider">
                BOILER MANAGEMENT SYSTEM
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 active:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-blue-900 text-emerald-400 font-bold flex items-center justify-center text-sm shrink-0">
              {currentUser.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-900 truncate">{currentUser.name}</p>
              <p className="text-[11px] text-slate-500 truncate">{currentUser.role}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onLogout}
            title="Log out"
            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Navigation Items */}
        <div className="flex-1 overflow-y-auto py-2 px-3 space-y-4">
          {menuSections.map((sec, secIdx) => (
            <div key={secIdx}>
              <div className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {sec.title}
              </div>
              <div className="mt-1 space-y-0.5">
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const isSelected = activeModule === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => navigateTo(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-[#0d2b45] text-white shadow-sm'
                          : 'text-slate-700 hover:bg-slate-100 active:bg-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Icon
                          className={`w-4 h-4 shrink-0 ${
                            isSelected ? 'text-emerald-400' : 'text-slate-500'
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {item.badge && (
                          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                            {item.badge}
                          </span>
                        )}
                        {!isSelected && <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Drawer Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center">
          <p className="text-[11px] font-medium text-slate-500">EC FARM PRO Mobile v2.4</p>
          <p className="text-[10px] text-slate-400">Environment Controlled Broiler Suite</p>
        </div>
      </div>
    </div>
  );
};
