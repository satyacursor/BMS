import React, { useState } from 'react';
import { X, Lock, Eye, EyeOff, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { User, UserRole } from '../../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  users: User[];
  onSelectUser: (user: User) => void;
  onLogout: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  users,
  onSelectUser,
  onLogout,
}) => {
  const [username, setUsername] = useState(currentUser.username);
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [activeTab, setActiveTab] = useState<'switch' | 'credentials'>('switch');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleCredentialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const matched = users.find(
      (u) => u.username.toLowerCase() === username.trim().toLowerCase() || u.email.toLowerCase() === username.trim().toLowerCase()
    );
    if (matched) {
      onSelectUser(matched);
      setSuccessMsg(`Logged in as ${matched.name} (${matched.role})`);
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 700);
    } else {
      alert('User not found. Try one of the pre-configured role accounts.');
    }
  };

  const handleRoleQuickSwitch = (u: User) => {
    onSelectUser(u);
    setSuccessMsg(`Switched to ${u.name} (${u.role})`);
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm select-none no-print">
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150 border border-slate-200">
        {/* Header */}
        <div className="bg-[#0d2b45] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/30 border border-emerald-400/40 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">User & Security Access</h3>
              <p className="text-[10px] text-blue-200">Role-Based Authorization</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Account Box */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-blue-900 text-white font-bold flex items-center justify-center text-sm">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-900 leading-tight">{currentUser.name}</p>
              <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                {currentUser.role}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 px-2 py-1 rounded bg-rose-50 hover:bg-rose-100 transition-colors"
          >
            Sign Out
          </button>
        </div>

        {successMsg && (
          <div className="m-3 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-emerald-800 text-xs font-semibold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Tabs: Role Switcher vs Credentials Form */}
        <div className="flex border-b border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab('switch')}
            className={`flex-1 py-2 text-xs font-semibold text-center border-b-2 transition-colors ${
              activeTab === 'switch'
                ? 'border-blue-700 text-[#0d2b45] bg-blue-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Switch Farm Role ({users.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('credentials')}
            className={`flex-1 py-2 text-xs font-semibold text-center border-b-2 transition-colors ${
              activeTab === 'credentials'
                ? 'border-blue-700 text-[#0d2b45] bg-blue-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Credentials Login
          </button>
        </div>

        {/* Content */}
        <div className="p-4 max-h-[380px] overflow-y-auto">
          {activeTab === 'switch' ? (
            <div className="space-y-2">
              <p className="text-[11px] text-slate-500 mb-2">
                Tap any pre-configured farm role to test permissions and features:
              </p>
              {users.map((u) => {
                const isCurrent = u.id === currentUser.id;
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleRoleQuickSwitch(u)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                      isCurrent
                        ? 'border-blue-700 bg-blue-50/80 ring-1 ring-blue-600'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-md font-bold text-xs flex items-center justify-center shrink-0 ${
                          isCurrent ? 'bg-[#0d2b45] text-white' : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {u.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-semibold text-slate-900 truncate">{u.name}</p>
                          {isCurrent && (
                            <span className="text-[9px] font-bold text-blue-700 bg-blue-100 px-1 rounded">
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 truncate">{u.email}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 shrink-0">
                      {u.role}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <form onSubmit={handleCredentialSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email or Username
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="superadmin, manager, accountant..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-3 pr-9 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Remember login</span>
                </label>
                <span className="text-slate-400">ASP.NET Identity</span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-[#0d2b45] hover:bg-blue-900 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Authenticate & Sign In</span>
              </button>
            </form>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center">
          <p className="text-[10px] text-slate-400">
            EC FARM PRO Mobile Security · Role-based access control enabled
          </p>
        </div>
      </div>
    </div>
  );
};
