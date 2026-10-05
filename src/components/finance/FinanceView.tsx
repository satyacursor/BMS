import React, { useState } from 'react';
import {
  IndianRupee,
  Plus,
  TrendingUp,
  TrendingDown,
  ArrowDownLeft,
  ArrowUpRight,
  Wallet,
  Receipt,
  FileSpreadsheet,
  Download,
  Filter,
  X,
} from 'lucide-react';
import { ExpenseRecord, IncomeRecord, ExpenseCategory, Batch, Customer, Supplier, User } from '../../types';
import { formatCurrency, formatDate } from '../../utils/calculations';
import { exportToCSV } from '../../utils/export';

interface FinanceViewProps {
  expenses: ExpenseRecord[];
  incomes: IncomeRecord[];
  batches: Batch[];
  customers: Customer[];
  suppliers: Supplier[];
  currentUser: User;
  onSaveExpense: (expense: ExpenseRecord) => void;
  onSaveIncome: (income: IncomeRecord) => void;
}

export const FinanceView: React.FC<FinanceViewProps> = ({
  expenses,
  incomes,
  batches,
  customers,
  suppliers,
  currentUser,
  onSaveExpense,
  onSaveIncome,
}) => {
  const [activeTab, setActiveTab] = useState<'expenses' | 'incomes' | 'summary' | 'receivables-payables'>('summary');
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showIncomeModal, setShowIncomeModal] = useState(false);

  // New Expense State
  const [expCategory, setExpCategory] = useState<ExpenseCategory>('Generator Diesel');
  const [expAmount, setExpAmount] = useState(15000);
  const [expBatchId, setExpBatchId] = useState('');
  const [expPaidTo, setExpPaidTo] = useState('Local Vendor');
  const [expMode, setExpMode] = useState<ExpenseRecord['paymentMode']>('Bank Account');
  const [expVoucherNo, setExpVoucherNo] = useState(`V-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
  const [expDesc, setExpDesc] = useState('');

  // Total sums
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalIncomes = incomes.reduce((sum, i) => sum + i.amount, 0);
  const totalReceivables = customers.reduce((sum, c) => sum + c.currentBalance, 0);
  const totalPayables = suppliers.reduce((sum, s) => sum + s.currentBalance, 0);

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const batch = batches.find((b) => b.id === expBatchId);

    const expense: ExpenseRecord = {
      id: `exp-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      expenseCategory: expCategory,
      batchId: expBatchId || undefined,
      batchNo: batch ? batch.batchNo : undefined,
      amount: Number(expAmount),
      paidTo: expPaidTo,
      paymentMode: expMode,
      voucherNo: expVoucherNo,
      approvedBy: currentUser.name,
      description: expDesc || `${expCategory} expense voucher`,
    };

    onSaveExpense(expense);
    setShowExpenseModal(false);
  };

  const handleExportFinanceCSV = () => {
    const headers = ['Type', 'Date', 'Category / Details', 'Voucher / Rec No', 'Batch', 'Paid To / From', 'Payment Mode', 'Amount (₹)'];
    const rows: (string | number)[][] = [
      ...expenses.map((e) => ['Expense', formatDate(e.date), e.expenseCategory, e.voucherNo, e.batchNo || 'Overhead', e.paidTo, e.paymentMode, e.amount]),
      ...incomes.map((i) => ['Income', formatDate(i.date), i.incomeCategory, i.receiptNo, i.batchNo || 'General', i.receivedFrom, i.paymentMode, i.amount]),
    ];
    exportToCSV('EC_Farm_Pro_Financial_Ledger', headers, rows);
  };

  return (
    <div className="space-y-4 pb-20 select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-base font-bold text-slate-900 leading-tight">Finance & Accounts</h1>
          <p className="text-xs text-slate-500">Farm cash flow, expenses & balance sheet</p>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleExportFinanceCSV}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white"
            title="Export CSV"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setShowExpenseModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 active:scale-95 text-white text-xs font-semibold shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* KPI Cards: Receivables & Payables */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">
              Customer Receivables
            </span>
            <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl font-extrabold text-slate-900 tabular-nums">
            {formatCurrency(totalReceivables)}
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">Owed by {customers.filter((c) => c.currentBalance > 0).length} buyers</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase font-bold text-rose-700 tracking-wider">
              Supplier Payables
            </span>
            <ArrowUpRight className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-xl font-extrabold text-slate-900 tabular-nums">
            {formatCurrency(totalPayables)}
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">Due to {suppliers.filter((s) => s.currentBalance > 0).length} suppliers</p>
        </div>
      </div>

      {/* Subtabs */}
      <div className="flex p-1 bg-slate-200/70 rounded-xl text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('summary')}
          className={`flex-1 py-1.5 rounded-lg transition-all ${
            activeTab === 'summary'
              ? 'bg-white text-slate-900 font-bold shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          P&L Overview
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('expenses')}
          className={`flex-1 py-1.5 rounded-lg transition-all ${
            activeTab === 'expenses'
              ? 'bg-white text-slate-900 font-bold shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Expenses ({expenses.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('receivables-payables')}
          className={`flex-1 py-1.5 rounded-lg transition-all ${
            activeTab === 'receivables-payables'
              ? 'bg-white text-slate-900 font-bold shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Balances
        </button>
      </div>

      {/* TAB 1: P&L SUMMARY */}
      {activeTab === 'summary' && (
        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-[#0d2b45] text-white shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Farm Operating Profit & Loss Summary
            </h3>
            <div className="grid grid-cols-2 gap-3 pt-1 border-t border-blue-900">
              <div>
                <span className="text-[10px] text-blue-200 block uppercase">Total Vouchered Expenses</span>
                <span className="text-lg font-bold text-rose-300 tabular-nums">
                  {formatCurrency(totalExpenses)}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-blue-200 block uppercase">Other Non-Bird Income</span>
                <span className="text-lg font-bold text-emerald-300 tabular-nums">
                  {formatCurrency(totalIncomes)}
                </span>
              </div>
            </div>
          </div>

          {/* Category-wise Expenses Breakdown */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2.5">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-tight">
              Expense Categories Breakdown
            </h3>
            <div className="space-y-2 text-xs">
              {[
                'Electricity & EB Bill',
                'Generator Diesel',
                'Medicines & Sanitizers',
                'Rice Husk / Litter Material',
                'Labour & Wages',
                'Equipment & Maintenance',
              ].map((cat) => {
                const catExpenses = expenses
                  .filter((e) => e.expenseCategory === cat)
                  .reduce((sum, e) => sum + e.amount, 0);

                const pct = totalExpenses > 0 ? Math.round((catExpenses / totalExpenses) * 100) : 0;

                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-700 font-medium">{cat}</span>
                      <span className="font-bold text-slate-900 tabular-nums">
                        {formatCurrency(catExpenses)} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: EXPENSES LIST */}
      {activeTab === 'expenses' && (
        <div className="space-y-3">
          {expenses.map((exp) => (
            <div
              key={exp.id}
              className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">{exp.expenseCategory}</span>
                <span className="text-xs font-bold text-rose-600 tabular-nums">
                  {formatCurrency(exp.amount)}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 line-clamp-1">{exp.description}</p>
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                <span>Voucher: {exp.voucherNo} · {exp.paidTo}</span>
                <span>{formatDate(exp.date)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: RECEIVABLES & PAYABLES */}
      {activeTab === 'receivables-payables' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-tight px-1">
              Customer Outstanding Balances
            </h3>
            {customers.map((c) => (
              <div
                key={c.id}
                className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-bold text-slate-900">{c.name}</p>
                  <p className="text-[10px] text-slate-500">{c.city} · Ph: {c.phone}</p>
                </div>
                <div className="text-right">
                  <p className={`text-xs font-bold tabular-nums ${c.currentBalance > 0 ? 'text-emerald-700' : 'text-slate-500'}`}>
                    {formatCurrency(c.currentBalance)}
                  </p>
                  <p className="text-[9px] text-slate-400">Total: {formatCurrency(c.totalPurchasedAmount)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-tight px-1">
              Supplier Outstanding Balances
            </h3>
            {suppliers.map((s) => (
              <div
                key={s.id}
                className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-bold text-slate-900">{s.name}</p>
                  <p className="text-[10px] text-slate-500">{s.category}</p>
                </div>
                <div className="text-right">
                  <p className={`text-xs font-bold tabular-nums ${s.currentBalance > 0 ? 'text-rose-600' : 'text-slate-500'}`}>
                    {formatCurrency(s.currentBalance)}
                  </p>
                  <p className="text-[9px] text-slate-400">Total: {formatCurrency(s.totalPurchasedAmount)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: New Expense */}
      {showExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-sm select-none no-print">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[90vh] border border-slate-200">
            <div className="bg-[#0d2b45] text-white p-3.5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-white">Add Farm Expense Voucher</h3>
                <p className="text-[10px] text-blue-200">Diesel, electricity, husk, meds & wages</p>
              </div>
              <button
                type="button"
                onClick={() => setShowExpenseModal(false)}
                className="p-1 rounded-lg text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExpenseSubmit} className="p-4 overflow-y-auto space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Expense Category *</label>
                <select
                  value={expCategory}
                  onChange={(e) => setExpCategory(e.target.value as ExpenseCategory)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold text-slate-800"
                >
                  <option value="Generator Diesel">Generator Diesel</option>
                  <option value="Electricity & EB Bill">Electricity & EB Bill</option>
                  <option value="Gas Brooding / Heating">Gas Brooding / Heating</option>
                  <option value="Medicines & Sanitizers">Medicines & Sanitizers</option>
                  <option value="Rice Husk / Litter Material">Rice Husk / Litter Material</option>
                  <option value="Labour & Wages">Labour & Wages</option>
                  <option value="Equipment & Maintenance">Equipment & Maintenance</option>
                  <option value="Transport & Freight">Transport & Freight</option>
                  <option value="Farm Miscellaneous">Farm Miscellaneous</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={expAmount}
                    onChange={(e) => setExpAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold tabular-nums text-rose-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Paid To *</label>
                  <input
                    type="text"
                    required
                    value={expPaidTo}
                    onChange={(e) => setExpPaidTo(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Link to Batch (Optional)</label>
                  <select
                    value={expBatchId}
                    onChange={(e) => setExpBatchId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                  >
                    <option value="">General Farm Overhead</option>
                    {batches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.batchNo} ({b.shedNo})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Payment Mode</label>
                  <select
                    value={expMode}
                    onChange={(e) => setExpMode(e.target.value as ExpenseRecord['paymentMode'])}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                  >
                    <option value="Bank Account">Bank Account / NEFT</option>
                    <option value="UPI">UPI</option>
                    <option value="Cash">Cash</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description / Bill Notes</label>
                <textarea
                  rows={2}
                  value={expDesc}
                  onChange={(e) => setExpDesc(e.target.value)}
                  placeholder="Details of expense, bill number, quantity..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowExpenseModal(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded-lg shadow-sm"
                >
                  Save Expense Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
