import React from 'react';
import { X, Printer, Share2, MessageSquare, Download } from 'lucide-react';
import { SalarySlipRecord, FarmSettings } from '../../types';
import { formatCurrency, formatDate } from '../../utils/calculations';
import { shareViaWhatsApp, triggerPrint } from '../../utils/export';

interface PrintSalarySlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  slip: SalarySlipRecord | null;
  settings: FarmSettings;
}

export const PrintSalarySlipModal: React.FC<PrintSalarySlipModalProps> = ({
  isOpen,
  onClose,
  slip,
  settings,
}) => {
  if (!isOpen || !slip) return null;

  const handleWhatsApp = () => {
    const text = `*${settings.farmName} - PAYROLL SALARY SLIP*
${settings.subtitle}
---------------------------------
Slip No: ${slip.slipNo}
Month: ${slip.month}
Employee: ${slip.employeeName} (${slip.designation})
Days Worked: ${slip.presentDays} Days (OT: ${slip.overtimeHours} hrs)
---------------------------------
Base Salary: ${formatCurrency(slip.baseSalary)}
Earned Salary: ${formatCurrency(slip.earnedSalary)}
Overtime Pay: ${formatCurrency(slip.overtimePay)}
Allowances: ${formatCurrency(slip.allowances)}
Deductions (Adv/PF): ${formatCurrency(slip.advanceDeductions + slip.providentFundDeductions)}
---------------------------------
*NET SALARY PAID: ${formatCurrency(slip.netSalary)}*
Payment Date: ${formatDate(slip.paymentDate)}
Status: ${slip.status}
---------------------------------
Verified by EC Farm Pro System`;
    shareViaWhatsApp(text);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm select-none">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[92vh] border border-slate-200">
        {/* Action Toolbar */}
        <div className="bg-[#0d2b45] text-white p-3.5 flex items-center justify-between no-print">
          <div>
            <h3 className="font-bold text-sm text-white">Employee Salary Slip</h3>
            <p className="text-[10px] text-blue-200">{slip.slipNo} · {slip.month}</p>
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
              title="Print Salary Slip"
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

        {/* Printable Slip Content */}
        <div className="p-5 overflow-y-auto flex-1 bg-white print-page text-slate-900 text-xs">
          {/* Farm Header */}
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
                <p className="text-[10px] text-slate-500">GST: {settings.gstNumber} · Ph: {settings.phone}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block px-2.5 py-1 rounded bg-slate-900 text-white font-bold text-[10px] tracking-wider uppercase">
                SALARY SLIP
              </span>
              <p className="text-[10px] font-bold text-slate-700 mt-1">{slip.slipNo}</p>
              <p className="text-[10px] text-slate-500">{slip.month}</p>
            </div>
          </div>

          {/* Employee Details Box */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 mb-4 text-[11px]">
            <div>
              <p className="text-[10px] font-medium text-slate-500 uppercase">Employee Name</p>
              <p className="font-bold text-slate-900">{slip.employeeName}</p>
              <p className="text-[10px] font-medium text-slate-500 uppercase mt-2">Designation</p>
              <p className="font-semibold text-slate-800">{slip.designation}</p>
              <p className="text-[10px] font-medium text-slate-500 uppercase mt-2">Blood Group</p>
              <p className="font-semibold text-slate-800">{slip.bloodGroup || 'O+'}</p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-slate-500 uppercase">Contact Phone</p>
              <p className="font-semibold text-slate-800">{slip.phone}</p>
              <p className="text-[10px] font-medium text-slate-500 uppercase mt-2">Residential Address</p>
              <p className="text-slate-700 line-clamp-2">{slip.address}</p>
              <p className="text-[10px] font-medium text-slate-500 uppercase mt-2">Payment Mode</p>
              <p className="font-semibold text-emerald-700">{slip.paymentMode} ({slip.status})</p>
            </div>
          </div>

          {/* Attendance Breakdown */}
          <div className="mb-4">
            <h4 className="font-bold text-slate-800 text-[11px] mb-1.5 uppercase">Attendance Summary</h4>
            <div className="grid grid-cols-5 text-center gap-1.5 p-2 bg-blue-50/60 rounded-lg border border-blue-100 text-[10px]">
              <div>
                <p className="text-slate-500">Days in Month</p>
                <p className="font-bold text-slate-800 text-xs">{slip.totalDaysInMonth}</p>
              </div>
              <div>
                <p className="text-slate-500">Present Days</p>
                <p className="font-bold text-emerald-700 text-xs">{slip.presentDays}</p>
              </div>
              <div>
                <p className="text-slate-500">Paid Leaves</p>
                <p className="font-bold text-blue-700 text-xs">{slip.paidLeaveDays}</p>
              </div>
              <div>
                <p className="text-slate-500">Absences</p>
                <p className="font-bold text-rose-700 text-xs">{slip.absentDays}</p>
              </div>
              <div>
                <p className="text-slate-500">Overtime Hrs</p>
                <p className="font-bold text-slate-800 text-xs">{slip.overtimeHours} hrs</p>
              </div>
            </div>
          </div>

          {/* Earnings & Deductions Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden mb-4">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-[10px] text-slate-600 font-bold uppercase">
                  <th className="py-2 px-3">Earnings Description</th>
                  <th className="py-2 px-3 text-right">Amount (₹)</th>
                  <th className="py-2 px-3 border-l border-slate-200">Deductions</th>
                  <th className="py-2 px-3 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[11px]">
                <tr>
                  <td className="py-2 px-3 font-medium">Basic Earned Salary</td>
                  <td className="py-2 px-3 text-right tabular-nums">{formatCurrency(slip.earnedSalary)}</td>
                  <td className="py-2 px-3 border-l border-slate-200">Advance Deductions</td>
                  <td className="py-2 px-3 text-right tabular-nums">{formatCurrency(slip.advanceDeductions)}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">Overtime Allowance</td>
                  <td className="py-2 px-3 text-right tabular-nums">{formatCurrency(slip.overtimePay)}</td>
                  <td className="py-2 px-3 border-l border-slate-200">Provident Fund (PF)</td>
                  <td className="py-2 px-3 text-right tabular-nums">{formatCurrency(slip.providentFundDeductions)}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">Special Allowances / Bonus</td>
                  <td className="py-2 px-3 text-right tabular-nums">{formatCurrency(slip.allowances)}</td>
                  <td className="py-2 px-3 border-l border-slate-200">-</td>
                  <td className="py-2 px-3 text-right tabular-nums">₹0</td>
                </tr>
                <tr className="bg-slate-50 font-bold text-slate-900 border-t border-slate-200">
                  <td className="py-2.5 px-3">Gross Earnings</td>
                  <td className="py-2.5 px-3 text-right tabular-nums">
                    {formatCurrency(slip.earnedSalary + slip.overtimePay + slip.allowances)}
                  </td>
                  <td className="py-2.5 px-3 border-l border-slate-200">Total Deductions</td>
                  <td className="py-2.5 px-3 text-right text-rose-700 tabular-nums">
                    {formatCurrency(slip.advanceDeductions + slip.providentFundDeductions)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Net Salary Highlight & Verification */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0d2b45] text-white mb-6">
            <div>
              <p className="text-[10px] uppercase font-semibold text-emerald-300 tracking-wider">
                Net Take Home Salary
              </p>
              <p className="text-xl font-extrabold tracking-tight tabular-nums text-white">
                {formatCurrency(slip.netSalary)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-blue-200">Disbursed On: {formatDate(slip.paymentDate)}</p>
              <p className="text-[10px] font-semibold text-emerald-300">Payment Status: {slip.status}</p>
            </div>
          </div>

          {/* Verification QR Mock & Signatures */}
          <div className="flex items-end justify-between pt-4 border-t border-slate-200 text-[10px] text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-14 h-14 bg-slate-100 border border-slate-300 p-1 flex items-center justify-center text-center text-[8px] font-mono leading-tight">
                [QR CODE VERIFIED]
              </div>
              <div>
                <p className="font-semibold text-slate-700">Digital Verification</p>
                <p>Hash: {slip.id.toUpperCase()}</p>
                <p>Generated by: {slip.generatedBy}</p>
              </div>
            </div>
            <div className="text-center">
              <div className="w-32 border-b border-slate-400 mb-1" />
              <p className="font-semibold text-slate-800">Authorized Farm Signature</p>
              <p className="text-[9px]">{settings.ownerName}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
