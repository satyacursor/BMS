/**
 * EC FARM PRO - BOILER MANAGEMENT SYSTEM
 * Core TypeScript Type Definitions
 */

export type UserRole = 
  | 'Super Admin'
  | 'Admin'
  | 'Farm Manager'
  | 'Farm Supervisor'
  | 'Accountant'
  | 'Farm Staff'
  | 'Viewer';

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  active: boolean;
  avatar?: string;
}

export type ShedStatus = 'Active' | 'Cleaning' | 'Empty' | 'Maintenance';

export interface Shed {
  id: string;
  shedNo: string;
  shedName: string;
  shedDetails: string;
  lengthFt: number;
  widthFt: number;
  areaSqFt: number;
  capacity: number;
  exhaustFanCount: number;
  coolingPadAreaSqFt: number;
  heatingSystem: string;
  feederLinesCount: number;
  drinkerLinesCount: number;
  status: ShedStatus;
  currentBatchId?: string;
  currentBatchNo?: string;
  supervisorName: string;
  notes?: string;
}

export type BatchStatus = 'Running' | 'Closed';

export interface BatchClosingData {
  closingDate: string;
  finalBirdsSold: number;
  totalWeightSoldKg: number;
  averageWeightKg: number;
  averageRatePerKg: number;
  totalMortality: number;
  mortalityPercent: number;
  totalFeedConsumedKg: number;
  fcr: number; // Feed Conversion Ratio = Feed kg / Total weight kg
  epef: number; // European Production Efficiency Factor
  totalRevenue: number;
  chickCost: number;
  feedCost: number;
  medicineVaccineCost: number;
  dieselElectricityCost: number;
  labourCost: number;
  otherOverheads: number;
  totalExpenses: number;
  netProfit: number;
  profitPerBird: number;
  profitPerKg: number;
  costPerKg: number;
  remarks: string;
}

export interface Batch {
  id: string;
  batchNo: string;
  shedId: string;
  shedNo: string;
  birdBreed: string; // Cobb 500, Ross 308, Hubbard, etc.
  placementDate: string;
  initialChicks: number;
  chickRate: number; // Cost per day-old chick
  supplierId: string;
  supplierName: string;
  status: BatchStatus;
  currentAgeDays: number;
  currentLiveBirds: number;
  totalMortality: number;
  totalSold: number;
  totalFeedConsumedKg: number;
  averageWeightKg: number;
  currentFcr: number;
  closingData?: BatchClosingData;
  notes?: string;
}

export interface FeedTypeItem {
  id: string;
  code: string;
  name: string; // Pre-Starter, Starter, Finisher 1, Finisher 2
  category: 'Pre-Starter' | 'Starter' | 'Finisher';
  bagWeightKg: number;
  standardRatePerBag: number;
  crudeProteinPercent: number;
  meKcalPerKg: number;
  recommendedAgeStartDays: number;
  recommendedAgeEndDays: number;
  manufacturer: string;
}

export interface VaccineMasterItem {
  id: string;
  vaccineName: string;
  diseaseTarget: string; // Marek's, ND/Ranikhet, IBD/Gumboro, IB, etc.
  recommendedAgeDays: number;
  administrationRoute: 'Eye Drop' | 'Drinking Water' | 'Subcutaneous' | 'Spray' | 'Wing Web';
  standardDosage: string;
  manufacturer: string;
  mandatory: boolean;
  notes: string;
}

export interface DailyLogRecord {
  id: string;
  date: string;
  batchId: string;
  batchNo: string;
  shedId: string;
  shedNo: string;
  birdAgeDays: number;
  mortalityCount: number;
  cullsCount: number;
  feedType: string;
  feedConsumedBags: number;
  feedConsumedKg: number;
  waterConsumedLiters: number;
  averageBirdWeightGrams: number;
  roomTemperatureC: number;
  roomHumidityPercent: number;
  fansRunningCount: number;
  coolingPadRunning: boolean;
  medicinesGiven?: string;
  healthRemarks?: string;
  recordedBy: string;
}

export interface FeedStockEntry {
  id: string;
  date: string;
  invoiceNo: string;
  feedTypeId: string;
  feedTypeName: string;
  bagsCount: number;
  weightPerBagKg: number;
  totalWeightKg: number;
  ratePerBag: number;
  totalAmount: number;
  supplierId: string;
  supplierName: string;
  batchAllocatedId?: string;
  vehicleNo: string;
  paymentStatus: 'Paid' | 'Pending' | 'Partial';
  notes?: string;
}

export interface BirdSaleRecord {
  id: string;
  invoiceNo: string;
  date: string;
  batchId: string;
  batchNo: string;
  shedId: string;
  shedNo: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  birdsCount: number;
  cagesCount: number;
  emptyCagesWeightKg: number;
  grossWeightKg: number;
  netWeightKg: number;
  averageWeightKg: number;
  ratePerKg: number;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  paymentReceived: number;
  balanceAmount: number;
  paymentMode: 'Cash' | 'Bank Transfer / NEFT' | 'UPI' | 'Cheque' | 'Credit';
  vehicleNo: string;
  driverName?: string;
  weighbridgeSlipNo?: string;
  notes?: string;
}

export interface VaccinationScheduleRecord {
  id: string;
  batchId: string;
  batchNo: string;
  shedId: string;
  shedNo: string;
  vaccineId: string;
  vaccineName: string;
  targetAgeDays: number;
  scheduledDate: string;
  administeredDate?: string;
  status: 'Pending' | 'Completed' | 'Overdue';
  birdsCovered?: number;
  administeredBy?: string;
  batchLotNo?: string;
  remarks?: string;
}

