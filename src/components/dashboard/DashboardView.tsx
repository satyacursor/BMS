import React from 'react';
import {
  Layers,
  Wheat,
  Bell,
  Building2,
  TrendingUp,
  Activity,
  AlertTriangle,
  ChevronRight,
  Thermometer,
  Wind,
  Droplets,
  Calendar,
  ArrowUpRight,
  PlusCircle,
  FileText,
  Clock,
} from 'lucide-react';
import { Batch, Shed, FarmAlert, FeedStockSummary, DailyLogRecord, User } from '../../types';
import { formatCurrency, formatNumber, formatDate } from '../../utils/calculations';
import { ActiveModule } from '../layout/NavDrawer';

interface DashboardViewProps {
  batches: Batch[];
  sheds: Shed[];
  feedStock: FeedStockSummary[];
  alerts: FarmAlert[];
  dailyLogs: DailyLogRecord[];
  currentUser: User;
  onNavigate: (module: ActiveModule) => void;
  onSelectBatch: (batch: Batch) => void;
  onQuickLog: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  batches,
  sheds,
  feedStock,
  alerts,
  dailyLogs,
  currentUser,
  onNavigate,
  onSelectBatch,
  onQuickLog,
}) => {
  const runningBatches = batches.filter((b) => b.status === 'Running');
  const closedBatches = batches.filter((b) => b.status === 'Closed');

  const totalLiveBirds = runningBatches.reduce((sum, b) => sum + b.currentLiveBirds, 0);
  const totalFeedBags = feedStock.reduce((sum, f) => sum + f.currentBags, 0);
  const totalFeedValuation = feedStock.reduce((sum, f) => sum + f.totalValuation, 0);
  const activeShedsCount = sheds.filter((s) => s.status === 'Active').length;
  const unreadAlerts = alerts.filter((a) => !a.read);

  // Today's latest logs
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayLogs = dailyLogs.filter((l) => l.date === todayStr || l.date === '2026-10-05');
  const todayMortality = todayLogs.reduce((sum, l) => sum + l.mortalityCount, 0);
  const todayFeedBags = todayLogs.reduce((sum, l) => sum + l.feedConsumedBags, 0);
  const todayWaterLiters = todayLogs.reduce((sum, l) => sum + l.waterConsumedLiters, 0);

  return (
    <div className="space-y-4 pb-20 select-none">
      {/* Top Banner / Welcome Strip */}
      <div className="bg-[#0d2b45] text-white p-4 rounded-2xl shadow-sm border border-blue-900/60">
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-[10px] font-bold tracking-wider text-emerald-400 uppercase">
              Environment Controlled Operations
            </span>
            <h1 className="text-lg font-bold tracking-tight text-white">
              Farm Dashboard
            </h1>
          </div>
          <button
            type="button"
            onClick={onQuickLog}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-semibold shadow-xs transition-transform"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Daily Log</span>
          </button>
        </div>

        {/* Live Farm Status Ribbon */}
        <div className="flex items-center justify-between text-xs text-blue-200 border-t border-blue-800/60 pt-2.5 mt-2.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-white">4 EC Sheds Online</span>
          </div>
          <span className="text-[11px] text-blue-300">
            {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
          </span>
        </div>
      </div>

      {/* 4 Primary Mobile KPI Cards */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Card 1: Live Birds */}
        <button
          type="button"
          onClick={() => onNavigate('master-batches')}
          className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs text-left hover:border-blue-400 active:scale-98 transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between w-full mb-1">
            <span className="text-slate-500 text-[11px] font-semibold uppercase tracking-tight">
              Live Birds
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-xl font-extrabold text-slate-900 tracking-tight tabular-nums">
              {formatNumber(totalLiveBirds)}
            </p>
            <p className="text-[11px] font-medium text-emerald-600 flex items-center gap-1 mt-0.5">
              <span>Across {runningBatches.length} Batches</span>
              <ChevronRight className="w-3 h-3 ml-auto text-slate-400" />
            </p>
          </div>
        </button>

        {/* Card 2: Running Batches */}
        <button
          type="button"
          onClick={() => onNavigate('trans-daily')}
          className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs text-left hover:border-blue-400 active:scale-98 transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between w-full mb-1">
            <span className="text-slate-500 text-[11px] font-semibold uppercase tracking-tight">
              Running Batches
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-xl font-extrabold text-slate-900 tracking-tight tabular-nums">
              {runningBatches.length} <span className="text-xs font-normal text-slate-500">/ {batches.length}</span>
            </p>
            <p className="text-[11px] font-medium text-slate-600 flex items-center justify-between mt-0.5">
              <span>{activeShedsCount} Sheds Active</span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
            </p>
          </div>
        </button>

        {/* Card 3: Feed Stock */}
        <button
          type="button"
          onClick={() => onNavigate('inventory')}
          className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs text-left hover:border-amber-400 active:scale-98 transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between w-full mb-1">
            <span className="text-slate-500 text-[11px] font-semibold uppercase tracking-tight">
              Feed Stock
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Wheat className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-xl font-extrabold text-slate-900 tracking-tight tabular-nums">
              {totalFeedBags} <span className="text-xs font-normal text-slate-500">Bags</span>
            </p>
            <p className="text-[11px] font-medium text-slate-600 flex items-center justify-between mt-0.5">
              <span>{formatCurrency(totalFeedValuation)}</span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
            </p>
          </div>
        </button>

        {/* Card 4: Farm Alerts */}
        <button
          type="button"
          onClick={() => onNavigate('alerts')}
          className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs text-left hover:border-rose-400 active:scale-98 transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between w-full mb-1">
            <span className="text-slate-500 text-[11px] font-semibold uppercase tracking-tight">
              Alerts
            </span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-xl font-extrabold text-rose-600 tracking-tight tabular-nums">
              {unreadAlerts.length} <span className="text-xs font-normal text-slate-500">Active</span>
            </p>
            <p className="text-[11px] font-medium text-rose-700 flex items-center justify-between mt-0.5">
              <span>Feed & Vaccine</span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
            </p>
          </div>
        </button>
      </div>

      {/* Today's Farm Activity Card */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-700" />
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-tight">
              Today's Field Activity Summary
            </h2>
          </div>
          <span className="text-[10px] font-semibold text-slate-500">
            {todayLogs.length} Sheds Recorded
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-500 font-medium block">Daily Mortality</span>
            <span className="text-base font-bold text-rose-600 tabular-nums">{todayMortality}</span>
            <span className="text-[9px] text-slate-400 block">Birds</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-500 font-medium block">Feed Consumed</span>
            <span className="text-base font-bold text-blue-900 tabular-nums">{todayFeedBags}</span>
            <span className="text-[9px] text-slate-400 block">{todayFeedBags * 50} kg</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-500 font-medium block">Water Intake</span>
            <span className="text-base font-bold text-emerald-700 tabular-nums">{todayWaterLiters}</span>
            <span className="text-[9px] text-slate-400 block">Liters</span>
          </div>
        </div>
      </div>

      {/* Active Running Batches Showcase */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Active EC Shed Batches ({runningBatches.length})
          </h2>
          <button
            type="button"
            onClick={() => onNavigate('master-batches')}
            className="text-xs font-semibold text-blue-800 hover:text-blue-900 flex items-center gap-0.5"
          >
            <span>All Batches</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2.5">
          {runningBatches.map((batch) => {
            const ageDays = batch.currentAgeDays;
            const targetDays = 36;
            const progressPct = Math.min(100, Math.round((ageDays / targetDays) * 100));

            return (
              <div
                key={batch.id}
                onClick={() => onSelectBatch(batch)}
                className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 shadow-xs active:scale-99 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{batch.batchNo}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-900 border border-blue-200">
                      {batch.shedNo}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700">
                    Day {batch.currentAgeDays} of {targetDays}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-2.5">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>

                {/* 3 Metric Points */}
                <div className="grid grid-cols-3 gap-2 text-center text-[11px] pt-1 border-t border-slate-100">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Live Birds</span>
                    <span className="font-bold text-slate-800 tabular-nums">
                      {formatNumber(batch.currentLiveBirds)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Avg Body Wt</span>
                    <span className="font-bold text-blue-900 tabular-nums">
                      {batch.averageWeightKg} kg
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Current FCR</span>
                    <span className="font-bold text-emerald-700 tabular-nums">
                      {batch.currentFcr}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* EC Climate & Environmental Status */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-emerald-600" />
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-tight">
              EC Shed Climate Controllers
            </h2>
          </div>
          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
            Optimal Tunnel Ventilation
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
            <Wind className="w-4 h-4 mx-auto text-blue-600 mb-1" />
            <span className="text-[10px] text-slate-500 block">Exhaust Fans</span>
            <span className="font-bold text-slate-800">28 / 32 Active</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
            <Thermometer className="w-4 h-4 mx-auto text-rose-500 mb-1" />
            <span className="text-[10px] text-slate-500 block">Avg Room Temp</span>
            <span className="font-bold text-slate-800">26.2 °C</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
            <Droplets className="w-4 h-4 mx-auto text-emerald-600 mb-1" />
            <span className="text-[10px] text-slate-500 block">Humidity</span>
            <span className="font-bold text-slate-800">62% RH</span>
          </div>
        </div>
      </div>

      {/* Quick Access to Main Modules */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <h2 className="text-xs font-bold text-slate-800 uppercase tracking-tight mb-3">
          Quick Farm Actions
        </h2>
        <div className="grid grid-cols-4 gap-2 text-center">
          <button
            type="button"
            onClick={() => onNavigate('trans-daily')}
            className="flex flex-col items-center p-2 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0d2b45] flex items-center justify-center mb-1">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-semibold text-slate-700">Daily Log</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('trans-sales')}
            className="flex flex-col items-center p-2 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-1">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-semibold text-slate-700">Bird Sale</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('inventory')}
            className="flex flex-col items-center p-2 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-1">
              <Wheat className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-semibold text-slate-700">Feed Stock</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('reports')}
            className="flex flex-col items-center p-2 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-1">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-semibold text-slate-700">Reports</span>
          </button>
        </div>
      </div>
    </div>
  );
};
