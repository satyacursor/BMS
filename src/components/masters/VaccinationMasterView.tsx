import React, { useState } from 'react';
import { Syringe, Plus, Edit2, X, Check } from 'lucide-react';
import { VaccineMasterItem } from '../../types';

interface VaccinationMasterViewProps {
  vaccines: VaccineMasterItem[];
  onSaveVaccine: (vaccine: VaccineMasterItem) => void;
}

export const VaccinationMasterView: React.FC<VaccinationMasterViewProps> = ({
  vaccines,
  onSaveVaccine,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<VaccineMasterItem | null>(null);

  const [name, setName] = useState('');
  const [disease, setDisease] = useState('');
  const [ageDays, setAgeDays] = useState(7);
  const [route, setRoute] = useState<VaccineMasterItem['administrationRoute']>('Eye Drop');
  const [dosage, setDosage] = useState('1 drop per bird');
  const [manufacturer, setManufacturer] = useState('Boehringer Ingelheim');
  const [notes, setNotes] = useState('');

  const openNew = () => {
    setEditing(null);
    setName('');
    setDisease('');
    setAgeDays(7);
    setRoute('Eye Drop');
    setDosage('1 drop per bird');
    setManufacturer('Boehringer Ingelheim');
    setNotes('');
    setShowModal(true);
  };

  const openEdit = (v: VaccineMasterItem) => {
    setEditing(v);
    setName(v.vaccineName);
    setDisease(v.diseaseTarget);
    setAgeDays(v.recommendedAgeDays);
    setRoute(v.administrationRoute);
    setDosage(v.standardDosage);
    setManufacturer(v.manufacturer);
    setNotes(v.notes);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const item: VaccineMasterItem = {
      id: editing ? editing.id : `vac-${Date.now()}`,
      vaccineName: name,
      diseaseTarget: disease,
      recommendedAgeDays: Number(ageDays),
      administrationRoute: route,
      standardDosage: dosage,
      manufacturer,
      mandatory: true,
      notes,
    };
    onSaveVaccine(item);
    setShowModal(false);
  };

  return (
    <div className="space-y-4 pb-20 select-none">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-base font-bold text-slate-900 leading-tight">Vaccination Master</h1>
          <p className="text-xs text-slate-500">Poultry immunization schedules & protocols</p>
        </div>
        <button
          type="button"
          onClick={openNew}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0d2b45] hover:bg-blue-900 text-white text-xs font-semibold shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Vaccine</span>
        </button>
      </div>

      <div className="space-y-3">
        {vaccines.map((v) => (
          <div
            key={v.id}
            className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900">{v.vaccineName}</span>
                <span className="text-[10px] text-slate-500 block">Target: {v.diseaseTarget}</span>
              </div>
              <button
                type="button"
                onClick={() => openEdit(v)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-blue-700 hover:bg-blue-50"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-1.5 p-2 bg-slate-50 rounded-xl text-center text-[10px]">
              <div>
                <span className="text-slate-400 block uppercase">Schedule</span>
                <span className="text-xs font-bold text-blue-900 tabular-nums">Day {v.recommendedAgeDays}</span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase">Route</span>
                <span className="text-xs font-bold text-slate-800">{v.administrationRoute}</span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase">Dosage</span>
                <span className="text-[11px] font-bold text-slate-800 truncate block">{v.standardDosage}</span>
              </div>
            </div>

            {v.notes && <p className="text-[11px] text-slate-500 italic">"{v.notes}"</p>}
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-sm select-none no-print">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[90vh] border border-slate-200">
            <div className="bg-[#0d2b45] text-white p-3.5 flex items-center justify-between">
              <h3 className="font-bold text-sm text-white">
                {editing ? 'Edit Vaccine Protocol' : 'Add Vaccine Protocol'}
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
                <label className="block font-semibold text-slate-700 mb-1">Vaccine Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Newcastle Disease (ND Lasota) + IB"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Disease</label>
                <input
                  type="text"
                  required
                  value={disease}
                  onChange={(e) => setDisease(e.target.value)}
                  placeholder="Ranikhet Viral Disease"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Recommended Age (Days)</label>
                  <input
                    type="number"
                    min={1}
                    value={ageDays}
                    onChange={(e) => setAgeDays(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold tabular-nums"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Route / Method</label>
                  <select
                    value={route}
                    onChange={(e) => setRoute(e.target.value as VaccineMasterItem['administrationRoute'])}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  >
                    <option value="Eye Drop">Eye Drop</option>
                    <option value="Drinking Water">Drinking Water</option>
                    <option value="Subcutaneous">Subcutaneous Injection</option>
                    <option value="Spray">Coarse Spray</option>
                    <option value="Wing Web">Wing Web</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Standard Dosage</label>
                <input
                  type="text"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  placeholder="1 drop per bird in single eye"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Notes / Temperature Cold Chain</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Keep between 2-8°C..."
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
                  Save Vaccine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
