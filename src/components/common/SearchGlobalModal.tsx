import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  Layers,
  Wheat,
  Receipt,
  Users,
  UserCheck,
  Wallet,
  Calendar,
  ChevronRight,
} from 'lucide-react';
import { Batch, DailyLogRecord, BirdSaleRecord, ExpenseRecord, Employee, Customer, FeedStockEntry } from '../../types';
import { formatCurrency, formatDate } from '../../utils/calculations';

interface SearchGlobalModalProps {
  isOpen: boolean;
  onClose: () => void;
  batches: Batch[];
  dailyLogs: DailyLogRecord[];
  sales: BirdSaleRecord[];
  expenses: ExpenseRecord[];
  employees: Employee[];
  customers: Customer[];
  feedPurchases: FeedStockEntry[];
  onSelectResult: (type: string, id: string) => void;
}

type SearchCategory = 'ALL' | 'BATCHES' | 'FEED' | 'SALES' | 'EXPENSES' | 'EMPLOYEES' | 'CUSTOMERS';

export const SearchGlobalModal: React.FC<SearchGlobalModalProps> = ({
  isOpen,
  onClose,
  batches,
  dailyLogs,
  sales,
  expenses,
  employees,
  customers,
  feedPurchases,
  onSelectResult,
}) => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<SearchCategory>('ALL');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const items: Array<{
      id: string;
      type: string;
      category: SearchCategory;
      title: string;
      subtitle: string;
      meta: string;
      badge?: string;
    }> = [];

    // Batches
    if (category === 'ALL' || category === 'BATCHES') {
      batches.forEach((b) => {
        if (
          b.batchNo.toLowerCase().includes(q) ||
          b.shedNo.toLowerCase().includes(q) ||
          b.birdBreed.toLowerCase().includes(q) ||
          b.supplierName.toLowerCase().includes(q)
        ) {
          items.push({
            id: b.id,
            type: 'batch',
            category: 'BATCHES',
            title: `${b.batchNo} (${b.shedNo})`,
            subtitle: `${b.birdBreed} · ${b.currentLiveBirds.toLocaleString()} live birds · Age ${b.currentAgeDays}d`,
            meta: `Placed: ${formatDate(b.placementDate)}`,
            badge: b.status,
          });
        }
      });
    }

    // Bird Sales
    if (category === 'ALL' || category === 'SALES') {
      sales.forEach((s) => {
        if (
          s.invoiceNo.toLowerCase().includes(q) ||
          s.customerName.toLowerCase().includes(q) ||
          s.batchNo.toLowerCase().includes(q) ||
          s.vehicleNo.toLowerCase().includes(q)
        ) {
          items.push({
            id: s.id,
            type: 'sale',
            category: 'SALES',
            title: `Invoice ${s.invoiceNo} - ${s.customerName}`,
            subtitle: `${s.birdsCount} birds · ${s.netWeightKg} kg @ ₹${s.ratePerKg}/kg`,
            meta: `${formatDate(s.date)} · ${formatCurrency(s.finalAmount)}`,
            badge: s.balanceAmount > 0 ? `Due ${formatCurrency(s.balanceAmount)}` : 'Cleared',
          });
        }
      });
    }

    // Feed Entries
    if (category === 'ALL' || category === 'FEED') {
      feedPurchases.forEach((f) => {
        if (
          f.feedTypeName.toLowerCase().includes(q) ||
          f.invoiceNo.toLowerCase().includes(q) ||
          f.supplierName.toLowerCase().includes(q)
        ) {
          items.push({
            id: f.id,
            type: 'feed',
            category: 'FEED',
            title: `${f.feedTypeName} (${f.bagsCount} bags)`,
            subtitle: `Inv ${f.invoiceNo} · Supplier: ${f.supplierName}`,
            meta: `${formatDate(f.date)} · ${formatCurrency(f.totalAmount)}`,
            badge: `${f.totalWeightKg} kg`,
          });
        }
      });
    }

    // Expenses
    if (category === 'ALL' || category === 'EXPENSES') {
      expenses.forEach((e) => {
        if (
          e.expenseCategory.toLowerCase().includes(q) ||
          e.paidTo.toLowerCase().includes(q) ||
          e.voucherNo.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q)
        ) {
          items.push({
            id: e.id,
            type: 'expense',
            category: 'EXPENSES',
            title: `${e.expenseCategory} - ${formatCurrency(e.amount)}`,
            subtitle: `Paid to: ${e.paidTo} (${e.voucherNo})`,
            meta: `${formatDate(e.date)} · Mode: ${e.paymentMode}`,
            badge: e.batchNo || 'Overhead',
          });
        }
      });
    }

    // Employees
    if (category === 'ALL' || category === 'EMPLOYEES') {
      employees.forEach((emp) => {
        if (
          emp.name.toLowerCase().includes(q) ||
          emp.empId.toLowerCase().includes(q) ||
          emp.designation.toLowerCase().includes(q) ||
          emp.phone.toLowerCase().includes(q)
        ) {
          items.push({
            id: emp.id,
            type: 'employee',
            category: 'EMPLOYEES',
            title: `${emp.name} (${emp.empId})`,
            subtitle: `${emp.designation} · Ph: ${emp.phone}`,
            meta: `Joined: ${formatDate(emp.joinedDate)} · ${formatCurrency(emp.monthlySalary)}/mo`,
            badge: emp.bloodGroup,
          });
        }
      });
    }

    // Customers
    if (category === 'ALL' || category === 'CUSTOMERS') {
      customers.forEach((c) => {
        if (
          c.name.toLowerCase().includes(q) ||
          c.businessName.toLowerCase().includes(q) ||
          c.phone.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q)
        ) {
          items.push({
            id: c.id,
            type: 'customer',
            category: 'CUSTOMERS',
            title: c.name,
            subtitle: `${c.businessName} · ${c.city} · ${c.phone}`,
            meta: `Purchases: ${formatCurrency(c.totalPurchasedAmount)}`,
            badge: c.currentBalance > 0 ? `Balance ${formatCurrency(c.currentBalance)}` : 'Zero Due',
          });
        }
      });
    }

    return items;
  }, [query, category, batches, sales, feedPurchases, expenses, employees, customers]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm select-none no-print">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl mt-4 max-h-[85vh] flex flex-col border border-slate-200">
        {/* Search Input Bar */}
        <div className="p-3 bg-[#0d2b45] flex items-center gap-2">
          <Search className="w-5 h-5 text-emerald-400 shrink-0 ml-1" />
          <input
            type="search"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search batches, sheds, sales, feed, staff, expenses..."
            className="w-full bg-transparent text-white placeholder:text-blue-200 text-sm focus:outline-hidden"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-blue-200 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categories Bar */}
        <div className="flex gap-1.5 p-2 bg-slate-100 overflow-x-auto text-xs border-b border-slate-200">
          {(['ALL', 'BATCHES', 'SALES', 'FEED', 'EXPENSES', 'EMPLOYEES', 'CUSTOMERS'] as SearchCategory[]).map(
            (cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  category === cat
                    ? 'bg-[#0d2b45] text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            )
          )}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {!query.trim() ? (
            <div className="text-center py-10 text-slate-400">
              <Search className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-xs font-semibold text-slate-600">Unified EC Farm Pro Search</p>
              <p className="text-[11px]">Type batch number (e.g. B-2026), buyer, phone, shed or expense</p>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              <p className="text-xs font-semibold text-slate-600">No records found for "{query}"</p>
              <p className="text-[11px]">Check spelling or switch filter category</p>
            </div>
          ) : (
            results.map((item) => (
              <button
                key={`${item.type}-${item.id}`}
                type="button"
                onClick={() => {
                  onSelectResult(item.type, item.id);
                  onClose();
                }}
                className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-blue-400 bg-white hover:bg-blue-50/40 transition-all flex items-center justify-between gap-3 shadow-xs"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-bold text-slate-900 truncate">{item.title}</span>
                    {item.badge && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 shrink-0">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 truncate">{item.subtitle}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{item.meta}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
