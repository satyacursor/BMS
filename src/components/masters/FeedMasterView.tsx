import React, { useState } from 'react';
import { Wheat, Plus, Edit2, X } from 'lucide-react';
import { FeedTypeItem } from '../../types';
import { formatCurrency } from '../../utils/calculations';

interface FeedMasterViewProps {
  feedTypes: FeedTypeItem[];
  onSaveFeedType: (feed: FeedTypeItem) => void;
}

export const FeedMasterView: React.FC<FeedMasterViewProps> = ({
  feedTypes,
  onSaveFeedType,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<FeedTypeItem | null>(null);

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [category, setCategory] = useState<FeedTypeItem['category']>('Starter');
  const [bagWeightKg, setBagWeightKg] = useState(50);
  const [standardRate, setStandardRate] = useState(2200);
  const [crudeProtein, setCrudeProtein] = useState(21.5);
  const [startDays, setStartDays] = useState(11);
  const [endDays, setEndDays] = useState(20);
  const [manufacturer, setManufacturer] = useState('Godrej Agrovet Ltd');

  const openNew = () => {
    setEditing(null);
    setName('');
    setCode(`FEED-0${feedTypes.length + 1}`);
    setCategory('Starter');
    setBagWeightKg(50);
    setStandardRate(2200);
    setCrudeProtein(21.5);
    setStartDays(11);
    setEndDays(20);
    setManufacturer('Godrej Agrovet Ltd');
    setShowModal(true);
  };

  const openEdit = (f: FeedTypeItem) => {
    setEditing(f);
    setName(f.name);
    setCode(f.code);
    setCategory(f.category);
    setBagWeightKg(f.bagWeightKg);
    setStandardRate(f.standardRatePerBag);
    setCrudeProtein(f.crudeProteinPercent);
    setStartDays(f.recommendedAgeStartDays);
    setEndDays(f.recommendedAgeEndDays);
    setManufacturer(f.manufacturer);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const item: FeedTypeItem = {
      id: editing ? editing.id : `feed-${Date.now()}`,
      code,
      name,
      category,
      bagWeightKg: Number(bagWeightKg),
      standardRatePerBag: Number(standardRate),
      crudeProteinPercent: Number(crudeProtein),
      meKcalPerKg: 3100,
      recommendedAgeStartDays: Number(startDays),
      recommendedAgeEndDays: Number(endDays),
      manufacturer,
    };
    onSaveFeedType(item);
    setShowModal(false);
  };

  return (
    <div className="space-y-4 pb-20 select-none">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-base font-bold text-slate-900 leading-tight">Feed Master</h1>
          <p className="text-xs text-slate-500">Broiler nutrition profiles, bags & rates</p>
        </div>
        <button
          type="button"
          onClick={openNew}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0d2b45] hover:bg-blue-900 text-white text-xs font-semibold shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Feed Type</span>
        </button>
      </div>

      <div className="space-y-3">
        {feedTypes.map((ft) => (
          <div
            key={ft.id}
            className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900">{ft.name}</span>
                <span className="text-[10px] font-mono text-slate-400 block">{ft.code}</span>
              </div>
              <button
                type="button"
                onClick={() => openEdit(ft)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-blue-700 hover:bg-blue-50"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-1.5 p-2 bg-slate-50 rounded-xl text-center text-[10px]">
              <div>
                <span className="text-slate-400 block uppercase">Standard Rate</span>
                <span className="text-xs font-bold text-slate-900 tabular-nums">
                  {formatCurrency(ft.standardRatePerBag)}
                </span>
                <span className="text-[9px] text-slate-400">/ 50kg bag</span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase">Crude Protein</span>
                <span className="text-xs font-bold text-emerald-700 tabular-nums">
                  {ft.crudeProteinPercent}% CP
                </span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase">Target Age</span>
                <span className="text-xs font-bold text-blue-900 tabular-nums">
                  Day {ft.recommendedAgeStartDays}-{ft.recommendedAgeEndDays}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
              Manufacturer: <strong className="text-slate-700">{ft.manufacturer}</strong>
            </p>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-sm select-none no-print">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[90vh] border border-slate-200">
            <div className="bg-[#0d2b45] text-white p-3.5 flex items-center justify-between">
              <h3 className="font-bold text-sm text-white">
                {editing ? 'Edit Feed Item' : 'New Feed Item'}
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Feed Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Broiler Starter (Pellets)"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as FeedTypeItem['category'])}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  >
                    <option value="Pre-Starter">Pre-Starter</option>
                    <option value="Starter">Starter</option>
                    <option value="Finisher">Finisher</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Rate / 50kg Bag (₹)</label>
                  <input
                    type="number"
                    required
                    value={standardRate}
                    onChange={(e) => setStandardRate(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold tabular-nums"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Start Day</label>
                  <input
                    type="number"
                    value={startDays}
                    onChange={(e) => setStartDays(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 tabular-nums"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target End Day</label>
                  <input
                    type="number"
                    value={endDays}
                    onChange={(e) => setEndDays(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Manufacturer</label>
                <input
                  type="text"
                  value={manufacturer}
                  onChange={(e) => setManufacturer(e.target.value)}
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
                  Save Feed Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
