import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Wind,
  Thermometer,
  Layers,
  Edit2,
  Trash2,
  X,
  CheckCircle2,
  UserCheck,
} from 'lucide-react';
import { Shed, ShedStatus, User } from '../../types';

interface ShedsViewProps {
  sheds: Shed[];
  currentUser: User;
  onSaveShed: (shed: Shed) => void;
  onDeleteShed: (shedId: string) => void;
  onSelectShedBatch?: (batchId?: string) => void;
}

export const ShedsView: React.FC<ShedsViewProps> = ({
  sheds,
  currentUser,
  onSaveShed,
  onDeleteShed,
  onSelectShedBatch,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingShed, setEditingShed] = useState<Shed | null>(null);

  // Form State
  const [shedNo, setShedNo] = useState('');
  const [shedName, setShedName] = useState('');
  const [shedDetails, setShedDetails] = useState('');
  const [lengthFt, setLengthFt] = useState(360);
  const [widthFt, setWidthFt] = useState(45);
  const [capacity, setCapacity] = useState(15000);
  const [exhaustFanCount, setExhaustFanCount] = useState(10);
  const [coolingPadAreaSqFt, setCoolingPadAreaSqFt] = useState(650);
  const [heatingSystem, setHeatingSystem] = useState('Automated Diesel Space Heaters (2 Units)');
  const [feederLinesCount, setFeederLinesCount] = useState(4);
  const [drinkerLinesCount, setDrinkerLinesCount] = useState(5);
  const [status, setStatus] = useState<ShedStatus>('Active');
  const [supervisorName, setSupervisorName] = useState('');
  const [notes, setNotes] = useState('');

  const openNew = () => {
    setEditingShed(null);
    setShedNo(`EC Shed 0${sheds.length + 1}`);
    setShedName(`EC Shed ${String.fromCharCode(65 + sheds.length)}`);
    setShedDetails('Modern tunnel ventilated environment controlled poultry shed');
    setLengthFt(360);
    setWidthFt(45);
    setCapacity(15000);
    setExhaustFanCount(10);
    setCoolingPadAreaSqFt(650);
    setHeatingSystem('Automated Diesel Space Heaters');
    setFeederLinesCount(4);
    setDrinkerLinesCount(5);
    setStatus('Active');
    setSupervisorName('Farm Supervisor');
    setNotes('');
    setShowModal(true);
  };

  const openEdit = (s: Shed) => {
    setEditingShed(s);
    setShedNo(s.shedNo);
    setShedName(s.shedName);
    setShedDetails(s.shedDetails);
    setLengthFt(s.lengthFt);
    setWidthFt(s.widthFt);
    setCapacity(s.capacity);
    setExhaustFanCount(s.exhaustFanCount);
    setCoolingPadAreaSqFt(s.coolingPadAreaSqFt);
    setHeatingSystem(s.heatingSystem);
    setFeederLinesCount(s.feederLinesCount);
    setDrinkerLinesCount(s.drinkerLinesCount);
    setStatus(s.status);
    setSupervisorName(s.supervisorName);
    setNotes(s.notes || '');
    setShowModal(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const shedData: Shed = {
      id: editingShed ? editingShed.id : `shed-${Date.now()}`,
      shedNo,
      shedName,
      shedDetails,
      lengthFt: Number(lengthFt),
      widthFt: Number(widthFt),
      areaSqFt: Number(lengthFt) * Number(widthFt),
      capacity: Number(capacity),
      exhaustFanCount: Number(exhaustFanCount),
      coolingPadAreaSqFt: Number(coolingPadAreaSqFt),
      heatingSystem,
      feederLinesCount: Number(feederLinesCount),
      drinkerLinesCount: Number(drinkerLinesCount),
      status,
      currentBatchId: editingShed?.currentBatchId,
      currentBatchNo: editingShed?.currentBatchNo,
      supervisorName,
      notes,
    };
    onSaveShed(shedData);
    setShowModal(false);
  };

  return (
    <div className="space-y-4 pb-20 select-none">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-base font-bold text-slate-900 leading-tight">Farm & EC Sheds</h1>
          <p className="text-xs text-slate-500">Manage environment controlled houses</p>
        </div>
        <button
          type="button"
          onClick={openNew}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0d2b45] hover:bg-blue-900 active:scale-95 text-white text-xs font-semibold shadow-xs transition-transform"
        >
          <Plus className="w-4 h-4" />
          <span>Add Shed</span>
        </button>
      </div>

      {/* Shed Cards */}
      <div className="space-y-3">
        {sheds.map((shed) => {
          const statusColors: Record<ShedStatus, string> = {
            Active: 'bg-emerald-100 text-emerald-800 border-emerald-300',
            Cleaning: 'bg-amber-100 text-amber-800 border-amber-300',
            Empty: 'bg-slate-100 text-slate-700 border-slate-300',
            Maintenance: 'bg-rose-100 text-rose-800 border-rose-300',
          };

          return (
            <div
              key={shed.id}
              className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold text-slate-900">{shed.shedNo}</h2>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        statusColors[shed.status]
                      }`}
                    >
                      {shed.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 font-medium">{shed.shedName}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEdit(shed)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  {sheds.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Delete ${shed.shedNo}?`)) {
                          onDeleteShed(shed.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <p className="text-[11px] text-slate-500 line-clamp-2">{shed.shedDetails}</p>

              {/* Specs Grid */}
              <div className="grid grid-cols-3 gap-2 p-2.5 bg-slate-50 rounded-xl text-center text-[10px]">
                <div>
                  <span className="text-slate-400 block uppercase">Capacity</span>
                  <span className="text-xs font-bold text-slate-900 tabular-nums">
                    {shed.capacity.toLocaleString()} birds
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase">Dimensions</span>
                  <span className="text-xs font-bold text-blue-900 tabular-nums">
                    {shed.lengthFt} × {shed.widthFt} ft
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase">Ventilation</span>
                  <span className="text-xs font-bold text-emerald-700 tabular-nums">
                    {shed.exhaustFanCount} Fans
                  </span>
                </div>
              </div>

              {/* Batch link & Supervisor */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-[11px]">{shed.supervisorName}</span>
                </div>
                {shed.currentBatchNo ? (
                  <span className="text-[11px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                    Running: {shed.currentBatchNo}
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-400 italic">No Batch Assigned</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Shed Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-sm select-none no-print">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[90vh] border border-slate-200">
            <div className="bg-[#0d2b45] text-white p-3.5 flex items-center justify-between">
              <h3 className="font-bold text-sm text-white">
                {editingShed ? 'Edit EC Shed' : 'Add New EC Shed'}
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-4 overflow-y-auto space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Shed Number *</label>
                  <input
                    type="text"
                    required
                    value={shedNo}
                    onChange={(e) => setShedNo(e.target.value)}
                    placeholder="EC Shed 01"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Shed Status *</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ShedStatus)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  >
                    <option value="Active">Active (Flock Running)</option>
                    <option value="Cleaning">Cleaning / Sanitizing</option>
                    <option value="Empty">Empty (Ready)</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Shed Name *</label>
                <input
                  type="text"
                  required
                  value={shedName}
                  onChange={(e) => setShedName(e.target.value)}
                  placeholder="EC Shed Alpha (North Wing)"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Capacity (Birds)</label>
                  <input
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Length (ft)</label>
                  <input
                    type="number"
                    value={lengthFt}
                    onChange={(e) => setLengthFt(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Width (ft)</label>
                  <input
                    type="number"
                    value={widthFt}
                    onChange={(e) => setWidthFt(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Exhaust Fans Count</label>
                  <input
                    type="number"
                    value={exhaustFanCount}
                    onChange={(e) => setExhaustFanCount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Cooling Pad Area (sq ft)</label>
                  <input
                    type="number"
                    value={coolingPadAreaSqFt}
                    onChange={(e) => setCoolingPadAreaSqFt(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Supervisor Name</label>
                <input
                  type="text"
                  value={supervisorName}
                  onChange={(e) => setSupervisorName(e.target.value)}
                  placeholder="Suresh Reddy / Nagaraju"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Shed Details / Notes</label>
                <textarea
                  rows={2}
                  value={shedDetails}
                  onChange={(e) => setShedDetails(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#0d2b45] hover:bg-blue-900 rounded-lg shadow-sm"
                >
                  Save Shed
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
