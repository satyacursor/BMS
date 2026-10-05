import React, { useState } from 'react';
import {
  UserCheck,
  Plus,
  Calendar,
  CheckCircle2,
  Printer,
  MessageSquare,
  Search,
  DollarSign,
  X,
  CreditCard,
  Clock,
} from 'lucide-react';
import { Employee, AttendanceRecord, SalarySlipRecord, AttendanceStatus, FarmSettings, User } from '../../types';
import { formatCurrency, formatDate } from '../../utils/calculations';

interface HrPayrollViewProps {
  employees: Employee[];
  attendance: AttendanceRecord[];
  salarySlips: SalarySlipRecord[];
  settings: FarmSettings;
  currentUser: User;
  onSaveEmployee: (emp: Employee) => void;
  onSaveAttendance: (records: AttendanceRecord[]) => void;
  onSaveSalarySlip: (slip: SalarySlipRecord) => void;
  onOpenSalarySlipModal: (slip: SalarySlipRecord) => void;
}

export const HrPayrollView: React.FC<HrPayrollViewProps> = ({
  employees,
  attendance,
  salarySlips,
  settings,
  currentUser,
  onSaveEmployee,
  onSaveAttendance,
  onSaveSalarySlip,
  onOpenSalarySlipModal,
}) => {
  const [activeTab, setActiveTab] = useState<'employees' | 'attendance' | 'slips'>('attendance');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().slice(0, 10));
  const [showAddEmpModal, setShowAddEmpModal] = useState(false);
  const [showGenerateSlipModal, setShowGenerateSlipModal] = useState(false);

  // Local attendance state for the selected date
  const [dailyStatusMap, setDailyStatusMap] = useState<Record<string, { status: AttendanceStatus; overtime: number }>>(() => {
    const map: Record<string, { status: AttendanceStatus; overtime: number }> = {};
    employees.forEach((emp) => {
      map[emp.id] = { status: 'Present', overtime: 0 };
    });
    return map;
  });

  // New Employee state
  const [empName, setEmpName] = useState('');
  const [empDesignation, setEmpDesignation] = useState<Employee['designation']>('EC Shed Operator');
  const [empPhone, setEmpPhone] = useState('');
  const [empAddress, setEmpAddress] = useState('');
  const [empBloodGroup, setEmpBloodGroup] = useState('O+');
  const [empSalary, setEmpSalary] = useState(25000);
  const [empEmergency, setEmpEmergency] = useState('');

  // Salary generation form state
  const [slipEmpId, setSlipEmpId] = useState(employees[0]?.id || '');
  const [slipMonth, setSlipMonth] = useState('October 2026');
  const [slipWorkedDays, setSlipWorkedDays] = useState(26);
  const [slipOtHours, setSlipOtHours] = useState(8);
  const [slipAllowances, setSlipAllowances] = useState(1500);
  const [slipDeductions, setSlipDeductions] = useState(1000);

  const handleAttendanceChange = (empId: string, status: AttendanceStatus) => {
    setDailyStatusMap((prev) => ({
      ...prev,
      [empId]: { ...prev[empId], status },
    }));
  };

  const handleOvertimeChange = (empId: string, overtime: number) => {
    setDailyStatusMap((prev) => ({
      ...prev,
      [empId]: { ...prev[empId], overtime },
    }));
  };

  const handleSaveAttendance = () => {
    const records: AttendanceRecord[] = employees.map((emp) => {
      const val = dailyStatusMap[emp.id] || { status: 'Present', overtime: 0 };
      return {
        id: `att-${attendanceDate}-${emp.id}`,
        date: attendanceDate,
        employeeId: emp.id,
        employeeName: emp.name,
        status: val.status,
        overtimeHours: val.overtime,
      };
    });

    onSaveAttendance(records);
    alert('Daily staff attendance saved successfully!');
  };

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    const newEmp: Employee = {
      id: `emp-${Date.now()}`,
      empId: `EMP-00${employees.length + 1}`,
      name: empName,
      designation: empDesignation,
      phone: empPhone,
      address: empAddress,
      bloodGroup: empBloodGroup,
      monthlySalary: Number(empSalary),
      dailyRate: Math.round(Number(empSalary) / 30),
      joinedDate: new Date().toISOString().slice(0, 10),
      active: true,
      emergencyContact: empEmergency,
    };
    onSaveEmployee(newEmp);
    setShowAddEmpModal(false);
  };

  const handleGenerateSalary = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find((e) => e.id === slipEmpId);
    if (!emp) return;

    const baseSalary = emp.monthlySalary;
    const dailyWage = baseSalary / 30;
    const earnedSalary = Math.round(dailyWage * slipWorkedDays);
    const overtimePay = Math.round((dailyWage / 8) * 1.5 * slipOtHours); // 1.5x overtime rate
    const pfDeduction = Math.round(baseSalary * 0.04);
    const netSalary = earnedSalary + overtimePay + Number(slipAllowances) - Number(slipDeductions) - pfDeduction;

    const slip: SalarySlipRecord = {
      id: `sal-${Date.now()}`,
      slipNo: `SAL-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      month: slipMonth,
      employeeId: emp.id,
      employeeName: emp.name,
      designation: emp.designation,
      phone: emp.phone,
      bloodGroup: emp.bloodGroup,
      address: emp.address,
      totalDaysInMonth: 30,
      presentDays: Number(slipWorkedDays),
      halfDays: 0,
      absentDays: Math.max(0, 30 - slipWorkedDays),
      paidLeaveDays: 4,
      overtimeHours: Number(slipOtHours),
      baseSalary,
      earnedSalary,
      overtimePay,
      allowances: Number(slipAllowances),
      advanceDeductions: Number(slipDeductions),
      providentFundDeductions: pfDeduction,
      netSalary,
      paymentDate: new Date().toISOString().slice(0, 10),
      paymentMode: 'Bank Transfer',
      status: 'Paid',
      generatedBy: currentUser.name,
    };

    onSaveSalarySlip(slip);
    setShowGenerateSlipModal(false);
    onOpenSalarySlipModal(slip);
  };

  return (
    <div className="space-y-4 pb-20 select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-base font-bold text-slate-900 leading-tight">HR & Farm Payroll</h1>
          <p className="text-xs text-slate-500">EC Shed operators, technicians & wage slips</p>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowGenerateSlipModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs"
          >
            <DollarSign className="w-4 h-4" />
            <span>Pay Slip</span>
          </button>
          <button
            type="button"
            onClick={() => setShowAddEmpModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0d2b45] hover:bg-blue-900 text-white text-xs font-semibold shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Staff</span>
          </button>
        </div>
      </div>

      {/* Subtabs */}
      <div className="flex p-1 bg-slate-200/70 rounded-xl text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('attendance')}
          className={`flex-1 py-1.5 rounded-lg transition-all ${
            activeTab === 'attendance'
              ? 'bg-white text-slate-900 font-bold shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Daily Attendance
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('slips')}
          className={`flex-1 py-1.5 rounded-lg transition-all ${
            activeTab === 'slips'
              ? 'bg-white text-slate-900 font-bold shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Salary Slips ({salarySlips.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('employees')}
          className={`flex-1 py-1.5 rounded-lg transition-all ${
            activeTab === 'employees'
              ? 'bg-white text-slate-900 font-bold shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Staff Directory ({employees.length})
        </button>
      </div>

      {/* TAB 1: ATTENDANCE */}
      {activeTab === 'attendance' && (
        <div className="space-y-3">
          <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-700" />
              <input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="text-xs font-bold text-slate-900 bg-transparent focus:outline-hidden"
              />
            </div>
            <button
              type="button"
              onClick={handleSaveAttendance}
              className="px-3.5 py-1.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold shadow-xs"
            >
              Submit Attendance
            </button>
          </div>

          <div className="space-y-2.5">
            {employees.map((emp) => {
              const state = dailyStatusMap[emp.id] || { status: 'Present', overtime: 0 };

              return (
                <div
                  key={emp.id}
                  className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{emp.name}</h4>
                      <p className="text-[10px] text-slate-500">{emp.designation} · {emp.empId}</p>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-600">
                      {formatCurrency(emp.monthlySalary)}/mo
                    </span>
                  </div>

                  {/* Status buttons: Present, Absent, Half Day */}
                  <div className="grid grid-cols-4 gap-1 text-[11px] font-medium">
                    {(['Present', 'Half Day', 'Leave', 'Absent'] as AttendanceStatus[]).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => handleAttendanceChange(emp.id, st)}
                        className={`py-1 rounded-lg text-center transition-all ${
                          state.status === st
                            ? st === 'Present'
                              ? 'bg-emerald-600 text-white font-bold'
                              : st === 'Absent'
                              ? 'bg-rose-600 text-white font-bold'
                              : 'bg-amber-600 text-white font-bold'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                    <span className="text-slate-500 text-[10px]">Overtime Hours:</span>
                    <input
                      type="number"
                      min={0}
                      max={12}
                      value={state.overtime}
                      onChange={(e) => handleOvertimeChange(emp.id, Number(e.target.value))}
                      className="w-16 px-2 py-0.5 rounded border border-slate-300 text-right tabular-nums text-xs"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: SALARY SLIPS */}
      {activeTab === 'slips' && (
        <div className="space-y-3">
          {salarySlips.map((slip) => (
            <div
              key={slip.id}
              className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{slip.employeeName}</h4>
                  <p className="text-[10px] text-slate-500">{slip.designation} · {slip.slipNo}</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {slip.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-1.5 p-2 bg-slate-50 rounded-xl text-center text-[10px]">
                <div>
                  <span className="text-slate-400 block uppercase">Base Salary</span>
                  <span className="text-xs font-bold text-slate-800 tabular-nums">
                    {formatCurrency(slip.baseSalary)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase">Worked Days</span>
                  <span className="text-xs font-bold text-blue-900 tabular-nums">
                    {slip.presentDays} / 30
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase">Net Paid</span>
                  <span className="text-xs font-bold text-emerald-700 tabular-nums">
                    {formatCurrency(slip.netSalary)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <span className="text-[10px] text-slate-500">Month: {slip.month}</span>
                <button
                  type="button"
                  onClick={() => onOpenSalarySlipModal(slip)}
                  className="py-1 px-3 rounded-lg bg-[#0d2b45] hover:bg-blue-900 text-white text-xs font-semibold flex items-center gap-1 shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Salary Slip</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: EMPLOYEES */}
      {activeTab === 'employees' && (
        <div className="space-y-3">
          {employees.map((emp) => (
            <div
              key={emp.id}
              className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{emp.name}</h4>
                  <p className="text-[10px] text-slate-500 font-medium">{emp.designation} · {emp.empId}</p>
                </div>
                <span className="text-xs font-bold text-emerald-700 tabular-nums">
                  {formatCurrency(emp.monthlySalary)}/mo
                </span>
              </div>
              <p className="text-[11px] text-slate-600">Ph: {emp.phone} · Blood: {emp.bloodGroup}</p>
              <p className="text-[10px] text-slate-400">{emp.address}</p>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Generate Salary Slip */}
      {showGenerateSlipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-sm select-none no-print">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[90vh] border border-slate-200">
            <div className="bg-[#0d2b45] text-white p-3.5 flex items-center justify-between">
              <h3 className="font-bold text-sm text-white">Generate Monthly Salary Slip</h3>
              <button
                type="button"
                onClick={() => setShowGenerateSlipModal(false)}
                className="p-1 rounded-lg text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGenerateSalary} className="p-4 overflow-y-auto space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Employee *</label>
                <select
                  value={slipEmpId}
                  onChange={(e) => setSlipEmpId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold"
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.designation} - {formatCurrency(emp.monthlySalary)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Salary Month</label>
                  <input
                    type="text"
                    required
                    value={slipMonth}
                    onChange={(e) => setSlipMonth(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Days Worked (out of 30)</label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={slipWorkedDays}
                    onChange={(e) => setSlipWorkedDays(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 tabular-nums font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">OT Hours</label>
                  <input
                    type="number"
                    value={slipOtHours}
                    onChange={(e) => setSlipOtHours(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 tabular-nums"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Allowances (₹)</label>
                  <input
                    type="number"
                    value={slipAllowances}
                    onChange={(e) => setSlipAllowances(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 tabular-nums text-emerald-700"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Deductions (₹)</label>
                  <input
                    type="number"
                    value={slipDeductions}
                    onChange={(e) => setSlipDeductions(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 tabular-nums text-rose-600"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowGenerateSlipModal(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm"
                >
                  Generate & View Slip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Employee */}
      {showAddEmpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-sm select-none no-print">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[90vh] border border-slate-200">
            <div className="bg-[#0d2b45] text-white p-3.5 flex items-center justify-between">
              <h3 className="font-bold text-sm text-white">Add Farm Employee</h3>
              <button
                type="button"
                onClick={() => setShowAddEmpModal(false)}
                className="p-1 rounded-lg text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddEmployee} className="p-4 overflow-y-auto space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={empName}
                  onChange={(e) => setEmpName(e.target.value)}
                  placeholder="Staff member name"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Designation *</label>
                  <select
                    value={empDesignation}
                    onChange={(e) => setEmpDesignation(e.target.value as Employee['designation'])}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  >
                    <option value="EC Shed Operator">EC Shed Operator</option>
                    <option value="Farm Supervisor">Farm Supervisor</option>
                    <option value="Vaccination Technician">Vaccination Technician</option>
                    <option value="Farm Manager">Farm Manager</option>
                    <option value="Accountant">Accountant</option>
                    <option value="General Worker">General Worker</option>
                    <option value="Security Guard">Security Guard</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Blood Group</label>
                  <input
                    type="text"
                    value={empBloodGroup}
                    onChange={(e) => setEmpBloodGroup(e.target.value)}
                    placeholder="O+, B+, A+..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Monthly Salary (₹) *</label>
                  <input
                    type="number"
                    required
                    value={empSalary}
                    onChange={(e) => setEmpSalary(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold tabular-nums"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={empPhone}
                    onChange={(e) => setEmpPhone(e.target.value)}
                    placeholder="+91 96180 00000"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Address / Quarters</label>
                <textarea
                  rows={2}
                  value={empAddress}
                  onChange={(e) => setEmpAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddEmpModal(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#0d2b45] hover:bg-blue-900 rounded-lg shadow-sm"
                >
                  Save Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
