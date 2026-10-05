import React, { useState } from 'react';
import {
  Boxes,
  Wheat,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  TrendingDown,
  Plus,
  Search,
  Filter,
  Download,
  Share2,
} from 'lucide-react';
import { FeedStockSummary, FeedStockEntry, DailyLogRecord, FarmSettings } from '../../types';
import { formatCurrency, formatNumber, formatDate } from '../../utils/calculations';
import { exportToCSV, shareViaWhatsApp } from '../../utils/export';

interface InventoryViewProps {
  feedStock: FeedStockSummary[];
  feedPurchases: FeedStockEntry[];
  dailyLogs: DailyLogRecord[];
  settings: FarmSettings;
  onOpenFeedEntryModal: () => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  feedStock,
  feedPurchases,
  dailyLogs,
  settings,
  onOpenFeedEntryModal,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'summary' | 'movements'>('summary');
  const [searchQuery, setSearchQuery] = useState('');

  const totalBags = feedStock.reduce((sum, f) => sum + f.currentBags, 0);
  const totalValuation = feedStock.reduce((sum, f) => sum + f.totalValuation, 0);
  const totalWeightKg = feedStock.reduce((sum, f) => sum + f.totalWeightKg, 0);
  const lowStockItems = feedStock.filter((f) => f.isLowStock);

  const handleExportStockCSV = () => {
    const headers = ['Feed Type', 'Opening Bags', 'Received Bags', 'Consumed Bags', 'Current Bags', 'Bag Wt (kg)', 'Total Kg', 'Rate/Bag (₹)', 'Valuation (₹)', 'Stock Status'];
    const rows = feedStock.map((f) => [
      f.feedTypeName,
      f.openingBags,
      f.receivedBags,
      f.consumedBags,
      f.currentBags,
      50,
      f.totalWeightKg,
      f.standardRatePerBag,
      f.totalValuation,
      f.isLowStock ? 'LOW STOCK' : 'Adequate',
    ]);
    exportToCSV('EC_Farm_Pro_Feed_Inventory', headers, rows);
  };

  const handleShareWhatsApp = () => {
    const text = `*${settings.farmName} - CURRENT FEED STOCK*
Date: ${new Date().toLocaleDateString('en-GB')}
------------------------------------
Total Feed in Store: ${totalBags} Bags (${totalWeightKg.toLocaleString()} kg)
Total Stock Valuation: ${formatCurrency(totalValuation)}
------------------------------------
${feedStock.map((f) => `• ${f.feedTypeName}: ${f.currentBags} bags (${f.totalWeightKg} kg) - ${formatCurrency(f.totalValuation)} ${f.isLowStock ? '⚠️ LOW' : ''}`).join('\n')}
------------------------------------
Low Stock Warning: ${lowStockItems.length} types require procurement.`;
    shareViaWhatsApp(text);
  };

  return (
    <div className="space-y-4 pb-20 select-none">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-base font-bold text-slate-900 leading-tight">Feed Stock & Inventory</h1>
          <p className="text-xs text-slate-500">Live store balance, consumption & reorder alerts</p>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white"
            title="Share Inventory on WhatsApp"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleExportStockCSV}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white"
            title="Export CSV"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onOpenFeedEntryModal}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 active:scale-95 text-white text-xs font-semibold shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Stock Entry</span>
          </button>
        </div>
      </div>

      {/* Overview Valuation Strip */}
      <div className="p-4 rounded-2xl bg-[#0d2b45] text-white shadow-sm space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider">
            Total Feed Store Valuation
          </span>
          <span className="text-xs font-bold text-slate-300">{totalWeightKg.toLocaleString()} kg</span>
        </div>
        <div className="flex items-baseline justify-between">
          <p className="text-2xl font-black tabular-nums tracking-tight">
            {formatCurrency(totalValuation)}
          </p>
          <span className="text-sm font-bold text-amber-400">
            {totalBags} <span className="text-xs font-medium text-slate-300">Bags (50kg)</span>
          </span>
        </div>
      </div>

      {/* Low Stock Warning Banner if applicable */}
      {lowStockItems.length > 0 && (
        <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-2.5">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <h4 className="font-bold text-amber-900">Low Stock Re-order Alert</h4>
            <p className="text-amber-800 text-[11px] mt-0.5 leading-snug">
              {lowStockItems.map((l) => `${l.feedTypeName} (${l.currentBags} bags left)`).join(', ')} is below the minimum reserve threshold of {settings.feedLowStockThresholdBags} bags.
            </p>
          </div>
        </div>
      )}

      {/* Subtabs: Summary vs Stock Movements */}
      <div className="flex p-1 bg-slate-200/70 rounded-xl text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveSubTab('summary')}
          className={`flex-1 py-1.5 rounded-lg transition-all ${
            activeSubTab === 'summary'
              ? 'bg-white text-slate-900 font-bold shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Stock Ledger ({feedStock.length} Types)
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('movements')}
          className={`flex-1 py-1.5 rounded-lg transition-all ${
            activeSubTab === 'movements'
              ? 'bg-white text-slate-900 font-bold shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Recent Receipts ({feedPurchases.length})
        </button>
      </div>

      {activeSubTab === 'summary' ? (
        <div className="space-y-3">
          {feedStock.map((item) => (
            <div
              key={item.feedTypeId}
              className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-900">{item.feedTypeName}</h3>
                  <span className="text-[11px] text-slate-500">
                    Standard Rate: ₹{item.standardRatePerBag} / 50kg bag
                  </span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.isLowStock
                      ? 'bg-rose-100 text-rose-800 border border-rose-300'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  }`}
                >
                  {item.isLowStock ? 'LOW STOCK' : 'IN STOCK'}
                </span>
              </div>

              {/* Math row: Opening + Received - Consumed = Current */}
              <div className="grid grid-cols-4 gap-1 p-2 bg-slate-50 rounded-xl text-center text-[10px]">
                <div>
                  <span className="text-slate-400 block uppercase">Opening</span>
                  <span className="text-xs font-bold text-slate-700 tabular-nums">
                    {item.openingBags}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase">Received</span>
                  <span className="text-xs font-bold text-emerald-700 tabular-nums">
                    +{item.receivedBags}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase">Consumed</span>
                  <span className="text-xs font-bold text-rose-600 tabular-nums">
                    -{item.consumedBags}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase">Balance</span>
                  <span className="text-xs font-extrabold text-[#0d2b45] tabular-nums">
                    {item.currentBags} bags
                  </span>
                </div>
              </div>

              {/* Weight & Valuation */}
              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                <span className="text-slate-500">
                  Total Weight: <strong className="text-slate-800">{item.totalWeightKg.toLocaleString()} kg</strong>
                </span>
                <span className="text-slate-500">
                  Valuation: <strong className="text-slate-900">{formatCurrency(item.totalValuation)}</strong>
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {feedPurchases.map((fp) => (
            <div
              key={fp.id}
              className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">{fp.feedTypeName}</span>
                <span className="text-xs font-bold text-emerald-700 tabular-nums">
                  +{fp.bagsCount} Bags ({fp.totalWeightKg} kg)
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-600">
                <span>Inv: <strong>{fp.invoiceNo}</strong> · {fp.supplierName}</span>
                <span>{formatDate(fp.date)}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                <span>Vehicle: {fp.vehicleNo}</span>
                <span className="font-semibold text-slate-800">{formatCurrency(fp.totalAmount)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
