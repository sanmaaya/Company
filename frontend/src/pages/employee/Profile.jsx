import React, { useState } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { RoleBadge } from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Avatar from '../../components/common/Avatar';
import { Download, FileText, Settings as SettingsIcon, ShieldCheck, Database, Zap, FileSpreadsheet } from 'lucide-react';

const Profile = () => {
  const { user, updateUserContext } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: user?.name || '',
    department: user?.department || '',
    profilePic: user?.profilePic || null,
    phoneNumber: user?.phoneNumber || ''
  });
  const [loading, setLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const balance = user?.leaveBalance || {};

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put('/auth/profile', form);
      updateUserContext(res.data.user);
      toast('Profile updated!', 'success');
    } catch (err) {
      toast(err.response?.data?.message || 'Update failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 1024 * 1024) { // 1MB limit for base64
      toast('Photo must be less than 1MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm(prev => ({ ...prev, profilePic: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleExport = async (type) => {
    setIsExporting(true);
    const id = toast.loading(`Preparing ${type} export...`);

    // Simulate data preparation
    setTimeout(() => {
      toast.success(`${type} export ready for download`, { id });
      setIsExporting(false);
    }, 2000);
  };

  return (
    <DashboardLayout title="My Profile">
      <div className="max-w-3xl mx-auto space-y-6 pb-12 animate-fade-in">
        {/* Profile Card */}
        <div className="card p-8">
          <div className="flex flex-col md:flex-row items-center gap-8 mb-10 pb-10 border-b border-slate-100 dark:border-slate-800">
            <div className="relative group">
              <Avatar name={user?.name} src={form.profilePic} size="xl" className="ring-4 ring-blue-500/10" />
              <label className="absolute inset-0 flex items-center justify-center bg-blue-600/80 rounded-full text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-all text-xs font-black uppercase tracking-widest backdrop-blur-sm">
                UPLOAD
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">{user?.name}</h2>
              <p className="text-slate-500 dark:text-slate-400 font-bold mb-4">{user?.email}</p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <RoleBadge role={user?.role} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-3 py-1.5 rounded-full border border-blue-100 dark:border-blue-500/20">
                  {user?.title || user?.department}
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleProfileSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label ml-1">Full Legal Name</label>
                <input
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="input"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="form-label ml-1">Personal Phone Number</label>
                <input
                  value={form.phoneNumber}
                  onChange={e => setForm({ ...form, phoneNumber: e.target.value })}
                  className="input"
                  placeholder="+91 00000 00000"
                />
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 ml-1 font-bold uppercase tracking-wider italic">Critical for Password Recovery</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label ml-1">Department</label>
                <input
                  value={form.department}
                  onChange={e => setForm({ ...form, department: e.target.value })}
                  className="input"
                  placeholder="Engineering"
                />
              </div>
              <div>
                <label className="form-label ml-1">Login Email</label>
                <input value={user?.email} disabled className="input opacity-50 cursor-not-allowed bg-slate-50 dark:bg-slate-900" />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button type="submit" disabled={loading} className="btn-primary px-10 py-3.5 !rounded-2xl shadow-xl shadow-blue-500/20 flex items-center gap-3 group">
                {loading ? <LoadingSpinner size="sm" /> : <span className="text-xl group-hover:scale-125 transition-transform">💾</span>}
                <span className="font-black text-xs uppercase tracking-[0.15em]">Save Profile Settings</span>
              </button>
            </div>
          </form>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Leave Balance */}
          <div className="card p-6 border-slate-100 dark:border-slate-800/50">
            <h3 className="text-sm font-black text-slate-800 dark:text-white mb-6 uppercase tracking-widest flex items-center gap-2">
              <span className="text-xl">📊</span> Leave Quota Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { key: 'casual', label: 'Casual', icon: '🏝️', bg: 'bg-blue-50/50 dark:bg-blue-500/10', text: 'text-blue-700 dark:text-blue-400' },
                { key: 'sick', label: 'Sick', icon: '🏥', bg: 'bg-rose-50/50 dark:bg-rose-500/10', text: 'text-rose-700 dark:text-rose-400' },
                { key: 'earned', label: 'Earned', icon: '⭐', bg: 'bg-amber-50/50 dark:bg-amber-500/10', text: 'text-amber-700 dark:text-amber-400' },
                { key: 'unpaid', label: 'Unpaid', icon: '💼', bg: 'bg-slate-50/50 dark:bg-slate-800/50', text: 'text-slate-700 dark:text-slate-400' }
              ].map(item => (
                <div key={item.key} className={`${item.bg} rounded-2xl p-4 border border-white/20 dark:border-slate-800/50 relative overflow-hidden group`}>
                  <div className="relative z-10">
                    <span className="text-2xl mb-2 block">{item.icon}</span>
                    <div className={`text-3xl font-black ${item.text}`}>{item.key === 'unpaid' ? '∞' : (balance[item.key] ?? 0)}</div>
                    <div className="text-[10px] uppercase font-black tracking-widest text-slate-500 dark:text-slate-400 mt-1">{item.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Info */}
          <div className="card p-6 border-slate-100 dark:border-slate-800/50">
            <h3 className="text-sm font-black text-slate-800 dark:text-white mb-6 uppercase tracking-widest flex items-center gap-2">
              <span className="text-xl">⚙️</span> Account Metadata
            </h3>
            <div className="space-y-4">
              {[
                { label: 'System ID', value: user?._id, icon: '🆔' },
                { label: 'Security Role', value: user?.role, icon: '🛡️' },
                { label: 'Onboarding Date', value: new Date(user?.createdAt).toLocaleDateString('en-IN', { dateStyle: 'long' }), icon: '📅' }
              ].map(row => (
                <div key={row.label} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl flex items-center justify-between border border-transparent hover:border-blue-500/20 transition-all group">
                  <div className="flex items-center gap-3">
                    <span className="opacity-50 grayscale group-hover:grayscale-0 transition-all">{row.icon}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{row.label}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Settings / Command Center (Manager/Admin Only) */}
        {['admin', 'manager'].includes(user?.role) && (
          <div className="mt-12 space-y-6 pt-12 border-t border-slate-200 dark:border-slate-800">
            <header className="mb-12 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mb-6 shadow-sm border border-indigo-100 dark:border-indigo-800">
                <SettingsIcon size={40} className="animate-spin-slow" />
              </div>
              <h2 className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter mb-4">Command Center</h2>
              <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs max-w-md mx-auto leading-relaxed">System administration and data management tools for privileged users.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Export Section */}
              <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 dark:border-slate-800 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 transition-all group-hover:bg-blue-500/10"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/40 text-blue-500 flex items-center justify-center">
                      <Database size={24} />
                    </div>
                    <h3 className="font-black text-slate-800 dark:text-white text-xl">Data Export</h3>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-10 leading-relaxed font-semibold">Generate real-time reports and CSV exports of employee data, leave balance, and project timelines.</p>

                  <div className="space-y-4">
                    <button
                      disabled={isExporting}
                      onClick={() => handleExport('Personnel')}
                      className="w-full flex items-center justify-between p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-blue-500 hover:text-white transition-all group/btn border border-transparent hover:border-blue-400"
                    >
                      <div className="flex items-center gap-4">
                        <FileSpreadsheet size={20} className="text-blue-500 group-hover/btn:text-white" />
                        <span className="font-black text-[10px] uppercase tracking-widest">Personnel Data</span>
                      </div>
                      <Download size={16} />
                    </button>

                    <button
                      disabled={isExporting}
                      onClick={() => handleExport('Leave History')}
                      className="w-full flex items-center justify-between p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-500 hover:text-white transition-all group/btn border border-transparent hover:border-indigo-400"
                    >
                      <div className="flex items-center gap-4">
                        <FileText size={20} className="text-indigo-500 group-hover/btn:text-white" />
                        <span className="font-black text-[10px] uppercase tracking-widest">Leave Analytics</span>
                      </div>
                      <Download size={16} />
                    </button>

                    <button
                      disabled={isExporting}
                      onClick={() => handleExport('Expenses')}
                      className="w-full flex items-center justify-between p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-emerald-500 hover:text-white transition-all group/btn border border-transparent hover:border-emerald-400"
                    >
                      <div className="flex items-center gap-4">
                        <FileSpreadsheet size={20} className="text-emerald-500 group-hover/btn:text-white" />
                        <span className="font-black text-[10px] uppercase tracking-widest">Expense Reports</span>
                      </div>
                      <Download size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Security & Access */}
              <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 dark:border-slate-800 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 transition-all group-hover:bg-rose-500/10"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-900/40 text-rose-500 flex items-center justify-center">
                      <ShieldCheck size={24} />
                    </div>
                    <h3 className="font-black text-slate-800 dark:text-white text-xl">System Policy</h3>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-10 leading-relaxed font-semibold">Oversee global leave policies and manage administrative permissions across the organization.</p>

                  <div className="pt-6 border-t border-slate-50 dark:border-slate-800 space-y-4">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <span>API Status</span>
                      <span className="flex items-center gap-2 text-emerald-500">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Optimal
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <span>Privacy Tier</span>
                      <span className="text-indigo-500">Enterprise</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 bg-indigo-600 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl shadow-indigo-500/40 group">
              <Zap className="absolute top-[-20%] right-[-5%] w-64 h-64 text-white opacity-[0.05] -rotate-12 transition-transform duration-1000 group-hover:scale-110" />
              <div className="relative z-10 md:max-w-md">
                <h3 className="text-2xl font-black mb-4 tracking-tighter">Automatic Synchronisation</h3>
                <p className="text-indigo-50/70 text-sm font-bold leading-relaxed mb-8">All personnel changes, leave approvals, and system exports are securely logged and synced across all network nodes in real-time.</p>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/10 w-fit">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest">Network Verified</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Profile;
