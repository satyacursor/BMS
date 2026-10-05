/**
 * EC FARM PRO - BOILER MANAGEMENT SYSTEM
 * Persistent Local Database Engine with Event Dispatcher & SQL Server Export
 */

import {
  Shed,
  Batch,
  FeedTypeItem,
  VaccineMasterItem,
  DailyLogRecord,
  FeedStockEntry,
  BirdSaleRecord,
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
  User,
  FeedStockSummary,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_FARM_SETTINGS,
  INITIAL_SHEDS,
  INITIAL_BATCHES,
  INITIAL_FEED_TYPES,
  INITIAL_VACCINES,
  INITIAL_DAILY_LOGS,
  INITIAL_FEED_PURCHASES,
  INITIAL_BIRD_SALES,
  INITIAL_VACCINATION_SCHEDULES,
  INITIAL_EXPENSES,
  INITIAL_INCOMES,
  INITIAL_CUSTOMERS,
  INITIAL_SUPPLIERS,
  INITIAL_EMPLOYEES,
  INITIAL_ATTENDANCE,
  INITIAL_SALARY_SLIPS,
  INITIAL_ALERTS,
} from '../data/initialData';

const STORAGE_KEYS = {
  USERS: 'ecfarmpro_users_v1',
  SETTINGS: 'ecfarmpro_settings_v1',
  SHEDS: 'ecfarmpro_sheds_v1',
  BATCHES: 'ecfarmpro_batches_v1',
  FEED_TYPES: 'ecfarmpro_feed_types_v1',
  VACCINES: 'ecfarmpro_vaccines_v1',
  DAILY_LOGS: 'ecfarmpro_daily_logs_v1',
  FEED_PURCHASES: 'ecfarmpro_feed_purchases_v1',
  BIRD_SALES: 'ecfarmpro_bird_sales_v1',
  VACCINATION_SCHEDULES: 'ecfarmpro_vaccination_schedules_v1',
  EXPENSES: 'ecfarmpro_expenses_v1',
  INCOMES: 'ecfarmpro_incomes_v1',
  CUSTOMERS: 'ecfarmpro_customers_v1',
  SUPPLIERS: 'ecfarmpro_suppliers_v1',
  EMPLOYEES: 'ecfarmpro_employees_v1',
  ATTENDANCE: 'ecfarmpro_attendance_v1',
  SALARY_SLIPS: 'ecfarmpro_salary_slips_v1',
  ALERTS: 'ecfarmpro_alerts_v1',
  CURRENT_USER: 'ecfarmpro_current_user_v1',
};

// Event emitter for reactive updates
type Listener = () => void;
const listeners: Set<Listener> = new Set();

export function subscribeToStore(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notifyListeners() {
  listeners.forEach((fn) => {
    try {
      fn();
    } catch (e) {
      console.error('Store subscriber error', e);
    }
  });
}

function getStored<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item);
  } catch (e) {
    console.warn(`Failed to parse ${key}`, e);
    return fallback;
  }
}

function setStored<T>(key: string, data: T) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    notifyListeners();
  } catch (e) {
    console.error(`Failed to store ${key}`, e);
  }
}

// Current User Session
export function getCurrentUser(): User {
  return getStored<User>(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0]);
}

export function setCurrentUser(user: User) {
  setStored(STORAGE_KEYS.CURRENT_USER, user);
}

// Settings
export function getFarmSettings(): FarmSettings {
  return getStored<FarmSettings>(STORAGE_KEYS.SETTINGS, INITIAL_FARM_SETTINGS);
}

export function saveFarmSettings(settings: FarmSettings) {
  setStored(STORAGE_KEYS.SETTINGS, settings);
}

// Users
export function getUsers(): User[] {
  return getStored<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
}

export function saveUser(user: User) {
  const users = getUsers();
  const index = users.findIndex((u) => u.id === user.id);
  if (index >= 0) {
    users[index] = user;
  } else {
    users.push(user);
  }
  setStored(STORAGE_KEYS.USERS, users);
}

// Sheds
export function getSheds(): Shed[] {
  return getStored<Shed[]>(STORAGE_KEYS.SHEDS, INITIAL_SHEDS);
}

export function saveShed(shed: Shed) {
  const sheds = getSheds();
  const index = sheds.findIndex((s) => s.id === shed.id);
  if (index >= 0) {
    sheds[index] = shed;
  } else {
    sheds.push(shed);
  }
  setStored(STORAGE_KEYS.SHEDS, sheds);
}

