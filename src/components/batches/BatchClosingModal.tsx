import React, { useState } from 'react';
import { X, Scale, Calculator, CheckCircle2, AlertTriangle, Printer, MessageSquare } from 'lucide-react';
import { Batch, BirdSaleRecord, DailyLogRecord, ExpenseRecord, BatchClosingData } from '../../types';
import { computeBatchClosing, formatCurrency, formatDate } from '../../utils/calculations';
import { shareViaWhatsApp, triggerPrint } from '../../utils/export';

interface BatchClosingModalProps {
  isOpen: boolean;
  onClose: () => void;
  batch: Batch | null;
  sales: BirdSaleRecord[];
  dailyLogs: DailyLogRecord[];
  expenses: ExpenseRecord[];
  onConfirmClose: (batchId: string, closingData: BatchClosingData) => void;
}

export const BatchClosingModal: React.FC<BatchClosingModalProps> = ({
  isOpen,
  onClose,
  batch,
  sales,
  dailyLogs,
  expenses,
  onConfirmClose,
}) => {
  if (!isOpen || !batch) return null;

  const [closingDate, setClosingDate] = useState(new Date().toISOString().slice(0, 10));
  const [remarks, setRemarks] = useState('Flock cycle concluded. Shed emptied and sanitized.');

  const batchSales = sales.filter((s) => s.batchId === batch.id);
  const batchLogs = dailyLogs.filter((l) => l.batchId === batch.id);
  const batchExpenses = expenses.filter((e) => e.batchId === batch.id);

  // Compute live calculations
  const closingData = computeBatchClosing(batch, batchSales, batchLogs, batchExpenses, closingDate, remarks);

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmClose(batch.id, closingData);
  };

  const handleWhatsAppShare = () => {
    const text = `*EC FARM PRO - BATCH CLOSING SUMMARY*
BOILER MANAGEMENT SYSTEM
-----------------------------------
Batch: ${batch.batchNo} (${batch.shedNo})
Breed: ${batch.birdBreed}
Closing Date: ${formatDate(closingDate)}
Placed Chicks: ${batch.initialChicks.toLocaleString()}
Total Mortality: ${closingData.totalMortality} (${closingData.mortalityPercent}%)
Birds Sold: ${closingData.finalBirdsSold.toLocaleString()}
Total Weight Sold: ${closingData.totalWeightSoldKg.toLocaleString()} kg
Average Bird Weight: ${closingData.averageWeightKg} kg
Average Rate: ₹${closingData.averageRatePerKg}/kg
-----------------------------------
*Total Feed Consumed: ${closingData.totalFeedConsumedKg.toLocaleString()} kg*
*FCR (Feed Conversion Ratio): ${closingData.fcr}*
*EPEF Efficiency Index: ${closingData.epef}*
-----------------------------------
*Total Revenue: ${formatCurrency(closingData.totalRevenue)}*
Chick Cost: ${formatCurrency(closingData.chickCost)}
Feed Cost: ${formatCurrency(closingData.feedCost)}
Medicine/Vaccine: ${formatCurrency(closingData.medicineVaccineCost)}
Electricity/Diesel: ${formatCurrency(closingData.dieselElectricityCost)}
Labour & Overheads: ${formatCurrency(closingData.labourCost + closingData.otherOverheads)}
*Total Production Cost: ${formatCurrency(closingData.totalExpenses)}*
-----------------------------------
*NET PROFIT / (LOSS): ${formatCurrency(closingData.netProfit)}*
Profit / Bird: ${formatCurrency(closingData.profitPerBird)}
Cost of Production: ₹${closingData.costPerKg}/kg
Profit / kg: ₹${closingData.profitPerKg}/kg
-----------------------------------
Status: Batch Closed Officially`;
    shareViaWhatsApp(text);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-sm select-none">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[92vh] border border-slate-200">
        {/* Header */}
        <div className="bg-[#0d2b45] text-white p-3.5 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/30 border border-emerald-400/40 flex items-center justify-center">
              <Scale className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Batch Closing & P&L Statement</h3>
              <p className="text-[10px] text-blue-200">{batch.batchNo} · {batch.shedNo}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1 text-xs font-semibold px-2"
              title="Share via WhatsApp"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
            <button
              type="button"
              onClick={triggerPrint}
              className="p-1.5 rounded-lg bg-blue-700 hover:bg-blue-600 text-white flex items-center gap-1 text-xs font-semibold px-2"
              title="Print Statement"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleFinalSubmit} className="p-4 overflow-y-auto flex-1 text-xs space-y-3.5 print-page">
          {/* Net Profit Banner */}
          <div
            className={`p-4 rounded-xl text-white flex items-center justify-between ${
              closingData.netProfit >= 0 ? 'bg-gradient-to-r from-emerald-800 to-teal-900' : 'bg-rose-900'
            }`}
          >
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-300 tracking-wider">
                Batch Net Profit / (Loss)
              </span>
              <p className="text-2xl font-extrabold tracking-tight tabular-nums">
                {formatCurrency(closingData.netProfit)}
              </p>
              <p className="text-[11px] text-blue-100 mt-0.5">
                Profit: ₹{closingData.profitPerBird} / bird · ₹{closingData.profitPerKg} / kg
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-emerald-200 block uppercase font-semibold">Efficiency Index</span>
              <span className="text-xl font-black tabular-nums">{closingData.epef} EPEF</span>
              <span className="text-[9px] text-emerald-300 block">FCR: {closingData.fcr}</span>
            </div>
          </div>

          {/* Biological Performance Grid */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-800 text-[11px] uppercase">
              Biological Performance Metrics
            </h4>
            <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
              <div className="p-1.5 rounded-lg bg-white border border-slate-200">
                <span className="text-slate-400 block uppercase">Birds Placed</span>
                <span className="font-bold text-slate-800 text-xs tabular-nums">
                  {batch.initialChicks.toLocaleString()}
                </span>
              </div>
              <div className="p-1.5 rounded-lg bg-white border border-slate-200">
                <span className="text-slate-400 block uppercase">Birds Sold</span>
                <span className="font-bold text-emerald-700 text-xs tabular-nums">
                  {closingData.finalBirdsSold.toLocaleString()}
                </span>
              </div>
              <div className="p-1.5 rounded-lg bg-white border border-slate-200">
                <span className="text-slate-400 block uppercase">Mortality</span>
                <span className="font-bold text-rose-600 text-xs tabular-nums">
                  {closingData.mortalityPercent}%
                </span>
              </div>
              <div className="p-1.5 rounded-lg bg-white border border-slate-200">
                <span className="text-slate-400 block uppercase">Avg Weight</span>
                <span className="font-bold text-blue-900 text-xs tabular-nums">
                  {closingData.averageWeightKg} kg
                </span>
              </div>
            </div>
          </div>

          {/* Financial Breakdown Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse text-[11px]">
              <thead className="bg-slate-100 text-[10px] text-slate-600 font-bold uppercase">
                <tr>
                  <th className="py-2 px-3">Financial Component</th>
                  <th className="py-2 px-3 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="bg-emerald-50/50 font-bold text-emerald-900">
                  <td className="py-2 px-3">Total Sales Revenue ({closingData.totalWeightSoldKg.toLocaleString()} kg @ ₹{closingData.averageRatePerKg})</td>
                  <td className="py-2 px-3 text-right tabular-nums">{formatCurrency(closingData.totalRevenue)}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-slate-700">Chick Cost ({batch.initialChicks} chicks @ ₹{batch.chickRate})</td>
                  <td className="py-2 px-3 text-right tabular-nums">{formatCurrency(closingData.chickCost)}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-slate-700">Feed Cost ({closingData.totalFeedConsumedKg.toLocaleString()} kg)</td>
                  <td className="py-2 px-3 text-right tabular-nums">{formatCurrency(closingData.feedCost)}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-slate-700">Medicines, Vaccines & Sanitizers</td>
                  <td className="py-2 px-3 text-right tabular-nums">{formatCurrency(closingData.medicineVaccineCost)}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-slate-700">Electricity, Gas & Generator Diesel</td>
                  <td className="py-2 px-3 text-right tabular-nums">{formatCurrency(closingData.dieselElectricityCost)}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-slate-700">Labour Wages & Farm Overheads</td>
                  <td className="py-2 px-3 text-right tabular-nums">{formatCurrency(closingData.labourCost + closingData.otherOverheads)}</td>
                </tr>
                <tr className="bg-slate-50 font-bold text-slate-900 border-t border-slate-200">
                  <td className="py-2 px-3 uppercase">Total Production Cost (₹{closingData.costPerKg}/kg):</td>
                  <td className="py-2 px-3 text-right tabular-nums text-rose-700">{formatCurrency(closingData.totalExpenses)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Form Inputs for official closure */}
          <div className="grid grid-cols-2 gap-2 no-print">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Official Closing Date</label>
              <input
                type="date"
                required
                value={closingDate}
                onChange={(e) => setClosingDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium text-slate-800"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Shed Clean Status</label>
              <input
                type="text"
                readOnly
                value="Moving to Cleaning / Sanitizing"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-slate-100 text-slate-600"
              />
            </div>
          </div>

          <div className="no-print">
            <label className="block font-semibold text-slate-700 mb-1">Remarks & Observations</label>
            <input
              type="text"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800"
            />
          </div>

          {/* Submit Actions */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200 no-print">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-600 rounded-lg shadow-sm flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm & Lock Batch Closure</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
