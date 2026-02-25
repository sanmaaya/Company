import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLeave } from '../../context/LeaveContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatusBadge, { LeaveTypeBadge } from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Avatar from '../../components/common/Avatar';
import api from '../../utils/api';

const StatCard = ({ label, value, icon, color, sub, textColor = 'text-slate-800 dark:text-slate-100' }) => (
  <div className={`bg-white dark:bg-slate-900 rounded-3xl border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-6 ${color}`}>
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 leading-none">{label}</p>
        <p className={`text-3xl font-black tracking-tight ${textColor}`}>{value}</p>
        {sub && <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2 font-bold uppercase tracking-tighter">{sub}</p>}
      </div>
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm shadow-inner border border-white dark:border-slate-700 text-3xl shrink-0 ml-3">
        {icon}
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const { leaves, stats, loading, fetchLeaves, fetchStats } = useLeave();
  const [pendingApprovals, setPendingApprovals] = useState([]);

  useEffect(() => {
    fetchLeaves({ limit: 8 });
    fetchStats();
    if (user?.role === 'manager' || user?.role === 'admin') {
      api.get('/leaves', { params: { status: 'pending', limit: 50 } })
        .then(res => {
          const teamPending = res.data.leaves.filter(l => l.employee?._id !== user?._id);
          setPendingApprovals(teamPending);
        })
        .catch(console.error);
    }
  }, [user]);

  const balance = user?.leaveBalance || {};
  const myLeaves = leaves.filter(l => l.employee?._id === user?._id).slice(0, 5);

  return (
    <DashboardLayout title="Dashboard">
      {/* ── Welcome Banner ─────────────────────────────────── */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-800 dark:from-emerald-900 dark:to-slate-950 rounded-[2.5rem] p-10 mb-10 text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white dark:bg-emerald-500 opacity-10 dark:opacity-5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:opacity-20 transition-opacity"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-400 opacity-10 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <Avatar name={user?.name} email={user?.email} src={user?.profilePic} size="xl" className="ring-[6px] ring-white/20 shadow-2xl scale-110" />
            <div>
              <p className="text-emerald-100/80 font-black uppercase tracking-[0.2em] text-[10px] mb-2">Welcome back to EmployeeSync</p>
              <h2 className="text-4xl font-black mb-2 tracking-tight">Bonjour, {user?.name?.split(' ')[0]}! 👋</h2>
              <p className="text-emerald-50/70 font-medium max-w-md leading-relaxed italic">
                {user?.role === 'admin'
                  ? `System is running smoothly. There are ${pendingApprovals.length} pending requests total.`
                  : user?.role === 'manager'
                    ? `Your team has ${pendingApprovals.length} pending requests awaiting your review.`
                    : `You have ${balance.casual + balance.sick + balance.earned} days of leave remaining this year.`}
              </p>
            </div>
          </div>
          <Link to="/apply-leave" className="bg-white text-emerald-700 dark:bg-emerald-500 dark:text-white font-black px-8 py-4 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-emerald-900/20 whitespace-nowrap tracking-tight">
            + Request Leave
          </Link>
        </div>
      </div>

      {/* ── Dashboard Grid ─────────────────────────────────── */}
      {/* 
          If manager: Show Action Required card + 3 stat cards
          If employee: Show 4 stat cards
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {(user?.role === 'manager' || user?.role === 'admin') && (
          <Link to="/approvals" className="block group">
            <StatCard
              label="Action Required"
              value={pendingApprovals.length}
              icon="⚖️"
              sub="Pending team reviews"
              color={`border-amber-100 dark:border-amber-900/30 bg-amber-50/50 dark:bg-amber-900/10 ${pendingApprovals.length > 0 ? 'ring-2 ring-amber-400/50' : ''}`}
              textColor={pendingApprovals.length > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-800 dark:text-slate-100'}
            />
          </Link>
        )}

        {user?.role === 'admin' ? (
          <>
            <StatCard label="Organization Size" value={stats?.totalUsers ?? '—'} icon="🤝" sub="Registered members" color="border-purple-100 dark:border-purple-900/30 bg-purple-50/30 dark:bg-purple-900/5" />
            <StatCard label="Company Approvals" value={stats?.approved ?? 0} icon="🏰" sub="Total this year" color="border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/30 dark:bg-emerald-900/5" />
            <StatCard label="Rejected Requests" value={stats?.rejected ?? 0} icon="🛡️" sub="Company wide" color="border-rose-100 dark:border-rose-900/30 bg-rose-50/30 dark:bg-rose-900/5" />
          </>
        ) : (
          <>
            <StatCard label="Casual Leave" value={balance.casual ?? '—'} icon="🏕️" sub="Available balance" color="border-sky-100 dark:border-sky-900/30 bg-sky-50/30 dark:bg-sky-900/5" />
            <StatCard label="Medical Leave" value={balance.sick ?? '—'} icon="🩺" sub="Available balance" color="border-orange-100 dark:border-orange-900/30 bg-orange-50/30 dark:bg-orange-900/5" />
            <StatCard label="Annual Leave" value={balance.earned ?? '—'} icon="🏆" sub="Available balance" color="border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/30 dark:bg-emerald-900/5" />
          </>
        )}

        {user?.role === 'employee' && (
          <StatCard label="Total Approved" value={stats?.approved ?? 0} icon="📜" sub="Personal record" color="border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/30 dark:bg-emerald-900/5" />
        )}
      </div>

      {/* ── Main Content Area ────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column: My Leaves (Hidden for Admin) */}
        {user?.role !== 'admin' && (
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-all duration-300">
              <div className="flex items-center justify-between p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20">
                <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Recent Activity</h3>
                <Link to="/my-leaves" className="text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-widest hover:underline">View History →</Link>
              </div>

              {loading ? (
                <div className="p-16 flex justify-center"><LoadingSpinner /></div>
              ) : myLeaves.length === 0 ? (
                <div className="p-20 text-center">
                  <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6">🏝️</div>
                  <p className="font-black text-slate-800 dark:text-slate-200 text-lg mb-2">No active requests</p>
                  <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">Ready for a break? Apply for leave to see it here.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        <th className="table-header">Type</th>
                        <th className="table-header">Duration</th>
                        <th className="table-header">Days</th>
                        <th className="table-header">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                      {myLeaves.map(leave => (
                        <tr key={leave._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition">
                          <td className="table-cell"><LeaveTypeBadge type={leave.leaveType} /></td>
                          <td className="table-cell font-bold text-slate-600 dark:text-slate-400 text-xs">
                            {new Date(leave.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                            {' '}-{' '}
                            {new Date(leave.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                          </td>
                          <td className="table-cell font-black text-slate-800 dark:text-slate-100">{leave.totalDays}</td>
                          <td className="table-cell"><StatusBadge status={leave.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Extra Column for Admin: Quick Management */}
        {user?.role === 'admin' && (
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm p-10 transition-all">
              <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-8 tracking-tight">Administrative Suite</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link to="/admin/users" className="group bg-emerald-50 dark:bg-emerald-900/10 hover:bg-emerald-600 dark:hover:bg-emerald-600 p-8 rounded-3xl transition-all duration-500 border border-emerald-100 dark:border-emerald-900/20 shadow-sm relative overflow-hidden">
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/20 rounded-full blur-2xl group-hover:bg-emerald-400/20 transition-all"></div>
                  <div className="relative z-10">
                    <div className="text-3xl mb-4 group-hover:scale-110 transition-transform inline-block">👥</div>
                    <h4 className="text-lg font-black text-emerald-800 dark:text-emerald-300 group-hover:text-white mb-2 uppercase tracking-tight">Staff Management</h4>
                    <p className="text-emerald-700/60 dark:text-emerald-500/80 group-hover:text-emerald-50 text-xs font-bold leading-relaxed">System-wide user control, role assignment and profile management.</p>
                  </div>
                </Link>
                <Link to="/approvals" className="group bg-sky-50 dark:bg-sky-900/10 hover:bg-sky-600 dark:hover:bg-sky-600 p-8 rounded-3xl transition-all duration-500 border border-sky-100 dark:border-sky-900/20 shadow-sm relative overflow-hidden">
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/20 rounded-full blur-2xl group-hover:bg-sky-400/20 transition-all"></div>
                  <div className="relative z-10">
                    <div className="text-3xl mb-4 group-hover:scale-110 transition-transform inline-block">📋</div>
                    <h4 className="text-lg font-black text-sky-800 dark:text-sky-300 group-hover:text-white mb-2 uppercase tracking-tight">Global Approvals</h4>
                    <p className="text-sky-700/60 dark:text-sky-500/80 group-hover:text-sky-50 text-xs font-bold leading-relaxed">Review and process leave requests from the entire organization.</p>
                  </div>
                </Link>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
                  <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4">Core Engine Status</h4>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-4 h-4 bg-emerald-500 rounded-full animate-ping absolute"></div>
                      <div className="w-4 h-4 bg-emerald-500 rounded-full relative"></div>
                    </div>
                    <span className="text-sm font-black text-slate-800 dark:text-slate-200">System Healthy</span>
                  </div>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mt-2 ml-7 uppercase tracking-widest">Latency: 24ms / Nodes: 4</p>
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/5 p-8 rounded-3xl border border-amber-100 dark:border-amber-900/20 shadow-sm">
                  <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] mb-4">Queue Alert</h4>
                  <p className="text-amber-800 dark:text-amber-200 text-sm font-black leading-tight">You have <span className="text-xl underline underline-offset-4">{pendingApprovals.length}</span> items requiring attention.</p>
                  <Link to="/approvals" className="inline-flex items-center gap-2 mt-4 text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 hover:text-amber-700 transition">
                    Audit Queue <span className="text-lg">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Right Column: Status Summary & Manager Info */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm p-6 transition-colors duration-300">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-5">{user?.role === 'admin' ? 'Company Overview' : 'Your Leave Stats'}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl p-4 text-center border border-yellow-100/50 dark:border-yellow-900/40">
                <p className="text-3xl font-extrabold text-yellow-600 dark:text-yellow-400">{stats?.pending ?? 0}</p>
                <p className="text-xs font-bold text-yellow-700/70 dark:text-yellow-500 uppercase tracking-wider mt-1">Pending</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-4 text-center border border-green-100/50 dark:border-green-900/40">
                <p className="text-3xl font-extrabold text-green-600 dark:text-green-400">{stats?.approved ?? 0}</p>
                <p className="text-xs font-bold text-green-700/70 dark:text-green-500 uppercase tracking-wider mt-1">Approved</p>
              </div>
              <div className="col-span-2 bg-red-50 dark:bg-red-900/20 rounded-2xl p-4 text-center border border-red-100/50 dark:border-red-900/40 flex items-center justify-between">
                <div className="text-left">
                  <p className="text-xs font-bold text-red-700/70 dark:text-red-500 uppercase tracking-wider mb-1">Rejected</p>
                  <p className="text-sm font-medium text-red-600 dark:text-red-400">Total requests</p>
                </div>
                <p className="text-3xl font-extrabold text-red-600 dark:text-red-400">{stats?.rejected ?? 0}</p>
              </div>
            </div>
          </div>

          {(user?.role === 'manager' || user?.role === 'admin') && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm p-6 relative overflow-hidden group transition-colors duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 dark:bg-amber-900/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-amber-100 dark:group-hover:bg-amber-900/40 transition duration-500"></div>
              <div className="relative z-10">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Team Approvals</h3>
                {pendingApprovals.length > 0 ? (
                  <>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-5 font-medium">You have <strong className="text-amber-600 dark:text-amber-400">{pendingApprovals.length}</strong> leaves awaiting your review.</p>
                    <div className="space-y-3 mb-5">
                      {pendingApprovals.slice(0, 3).map(pa => (
                        <div key={pa._id} className="flex items-center gap-3">
                          <Avatar name={pa.employee.name} email={pa.employee.email} src={pa.employee.profilePic} size="sm" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{pa.employee.name}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{pa.totalDays} day{pa.totalDays > 1 ? 's' : ''} ({pa.leaveType})</p>
                          </div>
                        </div>
                      ))}
                      {pendingApprovals.length > 3 && (
                        <p className="text-xs text-gray-400 dark:text-gray-500 font-medium pl-10">+ {pendingApprovals.length - 3} more...</p>
                      )}
                    </div>
                    <Link to="/approvals" className="block w-full text-center bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 font-bold py-3 rounded-xl hover:bg-amber-200 dark:hover:bg-amber-900/50 transition">
                      Review Now
                    </Link>
                  </>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-4xl mb-3">✅</p>
                    <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">All caught up! No pending requests.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
