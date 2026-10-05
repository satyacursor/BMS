import React, { useState } from 'react';
import { Wallet, Plus, Check } from 'lucide-react';
import { ExpenseCategory } from '../../types';

interface ExpenseMasterViewProps {
  categories: ExpenseCategory[];
}

const DEFAULT_CATEGORIES: Array<{ name: ExpenseCategory; desc: string }> = [
  { name: 'Electricity & EB Bill', desc: 'Commercial HT agricultural grid power consumption' },
  { name: 'Generator Diesel', desc: 'HSD Diesel fuel for backup silent generator sets' },
  { name: 'Gas Brooding / Heating', desc: 'LPG gas cylinders and space heating brooding equipment' },
  { name: 'Medicines & Sanitizers', desc: 'Sanitizers, formalin, litter treatments, electrolytes' },
  { name: 'Rice Husk / Litter Material', desc: 'Dry paddy husk and bed conditioning material' },
  { name: 'Equipment & Maintenance', desc: 'Cooling pad servicing, exhaust fan belts, nipple drinkers' },
  { name: 'Labour & Wages', desc: 'Daily casual wages and contract handling' },
  { name: 'Transport & Freight', desc: 'Feed haulage, chick transport logistics' },
  { name: 'Farm Miscellaneous', desc: 'Office refreshments, stationery, general supplies' },
];

export const ExpenseMasterView: React.FC<ExpenseMasterViewProps> = () => {
  return (
    <div className="space-y-4 pb-20 select-none">
      <div>
        <h1 className="text-base font-bold text-slate-900 leading-tight">Expense Categories Master</h1>
        <p className="text-xs text-slate-500">Configured farm cost centers & overhead heads</p>
      </div>

      <div className="space-y-2.5">
        {DEFAULT_CATEGORIES.map((cat, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between"
          >
            <div>
              <h3 className="text-xs font-bold text-slate-900">{cat.name}</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">{cat.desc}</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 shrink-0">
              Active Head
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
