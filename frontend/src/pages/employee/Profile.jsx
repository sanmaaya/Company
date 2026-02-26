import React, { useState } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { RoleBadge } from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Avatar from '../../components/common/Avatar';

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
      </div>
    </DashboardLayout>
  );
};

export default Profile;
