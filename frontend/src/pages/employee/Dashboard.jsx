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
import { Layout, ListTodo, CheckCircle2, Clock, MapPin, Briefcase, CheckSquare, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
const StatCard = ({ label, value, icon, color, sub, textColor = 'text-slate-800' }) => (
  <div className={`bg-white rounded-[2rem] border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-2 p-7 relative overflow-hidden group`}>
    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${color} mix-blend-soft-light`} />
    <div className="flex items-start justify-between relative z-10">
      <div className="flex-1">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 leading-none">{label}</p>
        <p className={`text-4xl font-black tracking-tighter ${textColor}`}>{value}</p>
        {sub && <p className="text-[10px] text-slate-500 mt-3 font-bold uppercase tracking-wider flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-blue-500" /> {sub}
        </p>}
      </div>
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-slate-50 shadow-inner border border-white text-3xl shrink-0 ml-3 group-hover:scale-110 transition-transform duration-500">
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
  const [overdueTasks, setOverdueTasks] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [loadingWatch, setLoadingWatch] = useState(false);

  useEffect(() => {
    fetchStats();
    fetchMyTasks();
    if (user?.role === 'manager' || user?.role === 'admin') {
      setLoadingWatch(true);
      Promise.all([
        api.get('/leaves', { params: { status: 'pending', limit: 20 } }),
        api.get('/projects/tasks/overdue'),
        api.get('/projects')
      ]).then(([leavesRes, overdueRes, projectsRes]) => {
        const teamPending = leavesRes.data.leaves.filter(l => l.employee?._id !== user?._id);
        setPendingApprovals(teamPending);
        setOverdueTasks(overdueRes.data.tasks || []);
        setAllProjects(projectsRes.data.projects || []);
      })
        .catch(console.error)
        .finally(() => setLoadingWatch(false));
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

  const handleTaskComplete = async (taskId) => {
    try {
      const payload = { status: 'completed' };
      const res = await api.put(`/projects/tasks/${taskId}`, payload);

      if (res.data.success) {
        toast.success("Mission accomplished!");
        fetchMyTasks(); // Refresh list to remove it from "Active"
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to complete task");
    }
  };

  const balance = user?.leaveBalance || {};
  const activeTasks = myTasks.filter(t => t.status !== 'completed');

  return (
    <DashboardLayout title="Operational Dashboard">
      {/* ── Welcome Banner ─────────────────────────────────── */}
      <div className="bg-slate-900 rounded-[3rem] p-10 mb-10 text-white shadow-2xl relative overflow-hidden group border border-white/10 ring-1 ring-blue-500/20">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex items-center gap-8">
            <div className="relative">
              <Avatar name={user?.name} email={user?.email} src={user?.profilePic} size="xl" className="ring-8 ring-white/5 shadow-2xl" />
              <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-blue-500 border-4 border-slate-900 rounded-full flex items-center justify-center text-white shadow-xl">
                <CheckCircle2 size={18} />
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em] mb-3 opacity-60">Operations Hub</p>
              <h2 className="text-4xl md:text-5xl font-black mb-3 tracking-tighter capitalize">
                {user?.name?.split(' ')[0]}
              </h2>
              <div className="flex items-center gap-4 text-blue-50/60 font-bold text-[9px] uppercase tracking-widest">
                <span className="flex items-center gap-1.5"><Briefcase size={12} className="text-blue-500" /> {user?.title}</span>
                <span className="flex items-center gap-1.5"><MapPin size={12} className="text-blue-500" /> {user?.department}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-4 shrink-0">
            <Link to="/projects" className="bg-white/5 backdrop-blur-xl border border-white/10 text-white font-black px-8 py-4 rounded-2xl hover:bg-white/10 transition-all text-[10px] uppercase tracking-widest">
              Board
            </Link>
            <Link to="/apply-leave" className="bg-blue-600 text-white font-black px-8 py-4 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-blue-500/20 text-[10px] uppercase tracking-widest border border-blue-400">
              Apply Leave
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-10">
        {/* Left Column (3/4) */}
        <div className="xl:col-span-3 space-y-10">

          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard label="Pending Tasks" value={activeTasks.length} icon="🎯" sub="Active Now" color="from-blue-500 to-indigo-600" textColor="text-blue-600" />
            <StatCard label="Casual Leave" value={balance.casual ?? 0} icon="🏖️" sub="Available" color="from-indigo-500 to-emerald-600" />
            <StatCard label="Sick Leave" value={balance.sick ?? 0} icon="💊" sub="Available" color="from-rose-500 to-pink-600" />
            <StatCard label="Earned Leave" value={balance.earned ?? 0} icon="🌟" sub="Available" color="from-amber-500 to-orange-500" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7">
              <LeaveCalendar />
            </div>

            <div className="lg:col-span-5 flex flex-col h-full">
              <div className="bg-white rounded-[2.5rem] p-8 border border-slate-50 shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col h-full">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-3">
                    <ListTodo size={20} className="text-blue-500" />
                    My Roadmap
                  </h3>
                  <Link to="/projects" className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors">Details →</Link>
                </div>

                <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar max-h-[400px]">
                  {myTasks.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-200 py-10 opacity-70">
                      <Layout size={40} className="mb-4" />
                      <p className="font-black uppercase tracking-[0.2em] text-[10px]">No tasks assigned</p>
                    </div>
                  ) : activeTasks.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-blue-500 py-10 opacity-70">
                      <CheckCircle2 size={40} className="mb-4" />
                      <p className="font-black uppercase tracking-[0.2em] text-[10px]">Mission Clear</p>
                    </div>
                  ) : (
                    activeTasks.map(t => (
                      <div key={t._id} className="p-4 rounded-2xl bg-slate-50 border border-transparent hover:border-blue-100 hover:bg-white transition-all flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                          <button onClick={() => handleTaskComplete(t._id)} className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-blue-500 shadow-sm hover:bg-blue-600 hover:text-white transition-all">
                            <CheckSquare size={18} />
                          </button>
                          <div className="min-w-0">
                            <h4 className="text-xs font-black text-slate-800 truncate tracking-tight">{t.title}</h4>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{t.project?.name}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black text-rose-500">{format(new Date(t.deadline), 'MMM dd')}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {myTasks.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-slate-50">
                    <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">
                      <span>Velocity</span>
                      <span className="text-blue-600">{Math.round((myTasks.filter(t => t.status === 'completed').length / myTasks.length) * 100)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${(myTasks.filter(t => t.status === 'completed').length / myTasks.length) * 100}%` }} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1/4) */}
        <div className="space-y-10">
          {user?.role !== 'admin' && <CompanyStatusList />}

          {(user?.role === 'manager' || user?.role === 'admin') && (
            <div className="space-y-10">
              {/* Risk Monitor */}
              <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-slate-50 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping" />
                    Risk Monitor
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-rose-500 bg-rose-50 px-3 py-1 rounded-full">Delays</span>
                </h3>

                <div className="space-y-4">
                  {overdueTasks.length === 0 ? (
                    <div className="py-10 text-center opacity-50 grayscale">
                      <CheckCircle2 size={32} className="mx-auto text-emerald-500 mb-2" />
                      <p className="text-[9px] font-black uppercase tracking-widest text-emerald-500">All timelines clear</p>
                    </div>
                  ) : (
                    overdueTasks.slice(0, 5).map(task => (
                      <div key={task._id} className="p-4 rounded-3xl bg-slate-50 border border-transparent hover:border-rose-100 transition-all">
                        <div className="flex items-center gap-4">
                          <Avatar src={task.assignedTo?.profilePic} name={task.assignedTo?.name} size="xs" />
                          <div className="min-w-0 flex-1">
                            <h4 className="text-[11px] font-black text-slate-800 truncate">{task.assignedTo?.name}</h4>
                            <p className="text-[9px] font-bold text-rose-500 uppercase tracking-tight truncate mt-0.5">{task.title}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Portfolio Card */}
              <div className="bg-[#0f172a] rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 mb-8">Active Portfolio</h3>

                <div className="space-y-5">
                  {allProjects.slice(0, 3).map(proj => (
                    <div key={proj._id} className="space-y-3">
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                        <span className="truncate pr-4 text-slate-400">{proj.name}</span>
                        <span className={`${proj.status === 'completed' ? 'text-emerald-400' : 'text-blue-400'}`}>{proj.status}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full ${proj.status === 'completed' ? 'bg-emerald-500' : 'bg-blue-600'}`} style={{ width: proj.status === 'completed' ? '100%' : '65%' }} />
                      </div>
                    </div>
                  ))}
                </div>

                <Link to="/projects" className="mt-10 w-full py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-[9px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-2">
                  Open Global Board <ExternalLink size={12} />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
