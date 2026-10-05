import React, { useState, useMemo } from 'react';
import {
  FileSpreadsheet,
  Download,
  Printer,
  Share2,
  Calendar,
  Filter,
  Layers,
  ChevronDown,
  Building2,
  Search,
} from 'lucide-react';
import {
  Batch,
  Shed,
  BirdSaleRecord,
  DailyLogRecord,
  FeedStockEntry,
  ExpenseRecord,
  IncomeRecord,
  Customer,
  Supplier,
  Employee,
  SalarySlipRecord,
  FarmSettings,
} from '../../types';
import { formatCurrency, formatNumber, formatDate } from '../../utils/calculations';
import { exportToCSV, shareViaWhatsApp, triggerPrint } from '../../utils/export';

interface ReportCenterViewProps {
  batches: Batch[];
  sheds: Shed[];
  sales: BirdSaleRecord[];
  dailyLogs: DailyLogRecord[];
  feedPurchases: FeedStockEntry[];
  expenses: ExpenseRecord[];
  incomes: IncomeRecord[];
  customers: Customer[];
  suppliers: Supplier[];
  employees: Employee[];
  salarySlips: SalarySlipRecord[];
  settings: FarmSettings;
}

type ReportCategory =
  | 'CUSTOMER'
  | 'FEED'
  | 'INVENTORY'
  | 'HR'
  | 'FINANCE'
  | 'PROFIT'
  | 'BUSINESS'
  | 'SALES'
  | 'PURCHASE'
  | 'TAX_GST'
  | 'BATCH_WISE';

interface ReportTypeOption {
  id: string;
  category: ReportCategory;
  name: string;
}

const ALL_REPORT_OPTIONS: ReportTypeOption[] = [
  // Customer
  { id: 'cust_sales', category: 'CUSTOMER', name: 'Customer Sales Report' },
  { id: 'cust_outstanding', category: 'CUSTOMER', name: 'Customer Outstanding & Ageing Report' },
  { id: 'cust_ledger', category: 'CUSTOMER', name: 'Customer Ledger Statement' },
  { id: 'cust_master', category: 'CUSTOMER', name: 'Customer Master Directory' },
  // Feed
  { id: 'feed_daily', category: 'FEED', name: 'Daily Feed Consumption Report' },
  { id: 'feed_monthly', category: 'FEED', name: 'Monthly Feed Intake & FCR Analysis' },
  { id: 'feed_shed_wise', category: 'FEED', name: 'Shed-wise Feed Distribution Report' },
  // Inventory
  { id: 'inv_current', category: 'INVENTORY', name: 'Current Feed Stock Valuation Report' },
  { id: 'inv_movement', category: 'INVENTORY', name: 'Stock Movement & Ledger Report' },
  { id: 'inv_low_stock', category: 'INVENTORY', name: 'Low Stock & Reorder Report' },
  // HR
  { id: 'hr_salary', category: 'HR', name: 'Monthly Salary Disbursement Report' },
  { id: 'hr_attendance', category: 'HR', name: 'Staff Attendance & Overtime Register' },
  { id: 'hr_master', category: 'HR', name: 'Employee Master Register' },
  // Finance
  { id: 'fin_pnl', category: 'FINANCE', name: 'Batch & Farm Profit and Loss Report' },
  { id: 'fin_expenses', category: 'FINANCE', name: 'Expense Category Ledger Report' },
  { id: 'fin_cash_book', category: 'FINANCE', name: 'Cash Book & Bank Book Register' },
  { id: 'fin_receivable_payable', category: 'FINANCE', name: 'Receivables & Payables Balance Sheet' },
  // Profit
  { id: 'prof_gross_margin', category: 'PROFIT', name: 'Gross Margin & Live Weight Yield Report' },
  { id: 'prof_sales_purchase', category: 'PROFIT', name: 'Sales vs Feed/Chick Purchase Analysis' },
  // Business
  { id: 'biz_summary', category: 'BUSINESS', name: 'Daily & Weekly Farm Operations Summary' },
  { id: 'biz_performance', category: 'BUSINESS', name: 'EPEF & Flock Performance Evaluation' },
  // Sales
  { id: 'sales_register', category: 'SALES', name: 'Bird Sales Daily Register' },
  { id: 'sales_customer_wise', category: 'SALES', name: 'Customer-wise Sales Volume Report' },
  // Purchase
  { id: 'purch_feed', category: 'PURCHASE', name: 'Feed Purchase Register' },
  { id: 'purch_supplier_wise', category: 'PURCHASE', name: 'Supplier-wise Purchases & Outstandings' },
  // Tax / GST
  { id: 'tax_gst_sales', category: 'TAX_GST', name: 'GST Sales & Taxable Invoice Report' },
  { id: 'tax_gst_purchases', category: 'TAX_GST', name: 'GST Purchase & Inward Supply Register' },
  // Batch Wise
  { id: 'batch_closing_comp', category: 'BATCH_WISE', name: 'Batch-wise Comprehensive Efficiency Report' },
];