export function deleteShed(shedId: string) {
  const sheds = getSheds().filter((s) => s.id !== shedId);
  setStored(STORAGE_KEYS.SHEDS, sheds);
}

// Batches
export function getBatches(): Batch[] {
  return getStored<Batch[]>(STORAGE_KEYS.BATCHES, INITIAL_BATCHES);
}

export function getBatchById(id: string): Batch | undefined {
  return getBatches().find((b) => b.id === id);
}

export function saveBatch(batch: Batch) {
  const batches = getBatches();
  const index = batches.findIndex((b) => b.id === batch.id);
  if (index >= 0) {
    batches[index] = batch;
  } else {
    batches.unshift(batch);
  }
  setStored(STORAGE_KEYS.BATCHES, batches);

  // Sync shed currentBatchId
  if (batch.status === 'Running') {
    const sheds = getSheds();
    const shedIndex = sheds.findIndex((s) => s.id === batch.shedId);
    if (shedIndex >= 0) {
      sheds[shedIndex].currentBatchId = batch.id;
      sheds[shedIndex].currentBatchNo = batch.batchNo;
      sheds[shedIndex].status = 'Active';
      setStored(STORAGE_KEYS.SHEDS, sheds);
    }
  }
}

export function deleteBatch(batchId: string) {
  const batches = getBatches().filter((b) => b.id !== batchId);
  setStored(STORAGE_KEYS.BATCHES, batches);
}

// Feed Types
export function getFeedTypes(): FeedTypeItem[] {
  return getStored<FeedTypeItem[]>(STORAGE_KEYS.FEED_TYPES, INITIAL_FEED_TYPES);
}

export function saveFeedType(feed: FeedTypeItem) {
  const feeds = getFeedTypes();
  const index = feeds.findIndex((f) => f.id === feed.id);
  if (index >= 0) {
    feeds[index] = feed;
  } else {
    feeds.push(feed);
  }
  setStored(STORAGE_KEYS.FEED_TYPES, feeds);
}

// Vaccines
export function getVaccines(): VaccineMasterItem[] {
  return getStored<VaccineMasterItem[]>(STORAGE_KEYS.VACCINES, INITIAL_VACCINES);
}

export function saveVaccine(v: VaccineMasterItem) {
  const vaccines = getVaccines();
  const index = vaccines.findIndex((item) => item.id === v.id);
  if (index >= 0) {
    vaccines[index] = v;
  } else {
    vaccines.push(v);
  }
  setStored(STORAGE_KEYS.VACCINES, vaccines);
}

// Daily Logs
export function getDailyLogs(): DailyLogRecord[] {
  return getStored<DailyLogRecord[]>(STORAGE_KEYS.DAILY_LOGS, INITIAL_DAILY_LOGS);
}

export function saveDailyLog(log: DailyLogRecord) {
  const logs = getDailyLogs();
  const index = logs.findIndex((l) => l.id === log.id);
  if (index >= 0) {
    logs[index] = log;
  } else {
    logs.unshift(log);
  }
  setStored(STORAGE_KEYS.DAILY_LOGS, logs);

  // Update batch metrics dynamically
  const batch = getBatchById(log.batchId);
  if (batch && batch.status === 'Running') {
    batch.currentAgeDays = Math.max(batch.currentAgeDays, log.birdAgeDays);
    batch.totalMortality += log.mortalityCount + log.cullsCount;
    batch.currentLiveBirds = Math.max(0, batch.initialChicks - batch.totalMortality - batch.totalSold);
    batch.totalFeedConsumedKg += log.feedConsumedKg;
    if (log.averageBirdWeightGrams > 0) {
      batch.averageWeightKg = Number((log.averageBirdWeightGrams / 1000).toFixed(2));
    }
    const totalEstWeight = batch.currentLiveBirds * batch.averageWeightKg;
    if (totalEstWeight > 0) {
      batch.currentFcr = Number((batch.totalFeedConsumedKg / totalEstWeight).toFixed(3));
    }
    saveBatch(batch);
  }
}

export function deleteDailyLog(id: string) {
  const logs = getDailyLogs().filter((l) => l.id !== id);
  setStored(STORAGE_KEYS.DAILY_LOGS, logs);
}

// Feed Purchases / Receipts
export function getFeedPurchases(): FeedStockEntry[] {
  return getStored<FeedStockEntry[]>(STORAGE_KEYS.FEED_PURCHASES, INITIAL_FEED_PURCHASES);
}

