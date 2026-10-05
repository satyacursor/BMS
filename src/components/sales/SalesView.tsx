import React, { useState } from 'react';
import {
  Receipt,
  Plus,
  Scale,
  Printer,
  MessageSquare,
  Search,
  ChevronRight,
  X,
  CreditCard,
  User,
} from 'lucide-react';
import { BirdSaleRecord, Batch, Shed, Customer } from '../../types';
import { formatCurrency, formatNumber, formatDate } from '../../utils/calculations';

interface SalesViewProps {
  sales: BirdSaleRecord[];
  batches: Batch[];
  sheds: Shed[];
  customers: Customer[];
  onSaveBirdSale: (sale: BirdSaleRecord) => void;
  onOpenInvoiceModal: (sale: BirdSaleRecord) => void;
}

export const SalesView: React.FC<SalesViewProps> = ({
  sales,
  batches,
  sheds,
  customers,
  onSaveBirdSale,
  onOpenInvoiceModal,
}) => {
  const [showNewModal, setShowNewModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const runningBatches = batches.filter((b) => b.status === 'Running' || b.status === 'Closed');

  // Form State
  const [saleDate, setSaleDate] = useState(new Date().toISOString().slice(0, 10));
  const [invoiceNo, setInvoiceNo] = useState(`INV-${new Date().getFullYear()}-0${sales.length + 10}`);
  const [selectedBatchId, setSelectedBatchId] = useState(runningBatches[0]?.id || '');
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || '');
  const [birdsCount, setBirdsCount] = useState(4000);
  const [cagesCount, setCagesCount] = useState(200);
  const [emptyCagesWeightKg, setEmptyCagesWeightKg] = useState(1600); // 8kg per empty cage
  const [grossWeightKg, setGrossWeightKg] = useState(10400);
  const [ratePerKg, setRatePerKg] = useState(122.0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [paymentReceived, setPaymentReceived] = useState(1000000);
  const [paymentMode, setPaymentMode] = useState<BirdSaleRecord['paymentMode']>('Bank Transfer / NEFT');
  const [vehicleNo, setVehicleNo] = useState('AP 07 TE 4421');
  const [driverName, setDriverName] = useState('K. Subba Rao');
  const [weighbridgeSlipNo, setWeighbridgeSlipNo] = useState(`WB-${Math.floor(8000 + Math.random() * 1000)}`);
  const [notes, setNotes] = useState('First morning lifting batch');

  // Derived calculations
  const netWeightKg = Math.max(0, grossWeightKg - emptyCagesWeightKg);
  const avgBirdWeightKg = birdsCount > 0 ? Number((netWeightKg / birdsCount).toFixed(2)) : 0;
  const totalAmount = Math.round(netWeightKg * ratePerKg);
  const finalAmount = Math.max(0, totalAmount - discountAmount);
  const balanceAmount = Math.max(0, finalAmount - paymentReceived);

  const filteredSales = sales.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.invoiceNo.toLowerCase().includes(q) ||
      s.customerName.toLowerCase().includes(q) ||
      s.batchNo.toLowerCase().includes(q) ||
      s.vehicleNo.toLowerCase().includes(q)
    );
  });

  const handleSaleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const batch = batches.find((b) => b.id === selectedBatchId);
    const customer = customers.find((c) => c.id === selectedCustomerId);

    const sale: BirdSaleRecord = {
      id: `sale-${Date.now()}`,
      invoiceNo,
      date: saleDate,
      batchId: selectedBatchId,
      batchNo: batch ? batch.batchNo : 'B-2026-004',
      shedId: batch ? batch.shedId : 'shed-1',
      shedNo: batch ? batch.shedNo : 'EC Shed 01',
      customerId: selectedCustomerId,
      customerName: customer ? customer.name : 'Wholesale Buyer',
      customerPhone: customer ? customer.phone : '+91 98480 00000',
      birdsCount: Number(birdsCount),
      cagesCount: Number(cagesCount),
      emptyCagesWeightKg: Number(emptyCagesWeightKg),
      grossWeightKg: Number(grossWeightKg),
      netWeightKg,
      averageWeightKg: avgBirdWeightKg,
      ratePerKg: Number(ratePerKg),
      totalAmount,
      discountAmount: Number(discountAmount),
      finalAmount,
      paymentReceived: Number(paymentReceived),
      balanceAmount,
      paymentMode,
      vehicleNo,
      driverName,
      weighbridgeSlipNo,
      notes,
    };

    onSaveBirdSale(sale);
    setShowNewModal(false);
  };

  return (
    <div className="space-y-4 pb-20 select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-base font-bold text-slate-900 leading-tight">Bird Sales & Invoices</h1>
          <p className="text-xs text-slate-500">Weighbridge lifting slips & buyer billing</p>
        </div>
        <button
          type="button"
          onClick={() => setShowNewModal(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-semibold shadow-xs transition-transform"
        >
          <Plus className="w-4 h-4" />
          <span>New Bird Sale</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search invoice number, buyer or vehicle..."
          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-600 shadow-xs"
        />
      </div>

      {/* Sales List */}
      <div className="space-y-3">
        {filteredSales.map((sale) => (
          <div
            key={sale.id}
            className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-blue-400 transition-all space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">{sale.invoiceNo}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200">
                  {sale.batchNo}
                </span>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  sale.balanceAmount > 0
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {sale.balanceAmount > 0 ? `Due ${formatCurrency(sale.balanceAmount)}` : 'Cleared'}
              </span>
            </div>

            {/* Buyer & Date */}
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-800 truncate">{sale.customerName}</span>
              <span className="text-slate-400 shrink-0">{formatDate(sale.date)}</span>
            </div>

            {/* 4 Metric Boxes */}
            <div className="grid grid-cols-4 gap-1.5 p-2 bg-slate-50 rounded-xl text-center text-[10px]">
              <div>
                <span className="text-slate-400 block uppercase">Birds</span>
                <span className="text-xs font-bold text-slate-900 tabular-nums">
                  {sale.birdsCount.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase">Net Weight</span>
                <span className="text-xs font-bold text-slate-900 tabular-nums">
                  {sale.netWeightKg.toLocaleString()} kg
                </span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase">Avg Weight</span>
                <span className="text-xs font-bold text-blue-900 tabular-nums">
                  {sale.averageWeightKg} kg
                </span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase">Rate / kg</span>
                <span className="text-xs font-bold text-emerald-700 tabular-nums">
                  ₹{sale.ratePerKg}
                </span>
              </div>
            </div>

            {/* Total & Action to open invoice */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div>
                <span className="text-[10px] text-slate-400 block">Total Sale Valuation</span>
                <span className="text-sm font-bold text-slate-900 tabular-nums">
                  {formatCurrency(sale.finalAmount)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onOpenInvoiceModal(sale)}
                className="py-1.5 px-3 rounded-lg bg-[#0d2b45] hover:bg-blue-900 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Invoice / Slip</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: New Bird Sale */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-sm select-none no-print">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[92vh] border border-slate-200">
            <div className="bg-[#0d2b45] text-white p-3.5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-white">Record Bird Sale & Weighbridge</h3>
                <p className="text-[10px] text-blue-200">Gross weight, tare cages & buyer payment</p>
              </div>
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="p-1 rounded-lg text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaleSubmit} className="p-4 overflow-y-auto space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Invoice Number *</label>
                  <input
                    type="text"
                    required
                    value={invoiceNo}
                    onChange={(e) => setInvoiceNo(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={saleDate}
                    onChange={(e) => setSaleDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Select Batch *</label>
                  <select
                    value={selectedBatchId}
                    onChange={(e) => setSelectedBatchId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold"
                  >
                    {batches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.batchNo} ({b.shedNo})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Select Buyer / Customer *</label>
                  <select
                    value={selectedCustomerId}
                    onChange={(e) => setSelectedCustomerId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium"
                  >
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.city})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Weighbridge inputs */}
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 space-y-2.5">
                <div className="flex items-center gap-1.5 font-bold text-blue-900 text-[11px] uppercase">
                  <Scale className="w-3.5 h-3.5" />
                  <span>Weighbridge Measurement</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Birds Count</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={birdsCount}
                      onChange={(e) => setBirdsCount(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 font-bold tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Cages / Crates Count</label>
                    <input
                      type="number"
                      value={cagesCount}
                      onChange={(e) => setCagesCount(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 tabular-nums"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Gross Weight (kg)</label>
                    <input
                      type="number"
                      required
                      value={grossWeightKg}
                      onChange={(e) => setGrossWeightKg(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 font-bold tabular-nums text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Empty Tare Cages (kg)</label>
                    <input
                      type="number"
                      required
                      value={emptyCagesWeightKg}
                      onChange={(e) => setEmptyCagesWeightKg(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 tabular-nums"
                    />
                  </div>
                </div>

                {/* Live Net Weight Banner */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-100/70 border border-emerald-300 text-emerald-900 text-xs font-bold">
                  <span>Net Live Weight: {netWeightKg.toLocaleString()} kg</span>
                  <span>Avg: {avgBirdWeightKg} kg / bird</span>
                </div>
              </div>

              {/* Pricing & Billing */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Rate per kg (₹) *</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={ratePerKg}
                    onChange={(e) => setRatePerKg(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold tabular-nums text-blue-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Trade Discount (₹)</label>
                  <input
                    type="number"
                    value={discountAmount}
                    onChange={(e) => setDiscountAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 tabular-nums text-rose-600"
                  />
                </div>
              </div>

              {/* Net Billing & Payment Received */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-xs">Total Payable:</span>
                  <span className="font-extrabold text-slate-900 text-sm tabular-nums">
                    {formatCurrency(finalAmount)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Payment Received</label>
                    <input
                      type="number"
                      value={paymentReceived}
                      onChange={(e) => setPaymentReceived(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 font-bold text-emerald-700 tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Balance Outstanding</label>
                    <input
                      type="text"
                      readOnly
                      value={formatCurrency(balanceAmount)}
                      className={`w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-100 font-bold tabular-nums ${
                        balanceAmount > 0 ? 'text-rose-600' : 'text-slate-800'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Payment Mode</label>
                  <select
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value as BirdSaleRecord['paymentMode'])}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                  >
                    <option value="Bank Transfer / NEFT">Bank Transfer / NEFT</option>
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI Payment</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Credit">Credit (Full Outstanding)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Truck Vehicle No</label>
                  <input
                    type="text"
                    value={vehicleNo}
                    onChange={(e) => setVehicleNo(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Weighbridge Slip No</label>
                  <input
                    type="text"
                    value={weighbridgeSlipNo}
                    onChange={(e) => setWeighbridgeSlipNo(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm"
                >
                  Record Sale & Print Slip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
