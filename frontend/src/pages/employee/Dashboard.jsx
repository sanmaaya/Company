import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLeave } from '../../context/LeaveContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Avatar from '../../components/common/Avatar';
import LeaveCalendar from '../../components/common/LeaveCalendar';
import CompanyStatusList from '../../components/common/CompanyStatusList';
import api from '../../utils/api';
import { Layout, ListTodo, CheckCircle2, Clock, MapPin, Briefcase } from 'lucide-react';
import { format } from 'date-fns';

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
  const { stats, fetchStats } = useLeave();
  const [myTasks, setMyTasks] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchMyTasks();
    if (user?.role === 'manager' || user?.role === 'admin') {
      api.get('/leaves', { params: { status: 'pending', limit: 20 } })
        .then(res => {
          const teamPending = res.data.leaves.filter(l => l.employee?._id !== user?._id);
          setPendingApprovals(teamPending);
        })
        .catch(console.error);
    }
  }, [user]);

  const fetchMyTasks = async () => {
    try {
      const { data } = await api.get('/projects/my-tasks');
      setMyTasks(data.tasks || []);
    } catch (err) {
      console.error('Task fetch error:', err);
    }
  };

  const balance = user?.leaveBalance || {};
  const activeTasks = myTasks.filter(t => t.status !== 'completed');

  return (
    <DashboardLayout title="Operational Dashboard">
      {/* ── Welcome Banner ─────────────────────────────────── */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-800 dark:from-emerald-900 dark:to-slate-950 rounded-[3rem] p-10 mb-10 text-white shadow-2xl relative overflow-hidden group border border-white/10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white dark:bg-emerald-500 opacity-10 dark:opacity-5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:opacity-20 transition-opacity"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-400 opacity-10 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
            <div className="relative">
              <Avatar name={user?.name} email={user?.email} src={user?.profilePic} size="xl" className="ring-[8px] ring-white/10 shadow-2xl scale-110" />
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 border-4 border-emerald-600 dark:border-emerald-900 rounded-full flex items-center justify-center text-white shadow-xl">
                <CheckCircle2 size={18} />
              </div>
            </div>
            <div>
              <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter">
                {user?.name?.split(' ')[0]}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-emerald-50 font-bold text-xs">
                <span className="flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full border border-white/5 backdrop-blur-sm"><Briefcase size={14} /> {user?.title}</span>
                <span className="flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full border border-white/5 backdrop-blur-sm"><MapPin size={14} /> {user?.department}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
            <Link to="/projects" className="bg-white/10 backdrop-blur-md border border-white/20 text-white font-black px-8 py-4 rounded-2xl hover:bg-white/20 transition-all shadow-xl whitespace-nowrap tracking-tight flex items-center justify-center gap-2">
              <ListTodo size={20} /> View Board
            </Link>
            <Link to="/apply-leave" className="bg-emerald-400 text-emerald-950 font-black px-8 py-4 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-emerald-900/40 whitespace-nowrap tracking-tight text-center">
              + New Request
            </Link>
          </div>
        </div>
      </div>  {/* ── Main Dash Grid ─────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">

        {/* Left 3 Cols: Stats & Calendar & Tasks */}
        <div className="xl:col-span-3 space-y-8">

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard label="Pending Tasks" value={activeTasks.length} icon="🎯" sub="Active Missions" color="border-blue-100 dark:border-blue-900/30 bg-blue-50/30" textColor="text-blue-600 dark:text-blue-400" />
            <StatCard label="Casual Leave" value={balance.casual ?? 0} icon="🏖️" sub="Available Units" color="border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/30" />
            <StatCard label="Sick Leave" value={balance.sick ?? 0} icon="💊" sub="Available Units" color="border-rose-100 dark:border-rose-900/30 bg-rose-50/30" />
            <StatCard label="Earned Leave" value={balance.earned ?? 0} icon="🌟" sub="Available Units" color="border-amber-100 dark:border-amber-900/30 bg-amber-50/30" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <LeaveCalendar />

            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-8 flex flex-col min-h-[480px]">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">Assigned Tasks</h3>
                <Link to="/projects" className="text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:underline">Full Board →</Link>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-2">
                {myTasks.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-300 opacity-60">
                    <Layout size={48} className="mb-4" />
                    <p className="font-black uppercase tracking-widest text-xs">No tasks assigned</p>
                  </div>
                ) : activeTasks.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-emerald-500 opacity-60">
                    <CheckCircle2 size={48} className="mb-4" />
                    <p className="font-black uppercase tracking-widest text-xs">All missions accomplished</p>
                  </div>
                ) : (
                  activeTasks.map(t => (
                    <div key={t._id} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 flex items-center gap-4 group hover:border-emerald-500/50 transition-all">
                      <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-emerald-500 shadow-sm group-hover:bg-emerald-500 group-hover:text-white transition-all">
                        <Clock size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-black text-slate-800 dark:text-white truncate tracking-tight">{t.title}</h4>
                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t.project?.name}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Due</p>
                        <p className="text-[10px] font-black text-rose-500">{format(new Date(t.deadline), 'MMM dd')}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {myTasks.length > 0 && (
                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Progress</p>
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{Math.round((myTasks.filter(t => t.status === 'completed').length / myTasks.length) * 100)}% Complete</p>
                  </div>
                  <div className="mt-2 h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-1000"
                      style={{ width: `${(myTasks.filter(t => t.status === 'completed').length / myTasks.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Presence & Status */}
        <div className="space-y-8">
          <CompanyStatusList />

          {(user?.role === 'manager' || user?.role === 'admin') && pendingApprovals.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              <h3 className="text-xl font-black text-slate-800 dark:text-white mb-6">Action Items</h3>
              <div className="space-y-4">
                {pendingApprovals.slice(0, 4).map(pa => (
                  <div key={pa._id} className="flex items-center gap-3">
                    <Avatar src={pa.employee.profilePic} name={pa.employee.name} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-black text-slate-800 dark:text-white truncate">{pa.employee.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{pa.leaveType} • {pa.totalDays}d</p>
                    </div>
                  </div>
                ))}
                <Link to="/approvals" className="block w-full text-center bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 font-black py-4 rounded-2xl hover:bg-amber-100 transition-all mt-4 uppercase tracking-widest text-[10px]">
                  Review All {pendingApprovals.length}
                </Link>
              </div>
            </div>
          )}

          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden ring-1 ring-white/10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-4 italic leading-none">Authentication Node</p>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Employee ID</span>
                <span className="text-[10px] font-black font-mono">#{user?._id?.slice(-8).toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Role Level</span>
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{user?.role}</span>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-white/10 flex justify-center">
              <div className="w-full h-8 bg-gradient-to-r from-emerald-500/10 via-emerald-500 to-emerald-500/10 rounded-full flex items-center justify-center opacity-30">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout >
  );
};

export default Dashboard;