export function saveFeedPurchase(entry: FeedStockEntry) {
  const purchases = getFeedPurchases();
  const index = purchases.findIndex((p) => p.id === entry.id);
  if (index >= 0) {
    purchases[index] = entry;
  } else {
    purchases.unshift(entry);
  }
  setStored(STORAGE_KEYS.FEED_PURCHASES, purchases);

  // Also update Supplier balance if pending
  if (entry.paymentStatus === 'Pending' || entry.paymentStatus === 'Partial') {
    const suppliers = getSuppliers();
    const sup = suppliers.find((s) => s.id === entry.supplierId);
    if (sup) {
      sup.currentBalance += entry.totalAmount;
      sup.totalPurchasedAmount += entry.totalAmount;
      saveSupplier(sup);
    }
  }
}

// Bird Sales
export function getBirdSales(): BirdSaleRecord[] {
  return getStored<BirdSaleRecord[]>(STORAGE_KEYS.BIRD_SALES, INITIAL_BIRD_SALES);
}

export function saveBirdSale(sale: BirdSaleRecord) {
  const sales = getBirdSales();
  const index = sales.findIndex((s) => s.id === sale.id);
  if (index >= 0) {
    sales[index] = sale;
  } else {
    sales.unshift(sale);
  }
  setStored(STORAGE_KEYS.BIRD_SALES, sales);

  // Update batch live bird count & sold count
  const batch = getBatchById(sale.batchId);
  if (batch) {
    batch.totalSold += sale.birdsCount;
    batch.currentLiveBirds = Math.max(0, batch.initialChicks - batch.totalMortality - batch.totalSold);
    saveBatch(batch);
  }

  // Update Customer balance & ledger
  if (sale.customerId) {
    const customers = getCustomers();
    const cust = customers.find((c) => c.id === sale.customerId);
    if (cust) {
      cust.totalPurchasedAmount += sale.finalAmount;
      cust.totalPaidAmount += sale.paymentReceived;
      cust.currentBalance += sale.balanceAmount;
      saveCustomer(cust);
    }
  }
}

// Vaccination Schedules
export function getVaccinationSchedules(): VaccinationScheduleRecord[] {
  return getStored<VaccinationScheduleRecord[]>(STORAGE_KEYS.VACCINATION_SCHEDULES, INITIAL_VACCINATION_SCHEDULES);
}

export function saveVaccinationSchedule(record: VaccinationScheduleRecord) {
  const list = getVaccinationSchedules();
  const index = list.findIndex((v) => v.id === record.id);
  if (index >= 0) {
    list[index] = record;
  } else {
    list.unshift(record);
  }
  setStored(STORAGE_KEYS.VACCINATION_SCHEDULES, list);
}

// Expenses
export function getExpenses(): ExpenseRecord[] {
  return getStored<ExpenseRecord[]>(STORAGE_KEYS.EXPENSES, INITIAL_EXPENSES);
}

export function saveExpense(expense: ExpenseRecord) {
  const expenses = getExpenses();
  const index = expenses.findIndex((e) => e.id === expense.id);
  if (index >= 0) {
    expenses[index] = expense;
  } else {
    expenses.unshift(expense);
  }
  setStored(STORAGE_KEYS.EXPENSES, expenses);
}

export function deleteExpense(id: string) {
  const expenses = getExpenses().filter((e) => e.id !== id);
  setStored(STORAGE_KEYS.EXPENSES, expenses);
}

// Incomes
export function getIncomes(): IncomeRecord[] {
  return getStored<IncomeRecord[]>(STORAGE_KEYS.INCOMES, INITIAL_INCOMES);
}

export function saveIncome(income: IncomeRecord) {
  const incomes = getIncomes();
  const index = incomes.findIndex((i) => i.id === income.id);
  if (index >= 0) {
    incomes[index] = income;
  } else {
    incomes.unshift(income);
  }
  setStored(STORAGE_KEYS.INCOMES, incomes);
}

