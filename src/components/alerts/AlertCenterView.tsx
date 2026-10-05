import React from 'react';
import {
  Bell,
  AlertTriangle,
  Wheat,
  Syringe,
  Layers,
  Thermometer,
  CheckCircle2,
  Share2,
  Clock,
} from 'lucide-react';
import { FarmAlert } from '../../types';
import { formatDate } from '../../utils/calculations';
import { shareViaWhatsApp } from '../../utils/export';

interface AlertCenterViewProps {
  alerts: FarmAlert[];
  onMarkAsRead: (alertId: string) => void;
  onNavigateToModule: (module: any) => void;
}

export const AlertCenterView: React.FC<AlertCenterViewProps> = ({
  alerts,
  onMarkAsRead,
  onNavigateToModule,
}) => {
  const getIcon = (type: FarmAlert['type']) => {
    switch (type) {
      case 'LOW_FEED':
        return <Wheat className="w-5 h-5 text-amber-600" />;
      case 'VACCINATION_DUE':
        return <Syringe className="w-5 h-5 text-blue-600" />;
      case 'BATCH_CLOSING':
        return <Layers className="w-5 h-5 text-emerald-600" />;
      case 'HIGH_TEMP':
        return <Thermometer className="w-5 h-5 text-rose-600" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-rose-600" />;
    }
  };

  const handleShareAlert = (a: FarmAlert) => {
    const text = `*EC FARM PRO ALERT*
${a.title}
--------------------------
${a.message}
Date: ${formatDate(a.date)}
Severity: ${a.severity.toUpperCase()}
Action required on farm immediately.`;
    shareViaWhatsApp(text);
  };

  return (
    <div className="space-y-4 pb-20 select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-base font-bold text-slate-900 leading-tight">Farm Alert Center</h1>
          <p className="text-xs text-slate-500">Live operational warnings & scheduled tasks</p>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold">
          {alerts.filter((a) => !a.read).length} Unresolved
        </span>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {alerts.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400">
            <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2" />
            <p className="text-xs font-semibold text-slate-700">All Farm Systems Normal</p>
            <p className="text-[11px] text-slate-500 mt-0.5">No critical feed, vaccination, or mortality warnings.</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-2xl border shadow-xs space-y-2.5 transition-all ${
                alert.read
                  ? 'bg-white border-slate-200 opacity-75'
                  : alert.severity === 'critical'
                  ? 'bg-rose-50/50 border-rose-200'
                  : alert.severity === 'warning'
                  ? 'bg-amber-50/50 border-amber-200'
                  : 'bg-blue-50/50 border-blue-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs shrink-0 mt-0.5">
                  {getIcon(alert.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xs font-bold text-slate-900 truncate">{alert.title}</h3>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase shrink-0 ${
                        alert.severity === 'critical'
                          ? 'bg-rose-600 text-white'
                          : alert.severity === 'warning'
                          ? 'bg-amber-600 text-white'
                          : 'bg-blue-600 text-white'
                      }`}
                    >
                      {alert.severity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 mt-1 leading-relaxed">{alert.message}</p>
                  <p className="text-[10px] text-slate-400 mt-1.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatDate(alert.date)}</span>
                    {alert.relatedBatchNo && (
                      <span className="font-semibold text-slate-600">· {alert.relatedBatchNo}</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200/60">
                <button
                  type="button"
                  onClick={() => handleShareAlert(alert)}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-medium flex items-center gap-1"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>
                {!alert.read && (
                  <button
                    type="button"
                    onClick={() => onMarkAsRead(alert.id)}
                    className="px-3 py-1.5 rounded-lg bg-[#0d2b45] hover:bg-blue-900 text-white text-xs font-semibold shadow-xs"
                  >
                    Acknowledge
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
