import React, { useState } from 'react';
import { Plus, X, ClipboardEdit, Receipt, Wheat, Wallet, Syringe } from 'lucide-react';

interface QuickActionFABProps {
  onAction: (actionType: 'daily-log' | 'bird-sale' | 'feed-entry' | 'expense' | 'vaccine') => void;
}

export const QuickActionFAB: React.FC<QuickActionFABProps> = ({ onAction }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (actionType: 'daily-log' | 'bird-sale' | 'feed-entry' | 'expense' | 'vaccine') => {
    setIsOpen(false);
    onAction(actionType);
  };

  return (
    <>
      {/* Dimmed backdrop when FAB is open */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity no-print"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* FAB Container */}
      <div className="fixed right-4 bottom-20 z-40 flex flex-col items-end select-none no-print">
        {/* Speed Dial Menu Items */}
        {isOpen && (
          <div className="flex flex-col items-end space-y-2.5 mb-3 animate-in fade-in slide-in-from-bottom-4 duration-150">
            <button
              type="button"
              onClick={() => handleSelect('daily-log')}
              className="flex items-center gap-2.5 bg-white text-slate-800 px-3.5 py-2 rounded-full shadow-lg border border-slate-200 active:scale-95 transition-transform"
            >
              <span className="text-xs font-semibold">Daily Shed Log (Mortality & Feed)</span>
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                <ClipboardEdit className="w-4 h-4" />
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleSelect('bird-sale')}
              className="flex items-center gap-2.5 bg-white text-slate-800 px-3.5 py-2 rounded-full shadow-lg border border-slate-200 active:scale-95 transition-transform"
            >
              <span className="text-xs font-semibold">Bird Sale (Weighbridge Slip)</span>
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Receipt className="w-4 h-4" />
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleSelect('feed-entry')}
              className="flex items-center gap-2.5 bg-white text-slate-800 px-3.5 py-2 rounded-full shadow-lg border border-slate-200 active:scale-95 transition-transform"
            >
              <span className="text-xs font-semibold">Feed Stock Receipt</span>
              <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center shrink-0">
                <Wheat className="w-4 h-4" />
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleSelect('vaccine')}
              className="flex items-center gap-2.5 bg-white text-slate-800 px-3.5 py-2 rounded-full shadow-lg border border-slate-200 active:scale-95 transition-transform"
            >
              <span className="text-xs font-semibold">Administer Vaccine</span>
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <Syringe className="w-4 h-4" />
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleSelect('expense')}
              className="flex items-center gap-2.5 bg-white text-slate-800 px-3.5 py-2 rounded-full shadow-lg border border-slate-200 active:scale-95 transition-transform"
            >
              <span className="text-xs font-semibold">Add Farm Expense</span>
              <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0">
                <Wallet className="w-4 h-4" />
              </div>
            </button>
          </div>
        )}

        {/* Primary FAB Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close actions' : 'Add farm transaction'}
          className={`w-13 h-13 rounded-full flex items-center justify-center text-white shadow-xl transition-all duration-200 active:scale-90 ${
            isOpen ? 'bg-slate-800 rotate-45' : 'bg-[#0d2b45] hover:bg-blue-900 ring-2 ring-emerald-400/50'
          }`}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
        </button>
      </div>
    </>
  );
};