// Customers
export function getCustomers(): Customer[] {
  return getStored<Customer[]>(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
}

export function saveCustomer(cust: Customer) {
  const customers = getCustomers();
  const index = customers.findIndex((c) => c.id === cust.id);
  if (index >= 0) {
    customers[index] = cust;
  } else {
    customers.push(cust);
  }
  setStored(STORAGE_KEYS.CUSTOMERS, customers);
}

// Suppliers
export function getSuppliers(): Supplier[] {
  return getStored<Supplier[]>(STORAGE_KEYS.SUPPLIERS, INITIAL_SUPPLIERS);
}

export function saveSupplier(sup: Supplier) {
  const suppliers = getSuppliers();
  const index = suppliers.findIndex((s) => s.id === sup.id);
  if (index >= 0) {
    suppliers[index] = sup;
  } else {
    suppliers.push(sup);
  }
  setStored(STORAGE_KEYS.SUPPLIERS, suppliers);
}

// Employees
export function getEmployees(): Employee[] {
  return getStored<Employee[]>(STORAGE_KEYS.EMPLOYEES, INITIAL_EMPLOYEES);
}

export function saveEmployee(emp: Employee) {
  const employees = getEmployees();
  const index = employees.findIndex((e) => e.id === emp.id);
  if (index >= 0) {
    employees[index] = emp;
  } else {
    employees.push(emp);
  }
  setStored(STORAGE_KEYS.EMPLOYEES, employees);
}

// Attendance
export function getAttendance(): AttendanceRecord[] {
  return getStored<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE);
}

export function saveAttendance(records: AttendanceRecord[]) {
  const existing = getAttendance();
  const date = records[0]?.date;
  // Replace existing records for that date if already logged
  const filtered = existing.filter((a) => a.date !== date);
  const updated = [...records, ...filtered];
  setStored(STORAGE_KEYS.ATTENDANCE, updated);
}

// Salary Slips
export function getSalarySlips(): SalarySlipRecord[] {
  return getStored<SalarySlipRecord[]>(STORAGE_KEYS.SALARY_SLIPS, INITIAL_SALARY_SLIPS);
}

export function saveSalarySlip(slip: SalarySlipRecord) {
  const slips = getSalarySlips();
  const index = slips.findIndex((s) => s.id === slip.id);
  if (index >= 0) {
    slips[index] = slip;
  } else {
    slips.unshift(slip);
  }
  setStored(STORAGE_KEYS.SALARY_SLIPS, slips);
}

// Alerts
export function getAlerts(): FarmAlert[] {
  return getStored<FarmAlert[]>(STORAGE_KEYS.ALERTS, INITIAL_ALERTS);
}

export function markAlertAsRead(id: string) {
  const alerts = getAlerts();
  const alert = alerts.find((a) => a.id === id);
  if (alert) {
    alert.read = true;
    setStored(STORAGE_KEYS.ALERTS, alerts);
  }
}

// Calculated Feed Inventory Stock Ledger
export function calculateFeedInventory(): FeedStockSummary[] {
  const feedTypes = getFeedTypes();
  const purchases = getFeedPurchases();
  const dailyLogs = getDailyLogs();
  const settings = getFarmSettings();

  return feedTypes.map((ft) => {
    // Opening bags estimation
    const openingBags = ft.category === 'Pre-Starter' ? 10 : ft.category === 'Starter' ? 20 : 30;

    // Purchased bags
    const receivedBags = purchases
      .filter((p) => p.feedTypeId === ft.id || p.feedTypeName.toLowerCase().includes(ft.name.toLowerCase()))
      .reduce((sum, p) => sum + p.bagsCount, 0);

    // Consumed bags from daily logs
    const consumedBags = dailyLogs
      .filter((l) => l.feedType.toLowerCase().includes(ft.category.toLowerCase()) || l.feedType.toLowerCase().includes(ft.name.toLowerCase()))
      .reduce((sum, l) => sum + l.feedConsumedBags, 0);

    const currentBags = Math.max(0, openingBags + receivedBags - consumedBags);
    const totalWeightKg = currentBags * ft.bagWeightKg;
    const totalValuation = currentBags * ft.standardRatePerBag;
    const isLowStock = currentBags <= settings.feedLowStockThresholdBags;

    return {
      feedTypeId: ft.id,
      feedTypeName: ft.name,
      openingBags,
      receivedBags,
      consumedBags,
      currentBags,
      totalWeightKg,
      standardRatePerBag: ft.standardRatePerBag,
      totalValuation,
      lowStockThresholdBags: settings.feedLowStockThresholdBags,
      isLowStock,
    };
  });
}

