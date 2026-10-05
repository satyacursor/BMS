/**
 * EC FARM PRO - BOILER MANAGEMENT SYSTEM
 * Primary Mobile Application Orchestration
 */

import React, { useState, useEffect, useCallback } from 'react';
import { TopHeader } from './components/layout/TopHeader';
import { BottomNav, MainTabType } from './components/layout/BottomNav';
import { NavDrawer, ActiveModule } from './components/layout/NavDrawer';
import { QuickActionFAB } from './components/layout/QuickActionFAB';
import { LoginModal } from './components/auth/LoginModal';
import { SearchGlobalModal } from './components/common/SearchGlobalModal';
import { PrintSalarySlipModal } from './components/common/PrintSalarySlipModal';
import { PrintInvoiceModal } from './components/common/PrintInvoiceModal';
import { BatchClosingModal } from './components/batches/BatchClosingModal';

// Views
import { DashboardView } from './components/dashboard/DashboardView';
import { BatchesView } from './components/batches/BatchesView';
import { ShedsView } from './components/sheds/ShedsView';
import { OperationsView } from './components/operations/OperationsView';
import { SalesView } from './components/sales/SalesView';
import { InventoryView } from './components/inventory/InventoryView';
import { FinanceView } from './components/finance/FinanceView';
import { CustomersView } from './components/customers/CustomersView';
import { SuppliersView } from './components/suppliers/SuppliersView';
import { HrPayrollView } from './components/hr/HrPayrollView';
import { ReportCenterView } from './components/reports/ReportCenterView';
import { AlertCenterView } from './components/alerts/AlertCenterView';
import { SettingsView } from './components/settings/SettingsView';
import { FeedMasterView } from './components/masters/FeedMasterView';
import { VaccinationMasterView } from './components/masters/VaccinationMasterView';
import { ExpenseMasterView } from './components/masters/ExpenseMasterView';

// Services & Storage
import * as storage from './services/storage';
import {
  User,
  Batch,
  Shed,
  DailyLogRecord,
  BirdSaleRecord,
  FeedStockEntry,
  VaccinationScheduleRecord,
  ExpenseRecord,
  IncomeRecord,
  Customer,
  Supplier,
  Employee,
  AttendanceRecord,
  SalarySlipRecord,
  FarmAlert,
  FarmSettings,
  BatchClosingData,
} from './types';

