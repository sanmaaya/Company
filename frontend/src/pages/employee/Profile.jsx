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
    profilePic: user?.profilePic || null
  });
  const [loading, setLoading] = useState(false);
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

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
      <div className="max-w-2xl mx-auto space-y-6 pb-12">
        {/* Profile Card */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-100">
            <div className="relative group">
              <Avatar name={user?.name} src={form.profilePic} size="xl" className="ring-4 ring-emerald-50" />
              <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity text-xs font-bold uppercase tracking-tighter">
                Change
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{user?.name}</h2>
              <p className="text-gray-500 text-sm">{user?.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <RoleBadge role={user?.role} />
                <span className="text-xs text-gray-400 font-medium">• {user?.title || user?.department}</span>
              </div>
            </div>
          </div>
          <form onSubmit={handleProfileSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Full Name</label>
                <input
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Department</label>
                <input
                  value={form.department}
                  onChange={e => setForm({ ...form, department: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Email</label>
              <input value={user?.email} disabled className="w-full px-4 py-2.5 rounded-lg border border-gray-100 text-sm bg-gray-50 text-gray-400" />
              <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
            </div>
            <div className="pt-2">
              <button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-2.5 rounded-lg text-sm font-bold shadow-lg shadow-emerald-100 transition-all flex items-center gap-2 disabled:opacity-60">
                {loading && <LoadingSpinner size="sm" />}
                {loading ? 'Saving...' : 'Update Profile'}
              </button>
            </div>
          </form>
        </div>

        {/* Leave Balance */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-bold text-gray-800 mb-4">Leave Balance</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { key: 'casual', label: 'Casual', icon: '🏖️', color: 'bg-sky-50 border-sky-100 text-sky-700', max: 12 },
              { key: 'sick', label: 'Sick', icon: '🏥', color: 'bg-orange-50 border-orange-100 text-orange-700', max: 10 },
              { key: 'earned', label: 'Earned', icon: '⭐', color: 'bg-teal-50 border-teal-100 text-teal-700', max: 15 },
              { key: 'unpaid', label: 'Unpaid', icon: '💼', color: 'bg-gray-50 border-gray-200 text-gray-600', max: null }
            ].map(item => (
              <div key={item.key} className={`rounded-xl border p-4 text-center ${item.color}`}>
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="text-2xl font-bold">{item.key === 'unpaid' ? '∞' : (balance[item.key] ?? 0)}</div>
                {item.max && <div className="text-xs opacity-60 mt-0.5">of {item.max} days</div>}
                <div className="text-xs font-semibold mt-1">{item.label}</div>
                {item.max && (
                  <div className="mt-2 bg-white bg-opacity-60 rounded-full h-1.5">
                    <div
                      className="bg-current rounded-full h-1.5 transition-all"
                      style={{ width: `${Math.min(100, ((balance[item.key] ?? 0) / item.max) * 100)}%` }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Account Info */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-bold text-gray-800 mb-4">Account Information</h3>
          <div className="space-y-3 text-sm">
            {[
              { label: 'Account ID', value: user?._id },
              { label: 'Role', value: user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) },
              { label: 'Member Since', value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A' }
            ].map(row => (
              <div key={row.label} className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-500 font-medium">{row.label}</span>
                <span className="text-gray-800 font-mono text-xs">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