// Reset data to initial factory state
export function resetToFactoryData() {
  localStorage.clear();
  setStored(STORAGE_KEYS.USERS, INITIAL_USERS);
  setStored(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0]);
  setStored(STORAGE_KEYS.SETTINGS, INITIAL_FARM_SETTINGS);
  setStored(STORAGE_KEYS.SHEDS, INITIAL_SHEDS);
  setStored(STORAGE_KEYS.BATCHES, INITIAL_BATCHES);
  setStored(STORAGE_KEYS.FEED_TYPES, INITIAL_FEED_TYPES);
  setStored(STORAGE_KEYS.VACCINES, INITIAL_VACCINES);
  setStored(STORAGE_KEYS.DAILY_LOGS, INITIAL_DAILY_LOGS);
  setStored(STORAGE_KEYS.FEED_PURCHASES, INITIAL_FEED_PURCHASES);
  setStored(STORAGE_KEYS.BIRD_SALES, INITIAL_BIRD_SALES);
  setStored(STORAGE_KEYS.VACCINATION_SCHEDULES, INITIAL_VACCINATION_SCHEDULES);
  setStored(STORAGE_KEYS.EXPENSES, INITIAL_EXPENSES);
  setStored(STORAGE_KEYS.INCOMES, INITIAL_INCOMES);
  setStored(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
  setStored(STORAGE_KEYS.SUPPLIERS, INITIAL_SUPPLIERS);
  setStored(STORAGE_KEYS.EMPLOYEES, INITIAL_EMPLOYEES);
  setStored(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE);
  setStored(STORAGE_KEYS.SALARY_SLIPS, INITIAL_SALARY_SLIPS);
  setStored(STORAGE_KEYS.ALERTS, INITIAL_ALERTS);
  notifyListeners();
}

// Export complete database backup as JSON
export function exportDatabaseBackupJSON(): string {
  const backup = {
    appName: 'EC FARM PRO',
    subtitle: 'BOILER MANAGEMENT SYSTEM',
    exportTimestamp: new Date().toISOString(),
    users: getUsers(),
    settings: getFarmSettings(),
    sheds: getSheds(),
    batches: getBatches(),
    feedTypes: getFeedTypes(),
    vaccines: getVaccines(),
    dailyLogs: getDailyLogs(),
    feedPurchases: getFeedPurchases(),
    birdSales: getBirdSales(),
    vaccinationSchedules: getVaccinationSchedules(),
    expenses: getExpenses(),
    incomes: getIncomes(),
    customers: getCustomers(),
    suppliers: getSuppliers(),
    employees: getEmployees(),
    attendance: getAttendance(),
    salarySlips: getSalarySlips(),
  };
  return JSON.stringify(backup, null, 2);
}

// Import JSON database backup
export function importDatabaseBackupJSON(jsonStr: string): boolean {
  try {
    const data = JSON.parse(jsonStr);
    if (data.sheds) setStored(STORAGE_KEYS.SHEDS, data.sheds);
    if (data.batches) setStored(STORAGE_KEYS.BATCHES, data.batches);
    if (data.feedTypes) setStored(STORAGE_KEYS.FEED_TYPES, data.feedTypes);
    if (data.vaccines) setStored(STORAGE_KEYS.VACCINES, data.vaccines);
    if (data.dailyLogs) setStored(STORAGE_KEYS.DAILY_LOGS, data.dailyLogs);
    if (data.feedPurchases) setStored(STORAGE_KEYS.FEED_PURCHASES, data.feedPurchases);
    if (data.birdSales) setStored(STORAGE_KEYS.BIRD_SALES, data.birdSales);
    if (data.vaccinationSchedules) setStored(STORAGE_KEYS.VACCINATION_SCHEDULES, data.vaccinationSchedules);
    if (data.expenses) setStored(STORAGE_KEYS.EXPENSES, data.expenses);
    if (data.incomes) setStored(STORAGE_KEYS.INCOMES, data.incomes);
    if (data.customers) setStored(STORAGE_KEYS.CUSTOMERS, data.customers);
    if (data.suppliers) setStored(STORAGE_KEYS.SUPPLIERS, data.suppliers);
    if (data.employees) setStored(STORAGE_KEYS.EMPLOYEES, data.employees);
    if (data.attendance) setStored(STORAGE_KEYS.ATTENDANCE, data.attendance);
    if (data.salarySlips) setStored(STORAGE_KEYS.SALARY_SLIPS, data.salarySlips);
    notifyListeners();
    return true;
  } catch (e) {
    console.error('Import failed', e);
    return false;
  }
}