export type ExpenseCategory = 
  | 'Electricity & EB Bill'
  | 'Generator Diesel'
  | 'Gas Brooding / Heating'
  | 'Medicines & Sanitizers'
  | 'Rice Husk / Litter Material'
  | 'Equipment & Maintenance'
  | 'Labour & Wages'
  | 'Transport & Freight'
  | 'Chicks Purchase'
  | 'Feed Purchase'
  | 'Farm Miscellaneous';

export interface ExpenseRecord {
  id: string;
  date: string;
  expenseCategory: ExpenseCategory;
  batchId?: string; // Optional if tied to specific batch or general farm
  batchNo?: string;
  shedId?: string;
  amount: number;
  paidTo: string;
  paymentMode: 'Cash' | 'Bank Account' | 'UPI' | 'Cheque';
  voucherNo: string;
  approvedBy: string;
  description: string;
}

export interface IncomeRecord {
  id: string;
  date: string;
  incomeCategory: 'Bird Sale' | 'Poultry Manure / Fertilizer' | 'Empty Feed Bags' | 'Culled Birds' | 'Subsidy / Incentive' | 'Other';
  batchId?: string;
  batchNo?: string;
  amount: number;
  receivedFrom: string;
  paymentMode: 'Cash' | 'Bank Account' | 'UPI' | 'Cheque';
  receiptNo: string;
  description: string;
}

export interface Customer {
  id: string;
  name: string;
  businessName: string;
  type: 'Wholesaler' | 'Retailer / Chicken Shop' | 'Processing Plant' | 'Trader';
  phone: string;
  altPhone?: string;
  address: string;
  city: string;
  gstNo?: string;
  vehicleNo?: string;
  creditLimit: number;
  openingBalance: number;
  currentBalance: number; // positive = customer owes farm
  totalPurchasedAmount: number;
  totalPaidAmount: number;
  active: boolean;
}

export interface Supplier {
  id: string;
  name: string;
  category: 'Feed Supplier' | 'Hatchery (Chicks)' | 'Medicines & Vaccines' | 'Equipment & Spare Parts' | 'Diesel & Energy' | 'Litter & General';
  contactPerson: string;
  phone: string;
  email?: string;
  address: string;
  gstNo?: string;
  bankDetails?: string;
  creditDaysLimit: number;
  openingBalance: number;
  currentBalance: number; // positive = farm owes supplier
  totalPurchasedAmount: number;
  totalPaidAmount: number;
  active: boolean;
}

export interface Employee {
  id: string;
  empId: string; // e.g. EMP-001
  name: string;
  designation: 'EC Shed Operator' | 'Farm Supervisor' | 'Vaccination Technician' | 'Farm Manager' | 'Accountant' | 'General Worker' | 'Security Guard';
  phone: string;
  address: string;
  bloodGroup: string;
  monthlySalary: number;
  dailyRate: number;
  joinedDate: string;
  active: boolean;
  emergencyContact: string;
  bankAccountNumber?: string;
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Half Day' | 'Leave' | 'Weekly Off';

export interface AttendanceRecord {
  id: string;
  date: string;
  employeeId: string;
  employeeName: string;
  status: AttendanceStatus;
  overtimeHours: number;
  remarks?: string;
}

export interface SalarySlipRecord {
  id: string;
  slipNo: string; // e.g. SAL-2026-09-001
  month: string; // e.g. "September 2026"
  employeeId: string;
  employeeName: string;
  designation: string;
  phone: string;
  bloodGroup: string;
  address: string;
  totalDaysInMonth: number;
  presentDays: number;
  halfDays: number;
  absentDays: number;
  paidLeaveDays: number;
  overtimeHours: number;
  baseSalary: number;
  earnedSalary: number;
  overtimePay: number;
  allowances: number;
  advanceDeductions: number;
  providentFundDeductions: number;
  netSalary: number;
  paymentDate: string;
  paymentMode: 'Cash' | 'Bank Transfer' | 'Cheque';
  status: 'Paid' | 'Generated' | 'Pending';
  generatedBy: string;
}

export interface FeedStockSummary {
  feedTypeId: string;
  feedTypeName: string;
  openingBags: number;
  receivedBags: number;
  consumedBags: number;
  currentBags: number;
  totalWeightKg: number;
  standardRatePerBag: number;
  totalValuation: number;
  lowStockThresholdBags: number;
  isLowStock: boolean;
}

export type AlertType = 'LOW_FEED' | 'VACCINATION_DUE' | 'BATCH_CLOSING' | 'HIGH_MORTALITY' | 'HIGH_TEMP';

export interface FarmAlert {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  severity: 'warning' | 'critical' | 'info';
  date: string;
  relatedBatchNo?: string;
  relatedShedNo?: string;
  read: boolean;
}

export interface FarmSettings {
  farmName: string;
  subtitle: string;
  licenseNo: string;
  ownerName: string;
  phone: string;
  email: string;
  address: string;
  gstNumber: string;
  currencySymbol: string;
  feedLowStockThresholdBags: number;
  batchTargetDays: number;
  batchTargetWeightKg: number;
  mortalityAlertDailyPercent: number;
  sqlServerApiUrl: string;
  offlineSyncEnabled: boolean;
}
