import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Avatar from '../../components/common/Avatar';
import api from '../../utils/api';
import { Mail, Phone, Search, Building2, ExternalLink } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Contacts = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.get('/users', { params: { all: 'true' } });
                setUsers(res.data.users || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <LoadingSpinner />;

    return (
        <DashboardLayout title="Team Directory">
            <div className="mb-12 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="relative group">
                    <div className="absolute -left-4 top-0 w-1 h-12 bg-blue-600 rounded-full" />
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Connect with the Team</h2>
                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                        {users.length} Active Personnel In Network
                    </p>
                </div>
                <div className="relative w-full max-w-xl">
                    <div className="absolute inset-0 bg-blue-500/5 blur-2xl rounded-full" />
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name, expertise or department..."
                        className="w-full pl-16 pr-8 py-5 rounded-[2rem] bg-white border border-slate-100 shadow-2xl shadow-slate-200/50 focus:outline-none focus:ring-4 focus:ring-blue-500/10 font-black text-sm text-slate-800 transition-all placeholder:text-slate-300 relative z-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
                {filteredUsers.map(u => (
                    <div key={u._id} className="bg-white rounded-[2.5rem] p-8 border-0 shadow-[0_8px_40px_rgb(0,0,0,0.03)] hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-700 group flex flex-col h-full relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-transparent rounded-bl-[5rem] group-hover:scale-150 transition-transform duration-1000" />

                        <div className="flex items-start justify-between mb-8 relative z-10">
                            <div className="relative">
                                <div className="absolute inset-0 bg-blue-500 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
                                <Avatar src={u.profilePic} name={u.name} size="xl" className="ring-8 ring-slate-50 relative z-10 group-hover:scale-105 transition-transform duration-500 shadow-xl" />
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <span className="text-[9px] font-black bg-slate-900 text-white px-3 py-1 rounded-full uppercase tracking-widest">{u.role}</span>
                                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                            </div>
                        </div>

                        <div className="mb-8 flex-1 relative z-10 text-left">
                            <h3 className="font-black text-slate-800 text-xl tracking-tight mb-2 group-hover:text-blue-600 transition-colors">{u.name}</h3>
                            <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-4">{u.title}</p>

                            <div className="space-y-4 pt-4 border-t border-slate-50">
                                <div className="flex items-center gap-3 text-slate-400 group/item">
                                    <Building2 size={16} className="text-slate-300 group-hover/item:text-blue-500 transition-colors" />
                                    <span className="text-[11px] font-bold uppercase tracking-widest">{u.department || 'Operations'}</span>
                                </div>
                                <a href={`mailto:${u.email}`} className="flex items-center gap-3 text-slate-600 hover:text-blue-600 transition-all group/item">
                                    <Mail size={16} className="text-blue-300 group-hover/item:text-blue-600" />
                                    <span className="text-[11px] font-black tracking-tight truncate">{u.email}</span>
                                </a>
                                <a href={`tel:${u.phoneNumber}`} className="flex items-center gap-3 text-slate-600 hover:text-blue-600 transition-all group/item">
                                    <Phone size={16} className="text-emerald-300 group-hover/item:text-emerald-600" />
                                    <span className="text-[11px] font-black tracking-tight">{u.phoneNumber || '+91 000 000 000'}</span>
                                </a>
                            </div>
                        </div>

                        <button className="mt-8 py-4 rounded-2xl bg-slate-50 hover:bg-slate-900 hover:text-white transition-all text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 border border-slate-100 flex items-center justify-center gap-2 group/btn relative z-10">
                            View Profile <ExternalLink size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                    </div>
                ))}
            </div>
            {filteredUsers.length === 0 && (
                <div className="py-20 text-center">
                    <p className="text-slate-300 font-black uppercase tracking-[0.5em] text-sm">No Operatives Found</p>
                </div>
            )}
        </DashboardLayout>
    );
};

export default Contacts;
