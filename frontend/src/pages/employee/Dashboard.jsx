import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLeave } from '../../context/LeaveContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatusBadge, { LeaveTypeBadge } from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Avatar from '../../components/common/Avatar';
import api from '../../utils/api';

const StatCard = ({ label, value, icon, color, sub, textColor = 'text-gray-800' }) => (
  <div className={`bg-white rounded-2xl border p-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 ${color}`}>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">{label}</p>
        <p className={`text-3xl font-extrabold ${textColor}`}>{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-1 font-medium">{sub}</p>}
      </div>
      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white shadow-sm border border-gray-50 text-2xl">
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
          const teamPending = res.data.leaves.filter(l => l.employee._id !== user._id);
          setPendingApprovals(teamPending);
        })
        .catch(console.error);
    }
  }, [user]);

  const balance = user?.leaveBalance || {};
  const myLeaves = leaves.filter(l => l.employee._id === user._id).slice(0, 5);

  return (
    <DashboardLayout title="Dashboard">
      {/* ── Welcome Banner ─────────────────────────────────── */}
      <div className="bg-gradient-to-br from-green-600 to-emerald-800 rounded-3xl p-8 mb-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <Avatar name={user?.name} email={user?.email} size="xl" className="ring-4 ring-green-500/30" />
            <div>
              <h2 className="text-3xl font-extrabold mb-1">Welcome back, {user?.name?.split(' ')[0]}! 👋</h2>
              <p className="text-green-100 font-medium">
                You have <strong className="text-white">{balance.casual + balance.sick + balance.earned} days</strong> of leave remaining this year.
              </p>
            </div>
          </div>
          <Link to="/apply-leave" className="bg-white text-green-700 font-bold px-6 py-3 rounded-xl hover:bg-green-50 transition shadow-sm whitespace-nowrap">
            + Apply Leave
          </Link>
        </div>
      </div>

      {/* ── Dashboard Grid ─────────────────────────────────── */}
      {/* 
          If manager: Show Action Required card + 3 stat cards
          If employee: Show 4 stat cards
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {(user?.role === 'manager' || user?.role === 'admin') && (
          <Link to="/approvals" className="block outline-none ring-green-500 focus-visible:ring-2 rounded-2xl">
            <StatCard
              label="Action Required"
              value={pendingApprovals.length}
              icon="⚠️"
              sub="Pending team approvals"
              color="border-amber-200 bg-amber-50"
              textColor={pendingApprovals.length > 0 ? 'text-amber-600' : 'text-gray-800'}
            />
          </Link>
        )}
        <StatCard label="Casual Leave" value={balance.casual ?? '—'} icon="🏖️" sub="days remaining" color="border-sky-100" />
        <StatCard label="Sick Leave" value={balance.sick ?? '—'} icon="🏥" sub="days remaining" color="border-orange-100" />
        <StatCard label="Earned Leave" value={balance.earned ?? '—'} icon="⭐" sub="days remaining" color="border-teal-100" />
        {user?.role === 'employee' && (
          <StatCard label="Approved" value={stats?.approved ?? 0} icon="✅" sub="this year" color="border-green-100" />
        )}
      </div>

      {/* ── Main Content Area ────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column: My Leaves */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-800">My Recent Leave Requests</h3>
              <Link to="/my-leaves" className="text-green-600 text-sm font-bold hover:text-green-700 hover:underline">View all →</Link>
            </div>

            {loading ? (
              <div className="p-12 flex justify-center"><LoadingSpinner /></div>
            ) : myLeaves.length === 0 ? (
              <div className="p-16 text-center text-gray-400">
                <p className="text-5xl mb-4">📭</p>
                <p className="font-semibold text-gray-600 mb-2">No personal leave requests yet.</p>
                <p className="text-sm">When you apply for a leave, it will appear here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50/80 text-left">
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Type</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">Dates</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Days</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {myLeaves.map(leave => (
                      <tr key={leave._id} className="hover:bg-green-50/30 transition">
                        <td className="px-6 py-4"><LeaveTypeBadge type={leave.leaveType} /></td>
                        <td className="px-6 py-4 text-gray-600 font-medium whitespace-nowrap">
                          {new Date(leave.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                          {' '}-{' '}
                          {new Date(leave.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </td>
                        <td className="px-6 py-4 font-bold text-gray-800">{leave.totalDays}</td>
                        <td className="px-6 py-4"><StatusBadge status={leave.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Status Summary & Manager Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-5">Your Leave Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-yellow-50 rounded-2xl p-4 text-center border border-yellow-100/50">
                <p className="text-3xl font-extrabold text-yellow-600">{stats?.pending ?? 0}</p>
                <p className="text-xs font-bold text-yellow-700/70 uppercase tracking-wider mt-1">Pending</p>
              </div>
              <div className="bg-green-50 rounded-2xl p-4 text-center border border-green-100/50">
                <p className="text-3xl font-extrabold text-green-600">{stats?.approved ?? 0}</p>
                <p className="text-xs font-bold text-green-700/70 uppercase tracking-wider mt-1">Approved</p>
              </div>
              <div className="col-span-2 bg-red-50 rounded-2xl p-4 text-center border border-red-100/50 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-red-700/70 uppercase tracking-wider mb-1">Rejected</p>
                  <p className="text-sm font-medium text-red-600">Leaves this year</p>
                </div>
                <p className="text-3xl font-extrabold text-red-600">{stats?.rejected ?? 0}</p>
              </div>
            </div>
          </div>

          {(user?.role === 'manager' || user?.role === 'admin') && (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-amber-100 transition duration-500"></div>
              <div className="relative z-10">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Team Approvals</h3>
                {pendingApprovals.length > 0 ? (
                  <>
                    <p className="text-gray-500 text-sm mb-5 font-medium">You have <strong className="text-amber-600">{pendingApprovals.length}</strong> leaves awaiting your review.</p>
                    <div className="space-y-3 mb-5">
                      {pendingApprovals.slice(0, 3).map(pa => (
                        <div key={pa._id} className="flex items-center gap-3">
                          <Avatar name={pa.employee.name} email={pa.employee.email} size="sm" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-800 truncate">{pa.employee.name}</p>
                            <p className="text-xs text-gray-400 truncate">{pa.totalDays} day{pa.totalDays > 1 ? 's' : ''} ({pa.leaveType})</p>
                          </div>
                        </div>
                      ))}
                      {pendingApprovals.length > 3 && (
                        <p className="text-xs text-gray-400 font-medium pl-10">+ {pendingApprovals.length - 3} more...</p>
                      )}
                    </div>
                    <Link to="/approvals" className="block w-full text-center bg-amber-100 text-amber-800 font-bold py-3 rounded-xl hover:bg-amber-200 transition">
                      Review Now
                    </Link>
                  </>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-4xl mb-3">✅</p>
                    <p className="text-gray-500 font-medium text-sm">All caught up! No pending requests.</p>
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
