import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Search,
  Filter,
  Calendar,
  Building2,
  TrendingUp,
  AlertCircle,
  X,
  CheckCircle,
  ChevronRight,
  Activity,
  DollarSign,
  Scale,
} from 'lucide-react';
import { Batch, Shed, Supplier, User } from '../../types';
import { formatCurrency, formatNumber, formatDate, calculateMortalityPercent, calculateLivabilityPercent } from '../../utils/calculations';

interface BatchesViewProps {
  batches: Batch[];
  sheds: Shed[];
  suppliers: Supplier[];
  currentUser: User;
  onSaveBatch: (batch: Batch) => void;
  onSelectBatchDetails: (batch: Batch) => void;
  onOpenClosingWizard: (batch: Batch) => void;
}

export const BatchesView: React.FC<BatchesViewProps> = ({
  batches,
  sheds,
  suppliers,
  currentUser,
  onSaveBatch,
  onSelectBatchDetails,
  onOpenClosingWizard,
}) => {
  const [filterStatus, setFilterStatus] = useState<'All' | 'Running' | 'Closed'>('Running');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);

  // New Batch Form State
  const [newBatchNo, setNewBatchNo] = useState(`B-${new Date().getFullYear()}-00${batches.length + 1}`);
  const [selectedShedId, setSelectedShedId] = useState(sheds[0]?.id || '');
  const [birdBreed, setBirdBreed] = useState('Cobb 500');
  const [placementDate, setPlacementDate] = useState(new Date().toISOString().slice(0, 10));
  const [initialChicks, setInitialChicks] = useState(15000);
  const [chickRate, setChickRate] = useState(38.5);
  const [supplierId, setSupplierId] = useState(suppliers[0]?.id || '');
  const [notes, setNotes] = useState('');

  const filteredBatches = batches.filter((b) => {
    if (filterStatus !== 'All' && b.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        b.batchNo.toLowerCase().includes(q) ||
        b.shedNo.toLowerCase().includes(q) ||
        b.birdBreed.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    const shed = sheds.find((s) => s.id === selectedShedId);
    const supplier = suppliers.find((s) => s.id === supplierId);

    const newBatch: Batch = {
      id: `batch-${Date.now()}`,
      batchNo: newBatchNo,
      shedId: selectedShedId,
      shedNo: shed ? shed.shedNo : 'EC Shed 01',
      birdBreed,
      placementDate,
      initialChicks: Number(initialChicks),
      chickRate: Number(chickRate),
      supplierId,
      supplierName: supplier ? supplier.name : "Venky's Hatcheries",
      status: 'Running',
      currentAgeDays: 1,
      currentLiveBirds: Number(initialChicks),
      totalMortality: 0,
      totalSold: 0,
      totalFeedConsumedKg: 0,
      averageWeightKg: 0.042, // Day 1 standard chick weight 42g
      currentFcr: 0,
      notes,
    };

    onSaveBatch(newBatch);
    setShowNewModal(false);
  };

  return (
    <div className="space-y-4 pb-20 select-none">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-base font-bold text-slate-900 leading-tight">Poultry Batches</h1>
          <p className="text-xs text-slate-500">Track flock cycles & growth metrics</p>
        </div>
        <button
          type="button"
          onClick={() => setShowNewModal(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0d2b45] hover:bg-blue-900 active:scale-95 text-white text-xs font-semibold shadow-xs transition-transform"
        >
          <Plus className="w-4 h-4" />
          <span>New Batch</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by batch number or shed..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-600 shadow-xs"
          />
        </div>

        <div className="flex p-1 bg-slate-200/70 rounded-xl text-xs font-medium">
          {(['Running', 'Closed', 'All'] as Array<'All' | 'Running' | 'Closed'>).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setFilterStatus(st)}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                filterStatus === st
                  ? 'bg-white text-slate-900 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st} ({batches.filter((b) => (st === 'All' ? true : b.status === st)).length})
            </button>
          ))}
        </div>
      </div>

      {/* Batches List */}
      <div className="space-y-3">
        {filteredBatches.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400">
            <Layers className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p className="text-xs font-semibold text-slate-600">No batches match your filter</p>
          </div>
        ) : (
          filteredBatches.map((batch) => {
            const mortPct = calculateMortalityPercent(batch.initialChicks, batch.totalMortality);
            const livePct = calculateLivabilityPercent(batch.initialChicks, batch.totalMortality);
            const isRunning = batch.status === 'Running';

            return (
              <div
                key={batch.id}
                className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-blue-400 transition-all space-y-3"
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{batch.batchNo}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-900 border border-blue-200">
                      {batch.shedNo}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isRunning
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {batch.status}
                  </span>
                </div>

                {/* Subtitle / Breed / Dates */}
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Breed: <strong className="text-slate-700 font-semibold">{batch.birdBreed}</strong></span>
                  <span>Placed: {formatDate(batch.placementDate)}</span>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-4 gap-1.5 p-2.5 bg-slate-50 rounded-xl text-center text-[10px]">
                  <div>
                    <span className="text-slate-400 block uppercase">Age</span>
                    <span className="text-xs font-bold text-slate-800 tabular-nums">
                      Day {batch.currentAgeDays}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block uppercase">Live Birds</span>
                    <span className="text-xs font-bold text-emerald-700 tabular-nums">
                      {formatNumber(batch.currentLiveBirds)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block uppercase">Avg Weight</span>
                    <span className="text-xs font-bold text-blue-900 tabular-nums">
                      {batch.averageWeightKg} kg
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block uppercase">FCR</span>
                    <span className="text-xs font-bold text-purple-700 tabular-nums">
                      {batch.currentFcr || '-'}
                    </span>
                  </div>
                </div>

                {/* Mortality & Livability progress */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">
                      Livability: <strong className="text-emerald-700">{livePct}%</strong>
                    </span>
                    <span className="text-slate-500">
                      Mortality: <strong className="text-rose-600">{batch.totalMortality} birds ({mortPct}%)</strong>
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden flex">
                    <div className="bg-emerald-500 h-full" style={{ width: `${livePct}%` }} />
                    <div className="bg-rose-500 h-full" style={{ width: `${mortPct}%` }} />
                  </div>
                </div>

                {/* Actions: View Details & Close Batch */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectBatchDetails(batch)}
                    className="flex-1 py-1.5 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-center gap-1"
                  >
                    <span>View Details</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {isRunning && (
                    <button
                      type="button"
                      onClick={() => onOpenClosingWizard(batch)}
                      className="py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white flex items-center justify-center gap-1 shadow-xs"
                    >
                      <Scale className="w-3.5 h-3.5" />
                      <span>Close Batch</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: New Batch Creation */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-sm select-none no-print">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[90vh] border border-slate-200">
            <div className="bg-[#0d2b45] text-white p-3.5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-white">Create New Poultry Batch</h3>
                <p className="text-[10px] text-blue-200">EC Shed Bird Placement Entry</p>
              </div>
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="p-1 rounded-lg text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBatch} className="p-4 overflow-y-auto space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Batch Number *</label>
                <input
                  type="text"
                  required
                  value={newBatchNo}
                  onChange={(e) => setNewBatchNo(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono font-bold text-slate-900 focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Select EC Shed *</label>
                  <select
                    value={selectedShedId}
                    onChange={(e) => setSelectedShedId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium text-slate-800 focus:ring-2 focus:ring-blue-600"
                  >
                    {sheds.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.shedNo} (Cap: {s.capacity.toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Bird Breed *</label>
                  <select
                    value={birdBreed}
                    onChange={(e) => setBirdBreed(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium text-slate-800 focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="Cobb 500">Cobb 500 (Fast Growth)</option>
                    <option value="Ross 308">Ross 308 (Robust FCR)</option>
                    <option value="Hubbard Classic">Hubbard Classic</option>
                    <option value="Arbor Acres">Arbor Acres</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Placement Date *</label>
                  <input
                    type="date"
                    required
                    value={placementDate}
                    onChange={(e) => setPlacementDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium text-slate-800 focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Initial Chicks Count *</label>
                  <input
                    type="number"
                    required
                    min={100}
                    max={50000}
                    value={initialChicks}
                    onChange={(e) => setInitialChicks(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold tabular-nums text-slate-900 focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Chick Rate (₹ / bird) *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={chickRate}
                    onChange={(e) => setChickRate(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold tabular-nums text-slate-900 focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Chicks Supplier *</label>
                  <select
                    value={supplierId}
                    onChange={(e) => setSupplierId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 focus:ring-2 focus:ring-blue-600"
                  >
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Total Investment preview */}
              <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-200 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-blue-900 uppercase font-semibold">Chicks Capital Investment</p>
                  <p className="text-sm font-bold text-[#0d2b45] tabular-nums">
                    {formatCurrency(initialChicks * chickRate)}
                  </p>
                </div>
                <span className="text-[10px] text-blue-700">
                  {initialChicks.toLocaleString()} birds @ ₹{chickRate}
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Batch Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Hatchery delivery notes, chick weight, brooding setup..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600"
                />
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
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#0d2b45] hover:bg-blue-900 rounded-lg shadow-sm"
                >
                  Save & Place Flock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
