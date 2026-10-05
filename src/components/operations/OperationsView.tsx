import React, { useState } from 'react';
import {
  ClipboardEdit,
  Wheat,
  Syringe,
  TrendingUp,
  Plus,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Thermometer,
  Wind,
  Droplets,
  Layers,
  ChevronRight,
  X,
} from 'lucide-react';
import {
  Batch,
  Shed,
  DailyLogRecord,
  FeedTypeItem,
  FeedStockEntry,
  VaccinationScheduleRecord,
  VaccineMasterItem,
  Supplier,
  User,
} from '../../types';
import { formatCurrency, formatDate } from '../../utils/calculations';

interface OperationsViewProps {
  batches: Batch[];
  sheds: Shed[];
  dailyLogs: DailyLogRecord[];
  feedTypes: FeedTypeItem[];
  feedPurchases: FeedStockEntry[];
  vaccinationSchedules: VaccinationScheduleRecord[];
  vaccines: VaccineMasterItem[];
  suppliers: Supplier[];
  currentUser: User;
  onSaveDailyLog: (log: DailyLogRecord) => void;
  onSaveFeedPurchase: (entry: FeedStockEntry) => void;
  onSaveVaccination: (record: VaccinationScheduleRecord) => void;
}

export const OperationsView: React.FC<OperationsViewProps> = ({
  batches,
  sheds,
  dailyLogs,
  feedTypes,
  feedPurchases,
  vaccinationSchedules,
  vaccines,
  suppliers,
  currentUser,
  onSaveDailyLog,
  onSaveFeedPurchase,
  onSaveVaccination,
}) => {
  const [activeTab, setActiveTab] = useState<'daily' | 'feed-entry' | 'vaccines'>('daily');
  const [showDailyModal, setShowDailyModal] = useState(false);
  const [showFeedModal, setShowFeedModal] = useState(false);
  const [showVaccineModal, setShowVaccineModal] = useState(false);

  const runningBatches = batches.filter((b) => b.status === 'Running');

  // Daily Log Form State
  const [logBatchId, setLogBatchId] = useState(runningBatches[0]?.id || '');
  const [logDate, setLogDate] = useState(new Date().toISOString().slice(0, 10));
  const [mortality, setMortality] = useState(8);
  const [culls, setCulls] = useState(1);
  const [selectedFeedType, setSelectedFeedType] = useState('Broiler Finisher 1 (Pellets)');
  const [feedBags, setFeedBags] = useState(30);
  const [waterLiters, setWaterLiters] = useState(3800);
  const [avgWeightGrams, setAvgWeightGrams] = useState(1950);
  const [roomTemp, setRoomTemp] = useState(26.2);
  const [roomHumidity, setRoomHumidity] = useState(62);
  const [fansRunning, setFansRunning] = useState(8);
  const [padRunning, setPadRunning] = useState(true);
  const [medicines, setMedicines] = useState('');
  const [remarks, setRemarks] = useState('Flock active, uniform feeding behavior.');

  // Feed Purchase Form State
  const [fpFeedTypeId, setFpFeedTypeId] = useState(feedTypes[0]?.id || '');
  const [fpInvoiceNo, setFpInvoiceNo] = useState(`GA-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
  const [fpSupplierId, setFpSupplierId] = useState(suppliers[0]?.id || '');
  const [fpBags, setFpBags] = useState(100);
  const [fpRate, setFpRate] = useState(2140);
  const [fpVehicleNo, setFpVehicleNo] = useState('AP 39 TT 1024');

  // Vaccine Execution State
  const [vacScheduleId, setVacScheduleId] = useState('');
  const [administeredBy, setAdministeredBy] = useState(currentUser.name);
  const [lotNo, setLotNo] = useState(`LOT-VAC-${Math.floor(100 + Math.random() * 900)}`);
  const [birdsCovered, setBirdsCovered] = useState(14000);

  const handleDailySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const batch = batches.find((b) => b.id === logBatchId);
    if (!batch) return;

    const log: DailyLogRecord = {
      id: `log-${Date.now()}`,
      date: logDate,
      batchId: batch.id,
      batchNo: batch.batchNo,
      shedId: batch.shedId,
      shedNo: batch.shedNo,
      birdAgeDays: batch.currentAgeDays,
      mortalityCount: Number(mortality),
      cullsCount: Number(culls),
      feedType: selectedFeedType,
      feedConsumedBags: Number(feedBags),
      feedConsumedKg: Number(feedBags) * 50,
      waterConsumedLiters: Number(waterLiters),
      averageBirdWeightGrams: Number(avgWeightGrams),
      roomTemperatureC: Number(roomTemp),
      roomHumidityPercent: Number(roomHumidity),
      fansRunningCount: Number(fansRunning),
      coolingPadRunning: padRunning,
      medicinesGiven: medicines,
      healthRemarks: remarks,
      recordedBy: currentUser.name,
    };

    onSaveDailyLog(log);
    setShowDailyModal(false);
  };

  const handleFeedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ft = feedTypes.find((f) => f.id === fpFeedTypeId);
    const sup = suppliers.find((s) => s.id === fpSupplierId);

    const entry: FeedStockEntry = {
      id: `fse-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      invoiceNo: fpInvoiceNo,
      feedTypeId: fpFeedTypeId,
      feedTypeName: ft ? ft.name : 'Broiler Feed',
      bagsCount: Number(fpBags),
      weightPerBagKg: 50,
      totalWeightKg: Number(fpBags) * 50,
      ratePerBag: Number(fpRate),
      totalAmount: Number(fpBags) * Number(fpRate),
      supplierId: fpSupplierId,
      supplierName: sup ? sup.name : 'Feed Supplier',
      vehicleNo: fpVehicleNo,
      paymentStatus: 'Paid',
      notes: 'Direct stock delivery',
    };

    onSaveFeedPurchase(entry);
    setShowFeedModal(false);
  };

  const handleVaccineComplete = (rec: VaccinationScheduleRecord) => {
    const updated: VaccinationScheduleRecord = {
      ...rec,
      status: 'Completed',
      administeredDate: new Date().toISOString().slice(0, 10),
      administeredBy: currentUser.name,
      batchLotNo: `LOT-AP-${Math.floor(100 + Math.random() * 900)}`,
      birdsCovered: 14500,
    };
    onSaveVaccination(updated);
  };

  return (
    <div className="space-y-4 pb-20 select-none">
      {/* Top Bar with Segmented Control */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-base font-bold text-slate-900 leading-tight">Daily Farm Operations</h1>
          <p className="text-xs text-slate-500">Record daily flock logs, feed, and vaccines</p>
        </div>

        {activeTab === 'daily' && (
          <button
            type="button"
            onClick={() => setShowDailyModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0d2b45] hover:bg-blue-900 text-white text-xs font-semibold shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Log Daily</span>
          </button>
        )}

        {activeTab === 'feed-entry' && (
          <button
            type="button"
            onClick={() => setShowFeedModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Receive Feed</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-slate-200/70 rounded-xl text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('daily')}
          className={`flex-1 py-1.5 rounded-lg transition-all ${
            activeTab === 'daily'
              ? 'bg-white text-slate-900 font-bold shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Daily Logs ({dailyLogs.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('feed-entry')}
          className={`flex-1 py-1.5 rounded-lg transition-all ${
            activeTab === 'feed-entry'
              ? 'bg-white text-slate-900 font-bold shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Feed Entry ({feedPurchases.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('vaccines')}
          className={`flex-1 py-1.5 rounded-lg transition-all ${
            activeTab === 'vaccines'
              ? 'bg-white text-slate-900 font-bold shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Vaccinations ({vaccinationSchedules.length})
        </button>
      </div>

      {/* TAB 1: DAILY SHED LOGS */}
      {activeTab === 'daily' && (
        <div className="space-y-3">
          {dailyLogs.map((log) => (
            <div
              key={log.id}
              className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">{log.batchNo}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200">
                    {log.shedNo}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{formatDate(log.date)}</span>
                  <span className="text-slate-300">·</span>
                  <span className="font-bold text-slate-800">Day {log.birdAgeDays}</span>
                </div>
              </div>

              {/* 4 Metric Boxes */}
              <div className="grid grid-cols-4 gap-1.5 p-2 bg-slate-50 rounded-xl text-center text-[10px]">
                <div>
                  <span className="text-slate-400 block uppercase">Mortality</span>
                  <span className="text-xs font-bold text-rose-600 tabular-nums">
                    {log.mortalityCount} <span className="text-[9px] text-slate-400">+{log.cullsCount}c</span>
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase">Feed Intake</span>
                  <span className="text-xs font-bold text-blue-900 tabular-nums">
                    {log.feedConsumedBags} <span className="text-[9px] text-slate-400">bags</span>
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase">Water Intake</span>
                  <span className="text-xs font-bold text-emerald-700 tabular-nums">
                    {log.waterConsumedLiters}L
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase">Avg Weight</span>
                  <span className="text-xs font-bold text-purple-700 tabular-nums">
                    {log.averageBirdWeightGrams}g
                  </span>
                </div>
              </div>

              {/* Climate strip */}
              <div className="flex items-center justify-between text-[11px] text-slate-600 bg-blue-50/50 p-2 rounded-lg border border-blue-100">
                <span className="flex items-center gap-1">
                  <Thermometer className="w-3 h-3 text-rose-500" />
                  {log.roomTemperatureC}°C
                </span>
                <span className="flex items-center gap-1">
                  <Droplets className="w-3 h-3 text-blue-500" />
                  {log.roomHumidityPercent}% RH
                </span>
                <span className="flex items-center gap-1">
                  <Wind className="w-3 h-3 text-emerald-600" />
                  {log.fansRunningCount} Fans
                </span>
              </div>

              {log.healthRemarks && (
                <p className="text-[11px] text-slate-600 italic">
                  "{log.healthRemarks}"
                </p>
              )}

              <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-100 flex items-center justify-between">
                <span>Recorded by: {log.recordedBy}</span>
                <span>Feed: {log.feedType}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: FEED STOCK ENTRIES */}
      {activeTab === 'feed-entry' && (
        <div className="space-y-3">
          {feedPurchases.map((fse) => (
            <div
              key={fse.id}
              className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">{fse.feedTypeName}</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {fse.paymentStatus}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Inv: <strong className="text-slate-800">{fse.invoiceNo}</strong></span>
                <span>Supplier: <strong className="text-slate-800">{fse.supplierName}</strong></span>
              </div>

              <div className="grid grid-cols-3 gap-2 p-2 bg-slate-50 rounded-xl text-center text-[10px]">
                <div>
                  <span className="text-slate-400 block uppercase">Bags</span>
                  <span className="text-xs font-bold text-slate-900">{fse.bagsCount} bags</span>
                  <span className="text-[9px] text-slate-400">{fse.totalWeightKg} kg</span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase">Rate / Bag</span>
                  <span className="text-xs font-bold text-blue-900">{formatCurrency(fse.ratePerBag)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase">Total Cost</span>
                  <span className="text-xs font-bold text-emerald-700">{formatCurrency(fse.totalAmount)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                <span>Vehicle: {fse.vehicleNo}</span>
                <span>Date: {formatDate(fse.date)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: VACCINATIONS */}
      {activeTab === 'vaccines' && (
        <div className="space-y-3">
          {vaccinationSchedules.map((vs) => {
            const isCompleted = vs.status === 'Completed';

            return (
              <div
                key={vs.id}
                className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{vs.vaccineName}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-900">
                      Day {vs.targetAgeDays}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {vs.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Batch: <strong className="text-slate-800">{vs.batchNo} ({vs.shedNo})</strong></span>
                  <span>Scheduled: {formatDate(vs.scheduledDate)}</span>
                </div>

                {isCompleted ? (
                  <div className="p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Administered by: {vs.administeredBy}</p>
                      <p className="text-[10px] text-emerald-700">Lot: {vs.batchLotNo || 'LOT-VERIFIED'}</p>
                    </div>
                    <span className="font-bold text-xs">{vs.birdsCovered?.toLocaleString()} birds</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-xs text-amber-700 font-medium flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Due on schedule
                    </span>
                    <button
                      type="button"
                      onClick={() => handleVaccineComplete(vs)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1 shadow-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Administered</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: New Daily Shed Log */}
      {showDailyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-sm select-none no-print">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[90vh] border border-slate-200">
            <div className="bg-[#0d2b45] text-white p-3.5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-white">Log Daily Farm Record</h3>
                <p className="text-[10px] text-blue-200">Mortality, Feed, Water & EC Climate</p>
              </div>
              <button
                type="button"
                onClick={() => setShowDailyModal(false)}
                className="p-1 rounded-lg text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDailySubmit} className="p-4 overflow-y-auto space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Batch *</label>
                  <select
                    value={logBatchId}
                    onChange={(e) => setLogBatchId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold text-slate-800"
                  >
                    {runningBatches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.batchNo} ({b.shedNo})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Record Date *</label>
                  <input
                    type="date"
                    required
                    value={logDate}
                    onChange={(e) => setLogDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Daily Mortality (Birds)</label>
                  <input
                    type="number"
                    min={0}
                    value={mortality}
                    onChange={(e) => setMortality(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold text-rose-600 tabular-nums"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Culls (Weak Birds)</label>
                  <input
                    type="number"
                    min={0}
                    value={culls}
                    onChange={(e) => setCulls(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold text-slate-700 tabular-nums"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Feed Consumed (Bags)</label>
                  <input
                    type="number"
                    min={0}
                    value={feedBags}
                    onChange={(e) => setFeedBags(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold text-blue-900 tabular-nums"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Water Intake (Liters)</label>
                  <input
                    type="number"
                    min={0}
                    value={waterLiters}
                    onChange={(e) => setWaterLiters(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold text-emerald-700 tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Feed Type Consumed</label>
                <select
                  value={selectedFeedType}
                  onChange={(e) => setSelectedFeedType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800"
                >
                  <option value="Broiler Pre-Starter (Crumbs)">Broiler Pre-Starter (Crumbs)</option>
                  <option value="Broiler Starter (Pellets)">Broiler Starter (Pellets)</option>
                  <option value="Broiler Finisher 1 (Pellets)">Broiler Finisher 1 (Pellets)</option>
                  <option value="Broiler Finisher 2 (Dense Pellets)">Broiler Finisher 2 (Dense Pellets)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Sample Avg Weight (g)</label>
                  <input
                    type="number"
                    value={avgWeightGrams}
                    onChange={(e) => setAvgWeightGrams(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold text-purple-700 tabular-nums"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Room Temp (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={roomTemp}
                    onChange={(e) => setRoomTemp(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold tabular-nums"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Fans Running</label>
                  <input
                    type="number"
                    value={fansRunning}
                    onChange={(e) => setFansRunning(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Humidity (% RH)</label>
                  <input
                    type="number"
                    value={roomHumidity}
                    onChange={(e) => setRoomHumidity(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Medicines / Health Notes</label>
                <input
                  type="text"
                  value={medicines}
                  onChange={(e) => setMedicines(e.target.value)}
                  placeholder="Vitamins, probiotics, water sanitizers..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowDailyModal(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#0d2b45] hover:bg-blue-900 rounded-lg shadow-sm"
                >
                  Commit Daily Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Feed Stock Receipt */}
      {showFeedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-sm select-none no-print">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[90vh] border border-slate-200">
            <div className="bg-[#0d2b45] text-white p-3.5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-white">Feed Stock Receipt Entry</h3>
                <p className="text-[10px] text-blue-200">Add feed purchase bags to inventory</p>
              </div>
              <button
                type="button"
                onClick={() => setShowFeedModal(false)}
                className="p-1 rounded-lg text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFeedSubmit} className="p-4 overflow-y-auto space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Feed Type *</label>
                <select
                  value={fpFeedTypeId}
                  onChange={(e) => setFpFeedTypeId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold text-slate-800"
                >
                  {feedTypes.map((ft) => (
                    <option key={ft.id} value={ft.id}>
                      {ft.name} (50kg bag)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Invoice Number</label>
                  <input
                    type="text"
                    required
                    value={fpInvoiceNo}
                    onChange={(e) => setFpInvoiceNo(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Supplier</label>
                  <select
                    value={fpSupplierId}
                    onChange={(e) => setFpSupplierId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  >
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Bags Received (50kg)</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={fpBags}
                    onChange={(e) => setFpBags(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold tabular-nums"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Rate per Bag (₹)</label>
                  <input
                    type="number"
                    required
                    value={fpRate}
                    onChange={(e) => setFpRate(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold tabular-nums"
                  />
                </div>
              </div>

              {/* Total preview */}
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-amber-900 font-semibold uppercase">Total Invoice Valuation</p>
                  <p className="text-base font-bold text-amber-950 tabular-nums">
                    {formatCurrency(fpBags * fpRate)}
                  </p>
                </div>
                <span className="text-[11px] font-semibold text-amber-800">
                  {(fpBags * 50).toLocaleString()} kg total
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Delivery Truck / Vehicle No</label>
                <input
                  type="text"
                  value={fpVehicleNo}
                  onChange={(e) => setFpVehicleNo(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowFeedModal(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-amber-700 hover:bg-amber-800 rounded-lg shadow-sm"
                >
                  Save Feed Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
