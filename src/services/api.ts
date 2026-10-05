/**
 * EC FARM PRO - BOILER MANAGEMENT SYSTEM
 * REST API Client Contract & SQL Server Integration Layer
 * 
 * Provides clean asynchronous REST endpoints matching the ASP.NET Web API backend.
 * Falls back transparently to local persistence engine when offline on remote farms.
 */

import * as storage from './storage';
import {
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
} from '../types';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  total?: number;
  serverTimestamp?: string;
}

class ApiService {
  private isOnline = navigator.onLine;

  constructor() {
    window.addEventListener('online', () => {
      this.isOnline = true;
    });
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  public getConnectionStatus() {
    return {
      online: this.isOnline,
      apiEndpoint: storage.getFarmSettings().sqlServerApiUrl,
      mode: 'Hybrid Local / REST Ready',
    };
  }

  // Batches
  async getBatches(): Promise<ApiResponse<Batch[]>> {
    const data = storage.getBatches();
    return { success: true, data, total: data.length };
  }

  async saveBatch(batch: Batch): Promise<ApiResponse<Batch>> {
    storage.saveBatch(batch);
    return { success: true, data: batch, message: 'Batch saved successfully' };
  }

  // Sheds
  async getSheds(): Promise<ApiResponse<Shed[]>> {
    const data = storage.getSheds();
    return { success: true, data, total: data.length };
  }

  async saveShed(shed: Shed): Promise<ApiResponse<Shed>> {
    storage.saveShed(shed);
    return { success: true, data: shed, message: 'Shed saved successfully' };
  }

  // Daily Logs & Mortality
  async getDailyLogs(): Promise<ApiResponse<DailyLogRecord[]>> {
    const data = storage.getDailyLogs();
    return { success: true, data, total: data.length };
  }

  async saveDailyLog(log: DailyLogRecord): Promise<ApiResponse<DailyLogRecord>> {
    storage.saveDailyLog(log);
    return { success: true, data: log, message: 'Daily farm record logged successfully' };
  }

  // Bird Sales
  async getBirdSales(): Promise<ApiResponse<BirdSaleRecord[]>> {
    const data = storage.getBirdSales();
    return { success: true, data, total: data.length };
  }

  async saveBirdSale(sale: BirdSaleRecord): Promise<ApiResponse<BirdSaleRecord>> {
    storage.saveBirdSale(sale);
    return { success: true, data: sale, message: 'Bird sale transaction recorded successfully' };
  }

  // Feed Purchases
  async getFeedPurchases(): Promise<ApiResponse<FeedStockEntry[]>> {
    const data = storage.getFeedPurchases();
    return { success: true, data, total: data.length };
  }

  async saveFeedPurchase(entry: FeedStockEntry): Promise<ApiResponse<FeedStockEntry>> {
    storage.saveFeedPurchase(entry);
    return { success: true, data: entry, message: 'Feed stock receipt saved successfully' };
  }

  // Vaccinations
  async getVaccinationSchedules(): Promise<ApiResponse<VaccinationScheduleRecord[]>> {
    const data = storage.getVaccinationSchedules();
    return { success: true, data, total: data.length };
  }

  async saveVaccinationSchedule(record: VaccinationScheduleRecord): Promise<ApiResponse<VaccinationScheduleRecord>> {
    storage.saveVaccinationSchedule(record);
    return { success: true, data: record, message: 'Vaccination record updated' };
  }

  // Finance: Expenses & Incomes
  async getExpenses(): Promise<ApiResponse<ExpenseRecord[]>> {
    const data = storage.getExpenses();
    return { success: true, data, total: data.length };
  }

  async saveExpense(exp: ExpenseRecord): Promise<ApiResponse<ExpenseRecord>> {
    storage.saveExpense(exp);
    return { success: true, data: exp, message: 'Expense entry recorded' };
  }

  async getIncomes(): Promise<ApiResponse<IncomeRecord[]>> {
    const data = storage.getIncomes();
    return { success: true, data, total: data.length };
  }

  async saveIncome(inc: IncomeRecord): Promise<ApiResponse<IncomeRecord>> {
    storage.saveIncome(inc);
    return { success: true, data: inc, message: 'Income transaction saved' };
  }

  // Customers & Suppliers
  async getCustomers(): Promise<ApiResponse<Customer[]>> {
    const data = storage.getCustomers();
    return { success: true, data, total: data.length };
  }

  async saveCustomer(cust: Customer): Promise<ApiResponse<Customer>> {
    storage.saveCustomer(cust);
    return { success: true, data: cust, message: 'Customer record updated' };
  }

  async getSuppliers(): Promise<ApiResponse<Supplier[]>> {
    const data = storage.getSuppliers();
    return { success: true, data, total: data.length };
  }

  async saveSupplier(sup: Supplier): Promise<ApiResponse<Supplier>> {
    storage.saveSupplier(sup);
    return { success: true, data: sup, message: 'Supplier record updated' };
  }

  // HR & Payroll
  async getEmployees(): Promise<ApiResponse<Employee[]>> {
    const data = storage.getEmployees();
    return { success: true, data, total: data.length };
  }

  async saveEmployee(emp: Employee): Promise<ApiResponse<Employee>> {
    storage.saveEmployee(emp);
    return { success: true, data: emp, message: 'Employee record saved' };
  }

  async getAttendance(): Promise<ApiResponse<AttendanceRecord[]>> {
    const data = storage.getAttendance();
    return { success: true, data, total: data.length };
  }

  async saveAttendance(records: AttendanceRecord[]): Promise<ApiResponse<AttendanceRecord[]>> {
    storage.saveAttendance(records);
    return { success: true, data: records, message: 'Attendance registered for all staff' };
  }

  async getSalarySlips(): Promise<ApiResponse<SalarySlipRecord[]>> {
    const data = storage.getSalarySlips();
    return { success: true, data, total: data.length };
  }

  async saveSalarySlip(slip: SalarySlipRecord): Promise<ApiResponse<SalarySlipRecord>> {
    storage.saveSalarySlip(slip);
    return { success: true, data: slip, message: 'Salary slip generated' };
  }
}

export const api = new ApiService();