export const ReportCenterView: React.FC<ReportCenterViewProps> = ({
  batches,
  sheds,
  sales,
  dailyLogs,
  feedPurchases,
  expenses,
  incomes,
  customers,
  suppliers,
  employees,
  salarySlips,
  settings,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ReportCategory>('SALES');
  const [selectedReportId, setSelectedReportId] = useState('sales_register');

  // Filters
  const [fromDate, setFromDate] = useState('2026-08-01');
  const [toDate, setToDate] = useState(new Date().toISOString().slice(0, 10));
  const [selectedBatchFilter, setSelectedBatchFilter] = useState('ALL');
  const [selectedShedFilter, setSelectedShedFilter] = useState('ALL');

  const availableReports = useMemo(() => {
    return ALL_REPORT_OPTIONS.filter((r) => r.category === selectedCategory);
  }, [selectedCategory]);

  // Generate Report Table Data dynamically
  const reportData = useMemo(() => {
    // 1. Sales Register
    if (selectedReportId === 'sales_register' || selectedReportId === 'tax_gst_sales') {
      let filtered = sales.filter((s) => s.date >= fromDate && s.date <= toDate);
      if (selectedBatchFilter !== 'ALL') {
        filtered = filtered.filter((s) => s.batchNo === selectedBatchFilter);
      }
      const headers = ['Invoice No', 'Date', 'Customer', 'Batch / Shed', 'Birds', 'Net Wt (kg)', 'Rate (₹)', 'Total Amount (₹)', 'Balance Due (₹)'];
      const rows = filtered.map((s) => [
        s.invoiceNo,
        formatDate(s.date),
        s.customerName,
        `${s.batchNo} (${s.shedNo})`,
        s.birdsCount,
        s.netWeightKg,
        s.ratePerKg,
        s.finalAmount,
        s.balanceAmount,
      ]);
      const totalAmount = filtered.reduce((sum, s) => sum + s.finalAmount, 0);
      const totalWeight = filtered.reduce((sum, s) => sum + s.netWeightKg, 0);
      const totalBirds = filtered.reduce((sum, s) => sum + s.birdsCount, 0);
      const totalBalance = filtered.reduce((sum, s) => sum + s.balanceAmount, 0);

      return {
        title: 'Bird Sales Register',
        headers,
        rows,
        summary: `Total Birds: ${totalBirds.toLocaleString()} · Total Weight: ${totalWeight.toLocaleString()} kg · Total Sales: ${formatCurrency(totalAmount)} · Due: ${formatCurrency(totalBalance)}`,
        rawTotals: { totalAmount, totalWeight, totalBirds },
      };
    }

    // 2. Daily Feed Consumption
    if (selectedReportId === 'feed_daily' || selectedReportId === 'feed_monthly') {
      let filtered = dailyLogs.filter((l) => l.date >= fromDate && l.date <= toDate);
      if (selectedBatchFilter !== 'ALL') {
        filtered = filtered.filter((l) => l.batchNo === selectedBatchFilter);
      }
      const headers = ['Date', 'Batch / Shed', 'Flock Age', 'Mortality', 'Feed Type', 'Bags Consumed', 'Kg Consumed', 'Water (L)', 'Bird Wt (g)'];
      const rows = filtered.map((l) => [
        formatDate(l.date),
        `${l.batchNo} (${l.shedNo})`,
        `Day ${l.birdAgeDays}`,
        l.mortalityCount,
        l.feedType,
        l.feedConsumedBags,
        l.feedConsumedKg,
        l.waterConsumedLiters,
        l.averageBirdWeightGrams,
      ]);
      const totalBags = filtered.reduce((sum, l) => sum + l.feedConsumedBags, 0);
      const totalKg = filtered.reduce((sum, l) => sum + l.feedConsumedKg, 0);
      const totalMort = filtered.reduce((sum, l) => sum + l.mortalityCount, 0);

      return {
        title: 'Daily Feed Consumption & Mortality',
        headers,
        rows,
        summary: `Total Records: ${filtered.length} · Mortality: ${totalMort} birds · Feed Consumed: ${totalBags} bags (${totalKg.toLocaleString()} kg)`,
      };
    }

    // 3. Customer Outstanding & Ledger
    if (selectedReportId === 'cust_outstanding' || selectedReportId === 'cust_sales' || selectedReportId === 'cust_ledger') {
      const headers = ['Customer Name', 'Business / Firm', 'City', 'Phone', 'Total Purchased (₹)', 'Total Paid (₹)', 'Balance Due (₹)', 'Credit Limit (₹)'];
      const rows = customers.map((c) => [
        c.name,
        c.businessName,
        c.city,
        c.phone,
        c.totalPurchasedAmount,
        c.totalPaidAmount,
        c.currentBalance,
        c.creditLimit,
      ]);
      const totalOutstanding = customers.reduce((sum, c) => sum + c.currentBalance, 0);
      const totalSales = customers.reduce((sum, c) => sum + c.totalPurchasedAmount, 0);

      return {
        title: 'Customer Ledger & Outstanding Balance Statement',
        headers,
        rows,
        summary: `Total Buyers: ${customers.length} · Total Sales: ${formatCurrency(totalSales)} · Total Outstanding: ${formatCurrency(totalOutstanding)}`,
      };
    }

    // 4. Batch Comprehensive Report
    if (selectedCategory === 'BATCH_WISE' || selectedReportId === 'batch_closing_comp' || selectedReportId === 'fin_pnl') {
      let bList = batches;
      if (selectedBatchFilter !== 'ALL') {
        bList = batches.filter((b) => b.batchNo === selectedBatchFilter);
      }
      const headers = ['Batch No', 'EC Shed', 'Breed', 'Status', 'Placed Birds', 'Live Birds', 'Avg Wt (kg)', 'Feed kg', 'FCR', 'Mortality %'];
      const rows = bList.map((b) => [
        b.batchNo,
        b.shedNo,
        b.birdBreed,
        b.status,
        b.initialChicks,
        b.currentLiveBirds,
        b.averageWeightKg,
        b.totalFeedConsumedKg,
        b.currentFcr || b.closingData?.fcr || '-',
        b.status === 'Closed' ? `${b.closingData?.mortalityPercent}%` : `${((b.totalMortality / b.initialChicks) * 100).toFixed(2)}%`,
      ]);

      return {
        title: 'Flock Cycle & Production Performance Register',
        headers,
        rows,
        summary: `Batches Tracked: ${bList.length} · Running: ${bList.filter((b) => b.status === 'Running').length} · Closed: ${bList.filter((b) => b.status === 'Closed').length}`,
      };
    }

    // 5. Default: Financial Expenses
    const headers = ['Date', 'Category', 'Paid To', 'Voucher', 'Batch', 'Payment Mode', 'Amount (₹)'];
    const rows = expenses.map((e) => [
      formatDate(e.date),
      e.expenseCategory,
      e.paidTo,
      e.voucherNo,
      e.batchNo || 'Overhead',
      e.paymentMode,
      e.amount,
    ]);
    const totalExp = expenses.reduce((sum, e) => sum + e.amount, 0);

    return {
      title: 'Farm Operational Expenses Ledger',
      headers,
      rows,
      summary: `Total Vouchers: ${expenses.length} · Total Disbursed: ${formatCurrency(totalExp)}`,
    };
  }, [selectedReportId, selectedCategory, fromDate, toDate, selectedBatchFilter, sales, dailyLogs, customers, batches, expenses]);

  const handleExportCSV = () => {
    exportToCSV(`EC_Farm_Pro_${selectedReportId}`, reportData.headers, reportData.rows);
  };

  const handleShareReportWhatsApp = () => {
    const text = `*${settings.farmName} - REPORT EXCERPT*
Report: ${reportData.title}
Period: ${formatDate(fromDate)} to ${formatDate(toDate)}
Batch: ${selectedBatchFilter}
------------------------------------
${reportData.summary}
------------------------------------
Generated via EC Farm Pro Mobile App`;
    shareViaWhatsApp(text);
  };

  return (
    <div className="space-y-4 pb-20 select-none">
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-2 no-print">
        <div>
          <h1 className="text-base font-bold text-slate-900 leading-tight">Report Center</h1>
          <p className="text-xs text-slate-500">Official poultry analytics & audit exports</p>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleShareReportWhatsApp}
            className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white"
            title="Share Summary via WhatsApp"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={triggerPrint}
            className="p-2 rounded-xl bg-blue-700 hover:bg-blue-600 text-white"
            title="Print Report"
          >
            <Printer className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Excel / CSV</span>
          </button>
        </div>
      </div>

      {/* Category Pills Scroller */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs no-print">
        {[
          { id: 'SALES', label: 'Sales Reports' },
          { id: 'FEED', label: 'Feed Consumption' },
          { id: 'CUSTOMER', label: 'Customer Reports' },
          { id: 'INVENTORY', label: 'Inventory' },
          { id: 'FINANCE', label: 'Finance & P&L' },
          { id: 'BATCH_WISE', label: 'Batch Analytics' },
          { id: 'HR', label: 'HR & Payroll' },
          { id: 'PURCHASE', label: 'Purchases' },
          { id: 'TAX_GST', label: 'GST & Taxes' },
        ].map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => {
              setSelectedCategory(cat.id as ReportCategory);
              const firstOpt = ALL_REPORT_OPTIONS.find((r) => r.category === cat.id);
              if (firstOpt) setSelectedReportId(firstOpt.id);
            }}
            className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-[#0d2b45] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Specific Report Selector & Date Filters */}
      <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2.5 no-print text-xs">
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Select Report Type</label>
          <select
            value={selectedReportId}
            onChange={(e) => setSelectedReportId(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold text-slate-900"
          >
            {availableReports.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block font-medium text-slate-500 mb-0.5">From Date</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
            />
          </div>
          <div>
            <label className="block font-medium text-slate-500 mb-0.5">To Date</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
            />
          </div>
        </div>

        {/* Batch Filter Dropdown */}
        <div>
          <label className="block font-medium text-slate-500 mb-0.5">Filter by Batch</label>
          <select
            value={selectedBatchFilter}
            onChange={(e) => setSelectedBatchFilter(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold"
          >
            <option value="ALL">All Batches (Running & Closed)</option>
            {batches.map((b) => (
              <option key={b.id} value={b.batchNo}>
                {b.batchNo} ({b.shedNo} - {b.status})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Generated Report View Area */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs print-page space-y-3">
        {/* Printable Farm Header */}
        <div className="border-b border-slate-300 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/src/assets/images/ec_farm_pro_logo_1791187666008.jpg"
              alt="Logo"
              className="w-10 h-10 rounded-lg object-cover ring-1 ring-slate-200"
              referrerPolicy="no-referrer"
            />
            <div>
              <h2 className="font-bold text-sm text-[#0d2b45] uppercase">{settings.farmName}</h2>
              <p className="text-[10px] text-emerald-700 font-semibold uppercase">{settings.subtitle}</p>
              <h3 className="text-xs font-extrabold text-slate-900 mt-0.5">{reportData.title}</h3>
            </div>
          </div>
          <div className="text-right text-[10px] text-slate-500">
            <p>Period: {formatDate(fromDate)} to {formatDate(toDate)}</p>
            <p>Batch: {selectedBatchFilter}</p>
            <p className="font-semibold text-slate-700">Printed: {formatDate(new Date().toISOString())}</p>
          </div>
        </div>

        {/* Summary Metric Strip */}
        <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-100 text-xs font-semibold text-blue-950">
          {reportData.summary}
        </div>

        {/* Table View */}
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left border-collapse text-[11px]">
            <thead className="bg-slate-100 border-b border-slate-200 text-[10px] font-bold text-slate-700 uppercase">
              <tr>
                {reportData.headers.map((h, i) => (
                  <th key={i} className="py-2 px-2.5 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reportData.rows.length === 0 ? (
                <tr>
                  <td colSpan={reportData.headers.length} className="py-8 text-center text-slate-400">
                    No data found for the selected filters.
                  </td>
                </tr>
              ) : (
                reportData.rows.map((row, rowIdx) => (
                  <tr key={rowIdx} className="hover:bg-slate-50">
                    {row.map((val, cellIdx) => (
                      <td key={cellIdx} className="py-2 px-2.5 whitespace-nowrap text-slate-800">
                        {typeof val === 'number' && val > 1000 && !reportData.headers[cellIdx].toLowerCase().includes('age') && !reportData.headers[cellIdx].toLowerCase().includes('flock')
                          ? formatNumber(val)
                          : val}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="text-[10px] text-slate-400 pt-2 flex items-center justify-between border-t border-slate-200">
          <span>EC FARM PRO · Automated SQL-Compatible Reporting</span>
          <span>East Godavari, AP, India</span>
        </div>
      </div>
    </div>
  );
};
