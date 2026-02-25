import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { useToast } from '../../components/common/Toast';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { RoleBadge } from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Avatar from '../../components/common/Avatar';

const ROLES = ['employee', 'manager', 'admin'];

const UserModal = ({ user, onClose, onSave }) => {
  const [form, setForm] = useState(user || { name: '', email: '', password: '', role: 'employee', title: '', department: '', isActive: true });
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg animate-fade-in border border-white/10 dark:border-slate-800">
        <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
          <h3 className="font-bold text-gray-800 dark:text-white text-lg">{isEdit ? 'Edit User' : 'Add New User'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl leading-none">×</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Full Name</label>
              <input value={form.name} onChange={e => f('name', e.target.value)} required className="input" placeholder="John Doe" />
            </div>
            <div>
              <label className="form-label">Email</label>
              <input value={form.email} onChange={e => f('email', e.target.value)} required type="email" disabled={isEdit} className="input disabled:opacity-50" placeholder="user@company.com" />
            </div>
          </div>
          {!isEdit && (
            <div>
              <label className="form-label">Password</label>
              <input value={form.password} onChange={e => f('password', e.target.value)} required type="password" className="input" placeholder="Min. 6 characters" />
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Role</label>
              <select value={form.role} onChange={e => f('role', e.target.value)} className="input">
                {ROLES.map(r => <option key={r} value={r} className="capitalize">{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Job Title</label>
              <input value={form.title} onChange={e => f('title', e.target.value)} className="input" placeholder="e.g. Senior Developer" />
            </div>
            <div>
              <label className="form-label">Department</label>
              <input value={form.department} onChange={e => f('department', e.target.value)} className="input" placeholder="Engineering" />
            </div>
          </div>
          {isEdit && (
            <div className="flex items-center gap-2">
              <input type="checkbox" id="active" checked={form.isActive} onChange={e => f('isActive', e.target.checked)} className="w-4 h-4 accent-green-600" />
              <label htmlFor="active" className="text-sm text-gray-700 font-medium">Active Account</label>
            </div>
          )}
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
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
          { label: 'Total Users', val: stats.total, icon: '👥', color: 'border-gray-100 dark:border-slate-800' },
          { label: 'Admins', val: stats.admin, icon: '🛡️', color: 'border-purple-100 dark:border-purple-900/40' },
          { label: 'Managers', val: stats.manager, icon: '👔', color: 'border-blue-100 dark:border-blue-900/40' },
          { label: 'Employees', val: stats.employee, icon: '👤', color: 'border-green-100 dark:border-green-900/40' }
        ].map(s => (
          <div key={s.label} className={`bg-white dark:bg-slate-900 rounded-xl border shadow-sm p-4 ${s.color}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{s.val}</p>
                <p className="text-xs text-gray-500 font-medium mt-0.5">{s.label}</p>
              </div>
              <span className="text-2xl">{s.icon}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
        <div className="p-5 border-b border-gray-100 dark:border-slate-800 flex flex-wrap items-center gap-3">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="flex-1 min-w-[200px] px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <div className="flex gap-2">
            {['all', 'admin', 'manager', 'employee'].map(r => (
              <button key={r} onClick={() => setRoleFilter(r)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${roleFilter === r ? 'bg-green-600 text-white' : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700'}`}>{r}</button>
            ))}
          </div>
          <button onClick={() => setModal('create')} className="btn-primary px-5 whitespace-nowrap">
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
                <tr>
                  {['User', 'Email', 'Role', 'Title', 'Department', 'Leave Balance', 'Status', 'Actions'].map(h => (
                    <th key={h} className="table-header">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {filtered.map(user => (
                  <tr key={user._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition">
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <Avatar name={user.name} email={user.email} src={user.profilePic} size="sm" className="shadow-sm border-2 border-white dark:border-slate-800" />
                        <span className="font-bold text-slate-800 dark:text-slate-200">{user.name}</span>
                      </div>
                    </td>
                    <td className="table-cell text-slate-500 font-medium">{user.email}</td>
                    <td className="table-cell"><RoleBadge role={user.role} /></td>
                    <td className="table-cell text-slate-500 font-bold text-xs uppercase tracking-tight">{user.title || '—'}</td>
                    <td className="table-cell text-slate-500 font-medium">{user.department || '—'}</td>
                    <td className="table-cell">
                      <div className="flex gap-2">
                        {['casual', 'sick', 'earned'].map(t => (
                          <span key={t} className="text-[10px] font-bold px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded uppercase">{t[0]}:{user.leaveBalance?.[t]}</span>
                        ))}
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${user.isActive ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'}`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="flex gap-4">
                        <button onClick={() => setModal(user)} className="text-emerald-600 dark:text-emerald-400 font-extrabold hover:underline">Edit</button>
                        <button onClick={() => handleDelete(user._id)} className="text-rose-500 hover:text-rose-700 font-extrabold hover:underline">Delete</button>
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
