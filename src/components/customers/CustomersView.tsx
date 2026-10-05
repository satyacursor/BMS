import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Phone,
  MapPin,
  TrendingUp,
  FileText,
  X,
  CreditCard,
  Printer,
  MessageSquare,
} from 'lucide-react';
import { Customer, BirdSaleRecord, FarmSettings } from '../../types';
import { formatCurrency, formatDate } from '../../utils/calculations';
import { shareViaWhatsApp, triggerPrint } from '../../utils/export';

interface CustomersViewProps {
  customers: Customer[];
  sales: BirdSaleRecord[];
  settings: FarmSettings;
  onSaveCustomer: (customer: Customer) => void;
  onOpenSaleModal?: () => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({
  customers,
  sales,
  settings,
  onSaveCustomer,
  onOpenSaleModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showStatementModal, setShowStatementModal] = useState(false);

  // New Customer Form State
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [type, setType] = useState<Customer['type']>('Wholesaler');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [creditLimit, setCreditLimit] = useState(500000);
  const [openingBalance, setOpeningBalance] = useState(0);

  const filteredCustomers = customers.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.businessName.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q)
    );
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCust: Customer = {
      id: `cust-${Date.now()}`,
      name,
      businessName,
      type,
      phone,
      address,
      city,
      creditLimit: Number(creditLimit),
      openingBalance: Number(openingBalance),
      currentBalance: Number(openingBalance),
      totalPurchasedAmount: 0,
      totalPaidAmount: 0,
      active: true,
    };
    onSaveCustomer(newCust);
    setShowAddModal(false);
  };

  const handleOpenStatement = (c: Customer) => {
    setSelectedCustomer(c);
    setShowStatementModal(true);
  };

  const customerSales = selectedCustomer
    ? sales.filter((s) => s.customerId === selectedCustomer.id)
    : [];

  const handleStatementWhatsApp = () => {
    if (!selectedCustomer) return;
    const text = `*${settings.farmName} - CUSTOMER STATEMENT*
Buyer: ${selectedCustomer.name} (${selectedCustomer.businessName})
Phone: ${selectedCustomer.phone} · City: ${selectedCustomer.city}
Date: ${new Date().toLocaleDateString('en-GB')}
------------------------------------
Total Purchases: ${formatCurrency(selectedCustomer.totalPurchasedAmount)}
Total Paid: ${formatCurrency(selectedCustomer.totalPaidAmount)}
*CURRENT BALANCE DUE: ${formatCurrency(selectedCustomer.currentBalance)}*
Credit Limit: ${formatCurrency(selectedCustomer.creditLimit)}
------------------------------------
Recent Lifting Invoices:
${customerSales.slice(0, 3).map((s) => `• ${s.invoiceNo} (${formatDate(s.date)}): ${s.netWeightKg}kg @ ₹${s.ratePerKg} = ${formatCurrency(s.finalAmount)}`).join('\n')}
------------------------------------
Thank you for your business.`;
    shareViaWhatsApp(text);
  };

  return (
    <div className="space-y-4 pb-20 select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-base font-bold text-slate-900 leading-tight">Buyers & Customers</h1>
          <p className="text-xs text-slate-500">Chicken traders, wholesalers & processing plants</p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0d2b45] hover:bg-blue-900 text-white text-xs font-semibold shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Buyer</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search buyer name, city, phone..."
          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-slate-200 focus:ring-2 focus:ring-blue-600 shadow-xs"
        />
      </div>

      {/* Customer Cards */}
      <div className="space-y-3">
        {filteredCustomers.map((cust) => (
          <div
            key={cust.id}
            className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-blue-400 transition-all space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-slate-900">{cust.name}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {cust.type}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 font-medium mt-0.5">{cust.businessName}</p>
                <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>{cust.city}</span>
                  <span>·</span>
                  <Phone className="w-3 h-3 text-slate-400 ml-1" />
                  <span>{cust.phone}</span>
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 block uppercase font-medium">Balance Due</span>
                <span className={`text-sm font-extrabold tabular-nums ${cust.currentBalance > 0 ? 'text-emerald-700' : 'text-slate-800'}`}>
                  {formatCurrency(cust.currentBalance)}
                </span>
              </div>
            </div>

            {/* Financial Ledger Mini Summary */}
            <div className="grid grid-cols-3 gap-1.5 p-2 bg-slate-50 rounded-xl text-center text-[10px]">
              <div>
                <span className="text-slate-400 block uppercase">Total Purchases</span>
                <span className="text-xs font-bold text-slate-900 tabular-nums">
                  {formatCurrency(cust.totalPurchasedAmount)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase">Total Paid</span>
                <span className="text-xs font-bold text-emerald-700 tabular-nums">
                  {formatCurrency(cust.totalPaidAmount)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase">Credit Limit</span>
                <span className="text-xs font-bold text-blue-900 tabular-nums">
                  {formatCurrency(cust.creditLimit)}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleOpenStatement(cust)}
                className="py-1.5 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1"
              >
                <FileText className="w-3.5 h-3.5 text-blue-700" />
                <span>View Statement</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Customer Statement */}
      {showStatementModal && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-sm select-none">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[92vh] border border-slate-200">
            <div className="bg-[#0d2b45] text-white p-3.5 flex items-center justify-between no-print">
              <div>
                <h3 className="font-bold text-sm text-white">Customer Ledger Statement</h3>
                <p className="text-[10px] text-blue-200">{selectedCustomer.name}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleStatementWhatsApp}
                  className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1 text-xs font-semibold px-2"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Share</span>
                </button>
                <button
                  type="button"
                  onClick={triggerPrint}
                  className="p-1.5 rounded-lg bg-blue-700 hover:bg-blue-600 text-white flex items-center gap-1 text-xs font-semibold px-2"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowStatementModal(false)}
                  className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 ml-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-4 overflow-y-auto flex-1 print-page text-xs text-slate-900 space-y-3.5">
              <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-base text-[#0d2b45]">{settings.farmName}</h2>
                  <p className="text-[10px] text-emerald-700 uppercase font-semibold">{settings.subtitle}</p>
                  <p className="text-[10px] text-slate-500">Ph: {settings.phone} · GST: {settings.gstNumber}</p>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded bg-slate-900 text-white text-[10px] font-bold">
                    STATEMENT
                  </span>
                  <p className="text-[10px] text-slate-500 mt-1">{formatDate(new Date().toISOString())}</p>
                </div>
              </div>

              {/* Customer Box */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-[10px] font-semibold text-slate-500 uppercase">Customer Account</p>
                <h3 className="text-sm font-bold text-slate-900">{selectedCustomer.name}</h3>
                <p className="text-xs text-slate-600">{selectedCustomer.businessName} · {selectedCustomer.city}</p>
                <p className="text-[11px] text-slate-500">Phone: {selectedCustomer.phone}</p>
              </div>

              {/* Balances */}
              <div className="grid grid-cols-3 gap-2 text-center p-3 bg-blue-50/60 rounded-xl border border-blue-100">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Total Purchases</span>
                  <span className="text-xs font-bold text-slate-900 tabular-nums">
                    {formatCurrency(selectedCustomer.totalPurchasedAmount)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Total Paid</span>
                  <span className="text-xs font-bold text-emerald-700 tabular-nums">
                    {formatCurrency(selectedCustomer.totalPaidAmount)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Current Outstanding</span>
                  <span className="text-xs font-extrabold text-rose-600 tabular-nums">
                    {formatCurrency(selectedCustomer.currentBalance)}
                  </span>
                </div>
              </div>

              {/* Transactions List */}
              <div>
                <h4 className="font-bold text-slate-800 text-[11px] uppercase mb-1.5">
                  Lifting & Sales Invoices
                </h4>
                {customerSales.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No sales recorded for this customer yet.</p>
                ) : (
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-[11px]">
                      <thead className="bg-slate-100 text-[10px] font-bold text-slate-600 uppercase">
                        <tr>
                          <th className="py-2 px-2.5">Date / Inv</th>
                          <th className="py-2 px-2.5">Batch</th>
                          <th className="py-2 px-2.5 text-right">Net kg</th>
                          <th className="py-2 px-2.5 text-right">Rate</th>
                          <th className="py-2 px-2.5 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {customerSales.map((s) => (
                          <tr key={s.id}>
                            <td className="py-2 px-2.5">
                              <span className="font-bold text-slate-900 block">{s.invoiceNo}</span>
                              <span className="text-[10px] text-slate-400">{formatDate(s.date)}</span>
                            </td>
                            <td className="py-2 px-2.5">{s.batchNo}</td>
                            <td className="py-2 px-2.5 text-right tabular-nums">{s.netWeightKg}</td>
                            <td className="py-2 px-2.5 text-right tabular-nums">₹{s.ratePerKg}</td>
                            <td className="py-2 px-2.5 text-right font-bold text-slate-900 tabular-nums">
                              {formatCurrency(s.finalAmount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Buyer */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-sm select-none no-print">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[90vh] border border-slate-200">
            <div className="bg-[#0d2b45] text-white p-3.5 flex items-center justify-between">
              <h3 className="font-bold text-sm text-white">Add New Buyer / Customer</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-4 overflow-y-auto space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Customer / Trader Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Sri Venkateswara Chicken Center"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Business Name / Firm</label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Wholesale Poultry Trading Firm"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Customer Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as Customer['type'])}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  >
                    <option value="Wholesaler">Wholesaler</option>
                    <option value="Retailer / Chicken Shop">Retailer / Chicken Shop</option>
                    <option value="Processing Plant">Processing Plant</option>
                    <option value="Trader">Trader</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98480 00000"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">City / Market *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Rajahmundry, Kakinada..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Credit Limit (₹)</label>
                  <input
                    type="number"
                    value={creditLimit}
                    onChange={(e) => setCreditLimit(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Address / Shop No</label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#0d2b45] hover:bg-blue-900 rounded-lg shadow-sm"
                >
                  Save Buyer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
