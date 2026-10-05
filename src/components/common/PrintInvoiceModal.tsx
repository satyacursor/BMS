import React from 'react';
import { X, Printer, MessageSquare, Download, Scale } from 'lucide-react';
import { BirdSaleRecord, FarmSettings } from '../../types';
import { formatCurrency, formatDate } from '../../utils/calculations';
import { shareViaWhatsApp, triggerPrint } from '../../utils/export';

interface PrintInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  sale: BirdSaleRecord | null;
  settings: FarmSettings;
}

export const PrintInvoiceModal: React.FC<PrintInvoiceModalProps> = ({
  isOpen,
  onClose,
  sale,
  settings,
}) => {
  if (!isOpen || !sale) return null;

  const handleWhatsApp = () => {
    const text = `*${settings.farmName} - BIRD SALE INVOICE*
${settings.subtitle}
---------------------------------
Invoice No: ${sale.invoiceNo}
Date: ${formatDate(sale.date)}
Customer: ${sale.customerName}
Vehicle No: ${sale.vehicleNo || 'Direct Lift'}
Weighbridge Slip: ${sale.weighbridgeSlipNo || 'N/A'}
---------------------------------
Batch: ${sale.batchNo} (${sale.shedNo})
Birds Sold: ${sale.birdsCount.toLocaleString()} Birds
Gross Weight: ${sale.grossWeightKg.toLocaleString()} kg
Empty Cages Tare: ${sale.emptyCagesWeightKg.toLocaleString()} kg
*Net Live Weight: ${sale.netWeightKg.toLocaleString()} kg*
*Average Bird Weight: ${sale.averageWeightKg} kg*
*Rate: ₹${sale.ratePerKg} / kg*
---------------------------------
Total Sale Amount: ${formatCurrency(sale.totalAmount)}
Discount: ${formatCurrency(sale.discountAmount)}
*FINAL PAYABLE: ${formatCurrency(sale.finalAmount)}*
Payment Received: ${formatCurrency(sale.paymentReceived)} (${sale.paymentMode})
*BALANCE OUTSTANDING: ${formatCurrency(sale.balanceAmount)}*
---------------------------------
Thank you for your business!`;
    shareViaWhatsApp(text);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm select-none">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[92vh] border border-slate-200">
        {/* Action Toolbar */}
        <div className="bg-[#0d2b45] text-white p-3.5 flex items-center justify-between no-print">
          <div>
            <h3 className="font-bold text-sm text-white">Broiler Sale Weighbridge Invoice</h3>
            <p className="text-[10px] text-blue-200">{sale.invoiceNo} · {formatDate(sale.date)}</p>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleWhatsApp}
              className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1 text-xs font-semibold px-2"
              title="Share via WhatsApp"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>
            <button
              type="button"
              onClick={triggerPrint}
              className="p-1.5 rounded-lg bg-blue-700 hover:bg-blue-600 text-white flex items-center gap-1 text-xs font-semibold px-2"
              title="Print Invoice"
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

        {/* Printable Invoice Page */}
        <div className="p-5 overflow-y-auto flex-1 bg-white print-page text-slate-900 text-xs">
          {/* Header */}
          <div className="border-b-2 border-slate-800 pb-3 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/src/assets/images/ec_farm_pro_logo_1791187666008.jpg"
                alt="EC Farm Pro"
                className="w-12 h-12 rounded-lg object-cover ring-1 ring-slate-300"
                referrerPolicy="no-referrer"
              />
              <div>
                <h1 className="font-bold text-base tracking-tight text-[#0d2b45] uppercase">
                  {settings.farmName}
                </h1>
                <p className="text-[10px] font-semibold text-emerald-700 uppercase tracking-wider">
                  {settings.subtitle}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">{settings.address}</p>
                <p className="text-[10px] text-slate-500">GSTIN: {settings.gstNumber} · Ph: {settings.phone}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block px-2.5 py-1 rounded bg-[#0d2b45] text-white font-bold text-[10px] tracking-wider uppercase">
                SALE INVOICE
              </span>
              <p className="text-xs font-bold text-slate-900 mt-1">{sale.invoiceNo}</p>
              <p className="text-[10px] text-slate-500">Date: {formatDate(sale.date)}</p>
            </div>
          </div>

          {/* Billing & Batch Meta Box */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 mb-4 text-[11px]">
            <div>
              <p className="text-[10px] font-medium text-slate-500 uppercase">Customer / Buyer</p>
              <p className="font-bold text-slate-900">{sale.customerName}</p>
              <p className="text-[10px] text-slate-600 mt-0.5">Phone: {sale.customerPhone}</p>
              <p className="text-[10px] font-medium text-slate-500 uppercase mt-2">Vehicle & Driver</p>
              <p className="font-semibold text-slate-800">{sale.vehicleNo || 'Direct'} {sale.driverName ? `(${sale.driverName})` : ''}</p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-slate-500 uppercase">Batch & EC Shed</p>
              <p className="font-bold text-slate-900">{sale.batchNo} · {sale.shedNo}</p>
              <p className="text-[10px] font-medium text-slate-500 uppercase mt-2">Weighbridge Slip</p>
              <p className="font-semibold text-slate-800">{sale.weighbridgeSlipNo || 'WB-VERIFIED'}</p>
              <p className="text-[10px] font-medium text-slate-500 uppercase mt-2">Payment Mode</p>
              <p className="font-semibold text-emerald-700">{sale.paymentMode}</p>
            </div>
          </div>

          {/* Weighment Slip Breakdown */}
          <div className="mb-4">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Scale className="w-3.5 h-3.5 text-blue-800" />
              <h4 className="font-bold text-slate-800 text-[11px] uppercase">Weighbridge Data</h4>
            </div>
            <div className="grid grid-cols-4 text-center gap-1.5 p-2.5 bg-blue-50/60 rounded-xl border border-blue-100 text-[10px]">
              <div>
                <p className="text-slate-500 uppercase">Birds Lifted</p>
                <p className="font-bold text-slate-900 text-xs tabular-nums">{sale.birdsCount.toLocaleString()}</p>
                <p className="text-[9px] text-slate-400">In {sale.cagesCount} Cages</p>
              </div>
              <div>
                <p className="text-slate-500 uppercase">Gross Weight</p>
                <p className="font-bold text-slate-900 text-xs tabular-nums">{sale.grossWeightKg.toLocaleString()} kg</p>
                <p className="text-[9px] text-slate-400">Truck + Birds</p>
              </div>
              <div>
                <p className="text-slate-500 uppercase">Tare Weight</p>
                <p className="font-bold text-slate-900 text-xs tabular-nums">{sale.emptyCagesWeightKg.toLocaleString()} kg</p>
                <p className="text-[9px] text-slate-400">Empty Crates</p>
              </div>
              <div>
                <p className="text-slate-500 uppercase">Net Bird Wt</p>
                <p className="font-bold text-emerald-700 text-xs tabular-nums">{sale.netWeightKg.toLocaleString()} kg</p>
                <p className="text-[9px] font-semibold text-emerald-600">Avg: {sale.averageWeightKg} kg</p>
              </div>
            </div>
          </div>

          {/* Itemized Calculation Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden mb-4">
            <table className="w-full text-left border-collapse text-[11px]">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-[10px] text-slate-600 font-bold uppercase">
                  <th className="py-2 px-3">Description</th>
                  <th className="py-2 px-3 text-right">Net Weight (kg)</th>
                  <th className="py-2 px-3 text-right">Rate / kg</th>
                  <th className="py-2 px-3 text-right">Total (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-2.5 px-3">
                    <p className="font-bold text-slate-900">Live Commercial Broiler Chickens</p>
                    <p className="text-[10px] text-slate-500">{sale.batchNo} · {sale.birdsCount} live birds</p>
                  </td>
                  <td className="py-2.5 px-3 text-right font-semibold tabular-nums">{sale.netWeightKg.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-right font-semibold tabular-nums">₹{sale.ratePerKg.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-slate-900 tabular-nums">
                    {formatCurrency(sale.totalAmount)}
                  </td>
                </tr>
                {sale.discountAmount > 0 && (
                  <tr className="text-slate-500">
                    <td colSpan={3} className="py-1.5 px-3 text-right">Less Round-off / Trade Discount:</td>
                    <td className="py-1.5 px-3 text-right text-rose-600 tabular-nums">
                      - {formatCurrency(sale.discountAmount)}
                    </td>
                  </tr>
                )}
                <tr className="bg-slate-50 font-bold text-slate-900 border-t border-slate-200">
                  <td colSpan={3} className="py-2.5 px-3 text-right text-xs uppercase">Final Invoice Amount:</td>
                  <td className="py-2.5 px-3 text-right text-sm text-[#0d2b45] tabular-nums">
                    {formatCurrency(sale.finalAmount)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Payment & Balance Status */}
          <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between mb-6">
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-semibold">Payment Received</p>
              <p className="text-sm font-bold text-emerald-700 tabular-nums">
                {formatCurrency(sale.paymentReceived)}
              </p>
              <p className="text-[10px] text-slate-500">Via {sale.paymentMode}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-500 uppercase font-semibold">Balance Due</p>
              <p className={`text-sm font-bold tabular-nums ${sale.balanceAmount > 0 ? 'text-rose-600' : 'text-slate-800'}`}>
                {formatCurrency(sale.balanceAmount)}
              </p>
              <p className="text-[10px] text-slate-500">
                {sale.balanceAmount > 0 ? 'Recorded to Buyer Ledger' : 'Fully Cleared'}
              </p>
            </div>
          </div>

          {/* Signatures */}
          <div className="flex items-end justify-between pt-4 border-t border-slate-200 text-[10px] text-slate-500">
            <div>
              <div className="w-32 border-b border-slate-400 mb-1" />
              <p className="font-semibold text-slate-800">Buyer / Driver Signature</p>
              <p className="text-[9px]">{sale.customerName}</p>
            </div>
            <div className="text-right">
              <div className="w-32 border-b border-slate-400 mb-1 ml-auto" />
              <p className="font-semibold text-slate-800">Authorized Farm Officer</p>
              <p className="text-[9px]">{settings.farmName}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
