import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Calendar, CheckCircle, Clock, XCircle, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const Dashboard = () => {
    const { user } = useAuth();
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaves = async () => {
            try {
                const endpoint = (user.role === 'manager' || user.role === 'admin')
                    ? '/api/leaves'
                    : '/api/leaves/my-leaves';

                const res = await axios.get(endpoint, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setLeaves(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaves();
    }, [user]);

    const stats = {
        total: leaves.length,
        pending: leaves.filter(l => l.status === 'pending').length,
        approved: leaves.filter(l => l.status === 'approved').length,
        rejected: leaves.filter(l => l.status === 'rejected').length,
    };

    const chartData = {
        labels: ['Pending', 'Approved', 'Rejected'],
        datasets: [
            {
                label: 'Leave Status',
                data: [stats.pending, stats.approved, stats.rejected],
                backgroundColor: [
                    'rgba(245, 158, 11, 0.4)',
                    'rgba(16, 185, 129, 0.4)',
                    'rgba(239, 68, 68, 0.4)',
                ],
                borderColor: [
                    '#f59e0b',
                    '#10b981',
                    '#ef4444',
                ],
                borderWidth: 2,
            },
        ],
    };

    const barData = {
        labels: ['Sick', 'Casual', 'Annual', 'Others'],
        datasets: [
            {
                label: 'Types of Leave',
                data: [
                    leaves.filter(l => l.leaveType === 'sick').length,
                    leaves.filter(l => l.leaveType === 'casual').length,
                    leaves.filter(l => l.leaveType === 'annual').length,
                    leaves.filter(l => !['sick', 'casual', 'annual'].includes(l.leaveType)).length,
                ],
                backgroundColor: 'rgba(56, 189, 248, 0.4)',
                borderColor: '#38bdf8',
                borderWidth: 2,
            }
        ]
    };

    if (loading) return <div className="flex items-center justify-center h-full"><Clock className="animate-spin text-primary-500" size={48} /></div>;

    return (
        <div className="space-y-8">
            <header className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold text-white">Dashboard Overview</h2>
                    <p className="text-slate-400 mt-1">Hello, {user.name}. Here's what's happening with leaves.</p>
                </div>
                <div className="bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700">
                    <span className="text-slate-400 text-sm">Today's Date: </span>
                    <span className="text-white font-medium">{new Date().toLocaleDateString()}</span>
                </div>
            </header>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={<Calendar className="text-blue-400" />} label="Total Applied" value={stats.total} color="blue" />
                <StatCard icon={<Clock className="text-amber-400" />} label="Pending" value={stats.pending} color="amber" />
                <StatCard icon={<CheckCircle className="text-emerald-400" />} label="Approved" value={stats.approved} color="emerald" />
                <StatCard icon={<XCircle className="text-rose-400" />} label="Rejected" value={stats.rejected} color="rose" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart 1 */}
                <div className="lg:col-span-1 glass p-6 rounded-3xl">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <TrendingUp size={20} className="text-primary-400" />
                        Status Distribution
                    </h3>
                    <div className="h-64 flex items-center justify-center">
                        <Pie data={chartData} options={{ maintainAspectRatio: false }} />
                    </div>
                </div>

                {/* Chart 2 */}
                <div className="lg:col-span-2 glass p-6 rounded-3xl">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <TrendingUp size={20} className="text-primary-400" />
                        Leave Type Analytics
                    </h3>
                    <div className="h-64">
                        <Bar data={barData} options={{ maintainAspectRatio: false, scales: { y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' } } } }} />
                    </div>
                </div>
            </div>

            {/* Recent Activity (Table) */}
            <div className="glass rounded-3xl overflow-hidden">
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Your Recent History</h3>
                    <button className="text-primary-400 text-sm hover:underline">View All</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-slate-400 text-sm uppercase">
                            <tr>
                                <th className="px-6 py-4 font-medium">Leave Type</th>
                                <th className="px-6 py-4 font-medium">Duration</th>
                                <th className="px-6 py-4 font-medium">Applied On</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {leaves.slice(0, 5).map((leave) => (
                                <tr key={leave._id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 capitalize font-medium">{leave.leaveType}</td>
                                    <td className="px-6 py-4 text-slate-400">
                                        {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-slate-400">{new Date(leave.appliedDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${leave.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500' :
                                                leave.status === 'pending' ? 'bg-amber-500/10 text-amber-500' :
                                                    'bg-rose-500/10 text-rose-500'
                                            }`}>
                                            {leave.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {leaves.length === 0 && (
                        <div className="p-12 text-center text-slate-500">No leave requests found.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value, color }) => (
    <div className="glass p-6 rounded-3xl border-l-4 border-l-primary-500 group hover:bg-white/15 transition-all">
        <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-2xl bg-slate-900 shadow-inner">
                {icon}
            </div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Live</span>
        </div>
        <div className="space-y-1">
            <h4 className="text-slate-400 text-sm font-medium">{label}</h4>
            <p className="text-3xl font-bold text-white group-hover:scale-110 transition-transform origin-left">{value}</p>
        </div>
    </div>
);

export default Dashboard;