export default function App() {
  // Persistence State
  const [currentUser, setCurrentUser] = useState<User>(storage.getCurrentUser());
  const [users, setUsers] = useState<User[]>(storage.getUsers());
  const [settings, setSettings] = useState<FarmSettings>(storage.getFarmSettings());
  const [sheds, setSheds] = useState<Shed[]>(storage.getSheds());
  const [batches, setBatches] = useState<Batch[]>(storage.getBatches());
  const [dailyLogs, setDailyLogs] = useState<DailyLogRecord[]>(storage.getDailyLogs());
  const [feedStock, setFeedStock] = useState(storage.calculateFeedInventory());
  const [feedTypes, setFeedTypes] = useState(storage.getFeedTypes());
  const [feedPurchases, setFeedPurchases] = useState(storage.getFeedPurchases());
  const [sales, setSales] = useState<BirdSaleRecord[]>(storage.getBirdSales());
  const [vaccines, setVaccines] = useState(storage.getVaccines());
  const [vaccinationSchedules, setVaccinationSchedules] = useState(storage.getVaccinationSchedules());
  const [expenses, setExpenses] = useState<ExpenseRecord[]>(storage.getExpenses());
  const [incomes, setIncomes] = useState<IncomeRecord[]>(storage.getIncomes());
  const [customers, setCustomers] = useState<Customer[]>(storage.getCustomers());
  const [suppliers, setSuppliers] = useState<Supplier[]>(storage.getSuppliers());
  const [employees, setEmployees] = useState<Employee[]>(storage.getEmployees());
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(storage.getAttendance());
  const [salarySlips, setSalarySlips] = useState<SalarySlipRecord[]>(storage.getSalarySlips());
  const [alerts, setAlerts] = useState<FarmAlert[]>(storage.getAlerts());

  // Online / Network Status
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync Store State Function
  const syncStore = useCallback(() => {
    setCurrentUser(storage.getCurrentUser());
    setUsers(storage.getUsers());
    setSettings(storage.getFarmSettings());
    setSheds(storage.getSheds());
    setBatches(storage.getBatches());
    setDailyLogs(storage.getDailyLogs());
    setFeedStock(storage.calculateFeedInventory());
    setFeedTypes(storage.getFeedTypes());
    setFeedPurchases(storage.getFeedPurchases());
    setSales(storage.getBirdSales());
    setVaccines(storage.getVaccines());
    setVaccinationSchedules(storage.getVaccinationSchedules());
    setExpenses(storage.getExpenses());
    setIncomes(storage.getIncomes());
    setCustomers(storage.getCustomers());
    setSuppliers(storage.getSuppliers());
    setEmployees(storage.getEmployees());
    setAttendance(storage.getAttendance());
    setSalarySlips(storage.getSalarySlips());
    setAlerts(storage.getAlerts());
  }, []);

  useEffect(() => {
    const unsubscribe = storage.subscribeToStore(() => {
      syncStore();
    });
    return unsubscribe;
  }, [syncStore]);

  // Navigation State
  const [currentTab, setCurrentTab] = useState<MainTabType>('dashboard');
  const [activeModule, setActiveModule] = useState<ActiveModule>('dashboard');

  // Modals & Overlays
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<BirdSaleRecord | null>(null);
  const [selectedSalarySlip, setSelectedSalarySlip] = useState<SalarySlipRecord | null>(null);
  const [batchClosingTarget, setBatchClosingTarget] = useState<Batch | null>(null);

  // Tab change handler
  const handleTabChange = (tab: MainTabType) => {
    setCurrentTab(tab);
    if (tab === 'dashboard') setActiveModule('dashboard');
    else if (tab === 'batches') setActiveModule('master-batches');
    else if (tab === 'operations') setActiveModule('trans-daily');
    else if (tab === 'finance') setActiveModule('finance');
    else if (tab === 'more') setIsDrawerOpen(true);
  };

  const handleModuleSelect = (mod: ActiveModule) => {
    setActiveModule(mod);
    if (mod === 'dashboard') setCurrentTab('dashboard');
    else if (mod === 'master-batches') setCurrentTab('batches');
    else if (mod === 'trans-daily' || mod === 'trans-feed' || mod === 'trans-vaccination') setCurrentTab('operations');
    else if (mod === 'finance' || mod === 'trans-sales') setCurrentTab('finance');
    else setCurrentTab('more');
  };

  // FAB Actions
  const handleQuickAction = (actionType: 'daily-log' | 'bird-sale' | 'feed-entry' | 'expense' | 'vaccine') => {
    if (actionType === 'daily-log') {
      setActiveModule('trans-daily');
      setCurrentTab('operations');
    } else if (actionType === 'bird-sale') {
      setActiveModule('trans-sales');
      setCurrentTab('finance');
    } else if (actionType === 'feed-entry') {
      setActiveModule('trans-feed');
      setCurrentTab('operations');
    } else if (actionType === 'expense') {
      setActiveModule('finance');
      setCurrentTab('finance');
    } else if (actionType === 'vaccine') {
      setActiveModule('trans-vaccination');
      setCurrentTab('operations');
    }
  };

  // Global search result jump
  const handleSearchResultClick = (type: string, id: string) => {
    if (type === 'batch') {
      setActiveModule('master-batches');
      setCurrentTab('batches');
    } else if (type === 'sale') {
      setActiveModule('trans-sales');
      setCurrentTab('finance');
      const s = sales.find((x) => x.id === id);
      if (s) setSelectedInvoice(s);
    } else if (type === 'feed') {
      setActiveModule('inventory');
      setCurrentTab('operations');
    } else if (type === 'expense') {
      setActiveModule('finance');
      setCurrentTab('finance');
    } else if (type === 'employee') {
      setActiveModule('hr-payroll');
      setCurrentTab('more');
    } else if (type === 'customer') {
      setActiveModule('customers');
      setCurrentTab('more');
    }
  };

  // Batch closing confirmation
  const handleConfirmBatchClosing = (batchId: string, closingData: BatchClosingData) => {
    const batch = batches.find((b) => b.id === batchId);
    if (batch) {
      batch.status = 'Closed';
      batch.closingData = closingData;
      storage.saveBatch(batch);

      // Free up shed status to 'Cleaning'
      const shed = sheds.find((s) => s.id === batch.shedId);
      if (shed) {
        shed.status = 'Cleaning';
        shed.currentBatchId = undefined;
        shed.currentBatchNo = undefined;
        storage.saveShed(shed);
      }
    }
    setBatchClosingTarget(null);
    alert(`Batch ${batch?.batchNo} closed successfully! Shed is now set for sanitization.`);
  };

  // Render appropriate module view
  const renderModuleView = () => {
    switch (activeModule) {
      case 'dashboard':
        return (
          <DashboardView
            batches={batches}
            sheds={sheds}
            feedStock={feedStock}
            alerts={alerts}
            dailyLogs={dailyLogs}
            currentUser={currentUser}
            onNavigate={(mod) => handleModuleSelect(mod)}
            onSelectBatch={(b) => {
              setActiveModule('master-batches');
              setCurrentTab('batches');
            }}
            onQuickLog={() => {
              setActiveModule('trans-daily');
              setCurrentTab('operations');
            }}
          />
        );

      case 'master-sheds':
        return (
          <ShedsView
            sheds={sheds}
            currentUser={currentUser}
            onSaveShed={(s) => storage.saveShed(s)}
            onDeleteShed={(id) => storage.deleteShed(id)}
          />
        );

      case 'master-batches':
      case 'trans-closing':
        return (
          <BatchesView
            batches={batches}
            sheds={sheds}
            suppliers={suppliers}
            currentUser={currentUser}
            onSaveBatch={(b) => storage.saveBatch(b)}
            onSelectBatchDetails={(b) => {
              setBatchClosingTarget(b);
            }}
            onOpenClosingWizard={(b) => setBatchClosingTarget(b)}
          />
        );

      case 'master-feed':
        return (
          <FeedMasterView
            feedTypes={feedTypes}
            onSaveFeedType={(f) => storage.saveFeedType(f)}
          />
        );

      case 'master-vaccines':
        return (
          <VaccinationMasterView
            vaccines={vaccines}
            onSaveVaccine={(v) => storage.saveVaccine(v)}
          />
        );

      case 'master-expenses':
        return <ExpenseMasterView categories={[]} />;

      case 'trans-daily':
      case 'trans-feed':
      case 'trans-vaccination':
        return (
          <OperationsView
            batches={batches}
            sheds={sheds}
            dailyLogs={dailyLogs}
            feedTypes={feedTypes}
            feedPurchases={feedPurchases}
            vaccinationSchedules={vaccinationSchedules}
            vaccines={vaccines}
            suppliers={suppliers}
            currentUser={currentUser}
            onSaveDailyLog={(log) => storage.saveDailyLog(log)}
            onSaveFeedPurchase={(p) => storage.saveFeedPurchase(p)}
            onSaveVaccination={(v) => storage.saveVaccinationSchedule(v)}
          />
        );

      case 'trans-sales':
        return (
          <SalesView
            sales={sales}
            batches={batches}
            sheds={sheds}
            customers={customers}
            onSaveBirdSale={(sale) => storage.saveBirdSale(sale)}
            onOpenInvoiceModal={(sale) => setSelectedInvoice(sale)}
          />
        );

      case 'inventory':
        return (
          <InventoryView
            feedStock={feedStock}
            feedPurchases={feedPurchases}
            dailyLogs={dailyLogs}
            settings={settings}
            onOpenFeedEntryModal={() => {
              setActiveModule('trans-feed');
              setCurrentTab('operations');
            }}
          />
        );

      case 'finance':
        return (
          <FinanceView
            expenses={expenses}
            incomes={incomes}
            batches={batches}
            customers={customers}
            suppliers={suppliers}
            currentUser={currentUser}
            onSaveExpense={(exp) => storage.saveExpense(exp)}
            onSaveIncome={(inc) => storage.saveIncome(inc)}
          />
        );

      case 'customers':
      case 'master-buyers':
        return (
          <CustomersView
            customers={customers}
            sales={sales}
            settings={settings}
            onSaveCustomer={(c) => storage.saveCustomer(c)}
          />
        );

      case 'suppliers':
      case 'master-suppliers':
        return (
          <SuppliersView
            suppliers={suppliers}
            feedPurchases={feedPurchases}
            settings={settings}
            onSaveSupplier={(s) => storage.saveSupplier(s)}
          />
        );

      case 'hr-payroll':
      case 'master-employees':
        return (
          <HrPayrollView
            employees={employees}
            attendance={attendance}
            salarySlips={salarySlips}
            settings={settings}
            currentUser={currentUser}
            onSaveEmployee={(emp) => storage.saveEmployee(emp)}
            onSaveAttendance={(recs) => storage.saveAttendance(recs)}
            onSaveSalarySlip={(slip) => storage.saveSalarySlip(slip)}
            onOpenSalarySlipModal={(slip) => setSelectedSalarySlip(slip)}
          />
        );

      case 'reports':
        return (
          <ReportCenterView
            batches={batches}
            sheds={sheds}
            sales={sales}
            dailyLogs={dailyLogs}
            feedPurchases={feedPurchases}
            expenses={expenses}
            incomes={incomes}
            customers={customers}
            suppliers={suppliers}
            employees={employees}
            salarySlips={salarySlips}
            settings={settings}
          />
        );

      case 'alerts':
        return (
          <AlertCenterView
            alerts={alerts}
            onMarkAsRead={(id) => storage.markAlertAsRead(id)}
            onNavigateToModule={(mod) => handleModuleSelect(mod)}
          />
        );

      case 'settings':
        return (
          <SettingsView
            settings={settings}
            currentUser={currentUser}
            onSaveSettings={(s) => storage.saveFarmSettings(s)}
            onResetFactoryData={() => {
              storage.resetToFactoryData();
              syncStore();
              alert('EC FARM PRO reset to factory initial data.');
            }}
          />
        );

      default:
        return (
          <DashboardView
            batches={batches}
            sheds={sheds}
            feedStock={feedStock}
            alerts={alerts}
            dailyLogs={dailyLogs}
            currentUser={currentUser}
            onNavigate={(mod) => handleModuleSelect(mod)}
            onSelectBatch={() => {
              setActiveModule('master-batches');
              setCurrentTab('batches');
            }}
            onQuickLog={() => {
              setActiveModule('trans-daily');
              setCurrentTab('operations');
            }}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col antialiased font-sans text-slate-900 pb-12">
      {/* Top Application Header */}
      <TopHeader
        currentUser={currentUser}
        alerts={alerts}
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAlerts={() => handleModuleSelect('alerts')}
        onOpenUserModal={() => setIsLoginModalOpen(true)}
        isOnline={isOnline}
      />

      {/* Main Mobile Screen Viewport Container */}
      <main className="flex-1 w-full max-w-lg mx-auto px-3 sm:px-4 py-3 sm:py-4">
        {renderModuleView()}
      </main>

      {/* Quick Action Floating Action Button */}
      <QuickActionFAB onAction={handleQuickAction} />

      {/* Fixed Bottom Navigation (Thumb Zone) */}
      <BottomNav
        currentTab={currentTab}
        onChangeTab={handleTabChange}
        unreadAlertsCount={alerts.filter((a) => !a.read).length}
      />

      {/* Navigation Drawer covering all 12 modules */}
      <NavDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        activeModule={activeModule}
        onSelectModule={handleModuleSelect}
        currentUser={currentUser}
        unreadAlertsCount={alerts.filter((a) => !a.read).length}
        onLogout={() => setIsLoginModalOpen(true)}
      />

      {/* Unified Global Search Modal */}
      <SearchGlobalModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        batches={batches}
        dailyLogs={dailyLogs}
        sales={sales}
        expenses={expenses}
        employees={employees}
        customers={customers}
        feedPurchases={feedPurchases}
        onSelectResult={handleSearchResultClick}
      />

      {/* User Login & Role Switcher Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        currentUser={currentUser}
        users={users}
        onSelectUser={(u) => {
          storage.setCurrentUser(u);
          setCurrentUser(u);
        }}
        onLogout={() => {
          setIsLoginModalOpen(true);
        }}
      />

      {/* Printable Bird Sale Invoice Modal */}
      <PrintInvoiceModal
        isOpen={Boolean(selectedInvoice)}
        onClose={() => setSelectedInvoice(null)}
        sale={selectedInvoice}
        settings={settings}
      />

      {/* Printable Salary Slip Modal */}
      <PrintSalarySlipModal
        isOpen={Boolean(selectedSalarySlip)}
        onClose={() => setSelectedSalarySlip(null)}
        slip={selectedSalarySlip}
        settings={settings}
      />

      {/* Batch Closing P&L Wizard Modal */}
      <BatchClosingModal
        isOpen={Boolean(batchClosingTarget)}
        onClose={() => setBatchClosingTarget(null)}
        batch={batchClosingTarget}
        sales={sales}
        dailyLogs={dailyLogs}
        expenses={expenses}
        onConfirmClose={handleConfirmBatchClosing}
      />
    </div>
  );
}
