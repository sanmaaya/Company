import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { useToast } from '../../components/common/Toast';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { RoleBadge } from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ROLES = ['employee', 'manager', 'admin'];

const UserModal = ({ user, onClose, onSave }) => {
  const [form, setForm] = useState(user || { name: '', email: '', password: '', role: 'employee', department: '', isActive: true });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const isEdit = !!user?._id;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        const res = await api.put(`/users/${user._id}`, form);
        onSave(res.data.user, 'update');
      } else {
        const res = await api.post('/users', form);
        onSave(res.data.user, 'create');
      }
      toast(`User ${isEdit ? 'updated' : 'created'} successfully!`, 'success');
      onClose();
    } catch (err) {
      toast(err.response?.data?.message || 'Operation failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const f = (field, val) => setForm({ ...form, [field]: val });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-fade-in">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-800 text-lg">{isEdit ? 'Edit User' : 'Add New User'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Full Name</label>
              <input value={form.name} onChange={e => f('name', e.target.value)} required className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Email</label>
              <input value={form.email} onChange={e => f('email', e.target.value)} required type="email" disabled={isEdit} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50" placeholder="user@company.com" />
            </div>
          </div>
          {!isEdit && (
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Password</label>
              <input value={form.password} onChange={e => f('password', e.target.value)} required type="password" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Min. 6 characters" />
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Role</label>
              <select value={form.role} onChange={e => f('role', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                {ROLES.map(r => <option key={r} value={r} className="capitalize">{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Department</label>
              <input value={form.department} onChange={e => f('department', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Engineering" />
            </div>
          </div>
          {isEdit && (
            <div className="flex items-center gap-2">
              <input type="checkbox" id="active" checked={form.isActive} onChange={e => f('isActive', e.target.checked)} className="w-4 h-4 accent-green-600" />
              <label htmlFor="active" className="text-sm text-gray-700 font-medium">Active Account</label>
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 bg-green-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-green-700 disabled:opacity-60 flex items-center justify-center gap-2">
              {loading && <LoadingSpinner size="sm" />}
              {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'create' | user object
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const { toast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users');
      setUsers(res.data.users);
    } catch (err) {
      toast('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleSave = (user, action) => {
    if (action === 'create') setUsers(prev => [user, ...prev]);
    else setUsers(prev => prev.map(u => u._id === user._id ? user : u));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Permanently delete this user? This cannot be undone.')) return;
    try {
      await api.delete(`/users/${id}`);
      setUsers(prev => prev.filter(u => u._id !== id));
      toast('User deleted', 'success');
    } catch (err) {
      toast(err.response?.data?.message || 'Delete failed', 'error');
    }
  };

  const filtered = users.filter(u => {
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const stats = { total: users.length, admin: users.filter(u => u.role === 'admin').length, manager: users.filter(u => u.role === 'manager').length, employee: users.filter(u => u.role === 'employee').length };

  return (
    <DashboardLayout title="User Management">
      {modal && <UserModal user={modal === 'create' ? null : modal} onClose={() => setModal(null)} onSave={handleSave} />}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Users', val: stats.total, icon: '👥', color: 'border-gray-100' },
          { label: 'Admins', val: stats.admin, icon: '🛡️', color: 'border-purple-100' },
          { label: 'Managers', val: stats.manager, icon: '👔', color: 'border-blue-100' },
          { label: 'Employees', val: stats.employee, icon: '👤', color: 'border-green-100' }
        ].map(s => (
          <div key={s.label} className={`bg-white rounded-xl border shadow-sm p-4 ${s.color}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-800">{s.val}</p>
                <p className="text-xs text-gray-500 font-medium mt-0.5">{s.label}</p>
              </div>
              <span className="text-2xl">{s.icon}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-5 border-b border-gray-100 flex flex-wrap items-center gap-3">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="flex-1 min-w-[200px] px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <div className="flex gap-2">
            {['all', 'admin', 'manager', 'employee'].map(r => (
              <button key={r} onClick={() => setRoleFilter(r)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${roleFilter === r ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{r}</button>
            ))}
          </div>
          <button onClick={() => setModal('create')} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-1">
            + Add User
          </button>
        </div>

        {loading ? (
          <div className="p-12 flex justify-center"><LoadingSpinner text="Loading users..." /></div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400"><p className="text-4xl mb-3">👥</p><p>No users found</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  {['User', 'Email', 'Role', 'Department', 'Leave Balance', 'Status', 'Joined', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(user => (
                  <tr key={user._id} className="border-t border-gray-50 hover:bg-gray-50 transition">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {user.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-800">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-500">{user.email}</td>
                    <td className="px-5 py-3"><RoleBadge role={user.role} /></td>
                    <td className="px-5 py-3 text-gray-500">{user.department || '—'}</td>
                    <td className="px-5 py-3 text-xs text-gray-500">
                      C:{user.leaveBalance?.casual} S:{user.leaveBalance?.sick} E:{user.leaveBalance?.earned}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-400 whitespace-nowrap text-xs">{new Date(user.createdAt).toLocaleDateString('en-IN')}</td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => setModal(user)} className="text-green-600 hover:text-green-800 text-xs font-semibold">Edit</button>
                        <button onClick={() => handleDelete(user._id)} className="text-red-500 hover:text-red-700 text-xs font-semibold">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminUsers;
