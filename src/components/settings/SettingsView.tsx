import React, { useState } from 'react';
import {
  Settings,
  Building2,
  Database,
  Download,
  Upload,
  RefreshCw,
  ShieldCheck,
  Server,
  Save,
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { FarmSettings, User } from '../../types';
import { exportDatabaseBackupJSON, importDatabaseBackupJSON, resetToFactoryData } from '../../services/storage';

interface SettingsViewProps {
  settings: FarmSettings;
  currentUser: User;
  onSaveSettings: (settings: FarmSettings) => void;
  onResetFactoryData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  currentUser,
  onSaveSettings,
  onResetFactoryData,
}) => {
  const [formData, setFormData] = useState<FarmSettings>({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [jsonBackupStr, setJsonBackupStr] = useState('');
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [importText, setImportText] = useState('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleDownloadBackup = () => {
    const json = exportDatabaseBackupJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `EC_FARM_PRO_BACKUP_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importText.trim()) return;
    const ok = importDatabaseBackupJSON(importText);
    if (ok) {
      alert('Database restored successfully from backup JSON!');
      window.location.reload();
    } else {
      alert('Failed to parse backup JSON. Please check file format.');
    }
  };

  return (
    <div className="space-y-4 pb-20 select-none">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-base font-bold text-slate-900 leading-tight">Farm Settings & Database</h1>
          <p className="text-xs text-slate-500">Configure farm profile, alerts & SQL Server bridge</p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Farm configurations saved successfully!</span>
        </div>
      )}

      {/* Farm Profile Form */}
      <form onSubmit={handleFormSubmit} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3.5 text-xs">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Building2 className="w-4 h-4 text-blue-800" />
          <h2 className="font-bold text-slate-900">Farm Organization Profile</h2>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Farm Commercial Name *</label>
          <input
            type="text"
            required
            value={formData.farmName}
            onChange={(e) => setFormData({ ...formData, farmName: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold text-slate-900"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Subtitle / System Name *</label>
          <input
            type="text"
            required
            value={formData.subtitle}
            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 font-semibold"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Owner / Proprietor</label>
            <input
              type="text"
              value={formData.ownerName}
              onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Poultry License No</label>
            <input
              type="text"
              value={formData.licenseNo}
              onChange={(e) => setFormData({ ...formData, licenseNo: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Contact Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">GSTIN Number</label>
            <input
              type="text"
              value={formData.gstNumber}
              onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Farm Premises Address</label>
          <textarea
            rows={2}
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-slate-300"
          />
        </div>

        {/* Operational Thresholds */}
        <div className="pt-2 border-t border-slate-100 space-y-2.5">
          <h3 className="font-bold text-slate-800 text-[11px] uppercase tracking-tight">
            Flock Targets & Alarm Thresholds
          </h3>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Target Lifting Age</label>
              <input
                type="number"
                value={formData.batchTargetDays}
                onChange={(e) => setFormData({ ...formData, batchTargetDays: Number(e.target.value) })}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 tabular-nums font-bold"
              />
              <span className="text-[9px] text-slate-400">Days (Standard 36)</span>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Target Live Wt (kg)</label>
              <input
                type="number"
                step="0.1"
                value={formData.batchTargetWeightKg}
                onChange={(e) => setFormData({ ...formData, batchTargetWeightKg: Number(e.target.value) })}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 tabular-nums font-bold"
              />
              <span className="text-[9px] text-slate-400">Target 2.2 kg</span>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Feed Min Reserve</label>
              <input
                type="number"
                value={formData.feedLowStockThresholdBags}
                onChange={(e) => setFormData({ ...formData, feedLowStockThresholdBags: Number(e.target.value) })}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 tabular-nums font-bold text-amber-700"
              />
              <span className="text-[9px] text-slate-400">Bags</span>
            </div>
          </div>
        </div>

        {/* SQL Server API Configuration */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-slate-800 text-[11px] uppercase tracking-tight">
              SQL Server Backend API Bridge
            </h3>
          </div>
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
              ASP.NET Core / Web API REST Endpoint
            </label>
            <input
              type="url"
              value={formData.sqlServerApiUrl}
              onChange={(e) => setFormData({ ...formData, sqlServerApiUrl: e.target.value })}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 font-mono text-[11px]"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Synchronizes with Microsoft SQL Server database securely via JWT-authenticated REST controllers.
            </p>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0d2b45] hover:bg-blue-900 text-white font-semibold text-xs shadow-sm"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Update Farm Settings</span>
          </button>
        </div>
      </form>

      {/* Database Backup & Disaster Recovery */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3 text-xs">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Database className="w-4 h-4 text-purple-700" />
          <h2 className="font-bold text-slate-900">Database Backup & Disaster Recovery</h2>
        </div>

        <p className="text-slate-600 text-[11px]">
          Download a complete JSON database snapshot of all sheds, batches, feed inventory, customer ledgers, and transactions.
        </p>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleDownloadBackup}
            className="py-2 px-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold flex items-center justify-center gap-1.5"
          >
            <Download className="w-4 h-4 text-blue-700" />
            <span>Download Backup</span>
          </button>

          <button
            type="button"
            onClick={() => setShowBackupModal(true)}
            className="py-2 px-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold flex items-center justify-center gap-1.5"
          >
            <Upload className="w-4 h-4 text-purple-700" />
            <span>Restore Backup</span>
          </button>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">Reset sample dataset:</span>
          <button
            type="button"
            onClick={() => {
              if (confirm('Reset entire application to initial EC Farm Pro factory dataset? All test records will be refreshed.')) {
                onResetFactoryData();
              }
            }}
            className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset to Factory Data</span>
          </button>
        </div>
      </div>

      {/* Modal: Restore JSON Backup */}
      {showBackupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-sm select-none no-print">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[90vh] border border-slate-200">
            <div className="bg-[#0d2b45] text-white p-3.5 flex items-center justify-between">
              <h3 className="font-bold text-sm text-white">Restore JSON Database</h3>
              <button
                type="button"
                onClick={() => setShowBackupModal(false)}
                className="p-1 rounded-lg text-slate-300 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleImportSubmit} className="p-4 space-y-3 text-xs">
              <p className="text-slate-600 text-[11px]">
                Paste your exported EC FARM PRO JSON backup content below to restore all tables:
              </p>
              <textarea
                rows={8}
                required
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder='{"appName": "EC FARM PRO", ...}'
                className="w-full p-2.5 rounded-lg border border-slate-300 font-mono text-[10px]"
              />

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowBackupModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-purple-700 hover:bg-purple-800 rounded-lg"
                >
                  Parse & Restore
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
