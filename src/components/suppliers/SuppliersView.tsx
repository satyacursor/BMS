import React, { useState } from 'react';
import {
  Truck,
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  FileText,
  X,
  Printer,
  MessageSquare,
} from 'lucide-react';
import { Supplier, FeedStockEntry, FarmSettings } from '../../types';
import { formatCurrency, formatDate } from '../../utils/calculations';
import { shareViaWhatsApp, triggerPrint } from '../../utils/export';

interface SuppliersViewProps {
  suppliers: Supplier[];
  feedPurchases: FeedStockEntry[];
  settings: FarmSettings;
  onSaveSupplier: (supplier: Supplier) => void;
}

export const SuppliersView: React.FC<SuppliersViewProps> = ({
  suppliers,
  feedPurchases,
  settings,
  onSaveSupplier,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showStatementModal, setShowStatementModal] = useState(false);

  // New Supplier state
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Supplier['category']>('Feed Supplier');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [gstNo, setGstNo] = useState('');
  const [creditDays, setCreditDays] = useState(21);

  const filteredSuppliers = suppliers.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.contactPerson.toLowerCase().includes(q) ||
      s.phone.toLowerCase().includes(q)
    );
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSup: Supplier = {
      id: `sup-${Date.now()}`,
      name,
      category,
      contactPerson,
      phone,
      email,
      address,
      gstNo,
      creditDaysLimit: Number(creditDays),
      openingBalance: 0,
      currentBalance: 0,
      totalPurchasedAmount: 0,
      totalPaidAmount: 0,
      active: true,
    };
    onSaveSupplier(newSup);
    setShowAddModal(false);
  };

  const handleOpenStatement = (s: Supplier) => {
    setSelectedSupplier(s);
    setShowStatementModal(true);
  };

  const supplierReceipts = selectedSupplier
    ? feedPurchases.filter((f) => f.supplierId === selectedSupplier.id)
    : [];

  const handleStatementWhatsApp = () => {
    if (!selectedSupplier) return;
    const text = `*${settings.farmName} - SUPPLIER STATEMENT*
Supplier: ${selectedSupplier.name} (${selectedSupplier.category})
Contact: ${selectedSupplier.contactPerson} · Ph: ${selectedSupplier.phone}
Date: ${new Date().toLocaleDateString('en-GB')}
------------------------------------
Total Purchased: ${formatCurrency(selectedSupplier.totalPurchasedAmount)}
Total Paid: ${formatCurrency(selectedSupplier.totalPaidAmount)}
*CURRENT BALANCE DUE TO SUPPLIER: ${formatCurrency(selectedSupplier.currentBalance)}*
Credit Days Terms: ${selectedSupplier.creditDaysLimit} Days
------------------------------------
Recent Supply Receipts:
${supplierReceipts.slice(0, 3).map((r) => `• Inv ${r.invoiceNo} (${formatDate(r.date)}): ${r.bagsCount} bags (${r.totalWeightKg}kg) = ${formatCurrency(r.totalAmount)}`).join('\n')}
------------------------------------
EC Farm Pro Automated Accounts`;
    shareViaWhatsApp(text);
  };

  return (
    <div className="space-y-4 pb-20 select-none">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-base font-bold text-slate-900 leading-tight">Suppliers & Payables</h1>
          <p className="text-xs text-slate-500">Feed mills, hatcheries & medicine distributors</p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0d2b45] hover:bg-blue-900 text-white text-xs font-semibold shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Supplier</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search supplier, contact person, category..."
          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-slate-200 focus:ring-2 focus:ring-blue-600 shadow-xs"
        />
      </div>

      {/* List */}
      <div className="space-y-3">
        {filteredSuppliers.map((sup) => (
          <div
            key={sup.id}
            className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-blue-400 transition-all space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-slate-900">{sup.name}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                    {sup.category}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 font-medium mt-0.5">{sup.contactPerson}</p>
                <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                  <Phone className="w-3 h-3 text-slate-400" />
                  <span>{sup.phone}</span>
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 block uppercase font-medium">Balance Payable</span>
                <span className={`text-sm font-extrabold tabular-nums ${sup.currentBalance > 0 ? 'text-rose-600' : 'text-slate-800'}`}>
                  {formatCurrency(sup.currentBalance)}
                </span>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-1.5 p-2 bg-slate-50 rounded-xl text-center text-[10px]">
              <div>
                <span className="text-slate-400 block uppercase">Total Purchased</span>
                <span className="text-xs font-bold text-slate-900 tabular-nums">
                  {formatCurrency(sup.totalPurchasedAmount)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase">Total Paid</span>
                <span className="text-xs font-bold text-emerald-700 tabular-nums">
                  {formatCurrency(sup.totalPaidAmount)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase">Credit Terms</span>
                <span className="text-xs font-bold text-blue-900 tabular-nums">
                  {sup.creditDaysLimit} Days
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleOpenStatement(sup)}
                className="py-1.5 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1"
              >
                <FileText className="w-3.5 h-3.5 text-blue-700" />
                <span>Supplier Statement</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Supplier Statement */}
      {showStatementModal && selectedSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-sm select-none">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[92vh] border border-slate-200">
            <div className="bg-[#0d2b45] text-white p-3.5 flex items-center justify-between no-print">
              <div>
                <h3 className="font-bold text-sm text-white">Supplier Payable Statement</h3>
                <p className="text-[10px] text-blue-200">{selectedSupplier.name}</p>
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
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded bg-slate-900 text-white text-[10px] font-bold">
                    SUPPLIER VOUCHER
                  </span>
                  <p className="text-[10px] text-slate-500 mt-1">{formatDate(new Date().toISOString())}</p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-[10px] font-semibold text-slate-500 uppercase">Vendor Information</p>
                <h3 className="text-sm font-bold text-slate-900">{selectedSupplier.name}</h3>
                <p className="text-xs text-slate-600">{selectedSupplier.category} · {selectedSupplier.address}</p>
                <p className="text-[11px] text-slate-500">Contact: {selectedSupplier.contactPerson} ({selectedSupplier.phone})</p>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center p-3 bg-rose-50/60 rounded-xl border border-rose-100">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Total Purchased</span>
                  <span className="text-xs font-bold text-slate-900 tabular-nums">
                    {formatCurrency(selectedSupplier.totalPurchasedAmount)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Total Disbursed</span>
                  <span className="text-xs font-bold text-emerald-700 tabular-nums">
                    {formatCurrency(selectedSupplier.totalPaidAmount)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Balance Due to Supplier</span>
                  <span className="text-xs font-extrabold text-rose-700 tabular-nums">
                    {formatCurrency(selectedSupplier.currentBalance)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Supplier */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-sm select-none no-print">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[90vh] border border-slate-200">
            <div className="bg-[#0d2b45] text-white p-3.5 flex items-center justify-between">
              <h3 className="font-bold text-sm text-white">Add New Farm Supplier</h3>
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
                <label className="block font-semibold text-slate-700 mb-1">Supplier Company Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Godrej Agrovet / Venky's Hatcheries"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Supply Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Supplier['category'])}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  >
                    <option value="Feed Supplier">Feed Supplier</option>
                    <option value="Hatchery (Chicks)">Hatchery (Chicks)</option>
                    <option value="Medicines & Vaccines">Medicines & Vaccines</option>
                    <option value="Equipment & Spare Parts">Equipment & Spare Parts</option>
                    <option value="Diesel & Energy">Diesel & Energy</option>
                    <option value="Litter & General">Litter & General</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="Area Sales Manager"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 94400 00000"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Credit Limit (Days)</label>
                  <input
                    type="number"
                    value={creditDays}
                    onChange={(e) => setCreditDays(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Address / Plant Location</label>
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
                  Save Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
