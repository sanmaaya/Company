import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Download, FileText, Settings as SettingsIcon, ShieldCheck, Database, Zap, FileSpreadsheet } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const Settings = () => {
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async (type) => {
        setIsExporting(true);
        const id = toast.loading(`Preparing ${type} export...`);

        // Simulate data preparation
        setTimeout(() => {
            toast.success(`${type} export ready for download`, { id });
            setIsExporting(false);
        }, 2000);
    };

    return (
        <DashboardLayout title="System Settings">
            <div className="max-w-4xl mx-auto py-10 px-6">

                <header className="mb-12 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mb-6 shadow-sm border border-indigo-100 dark:border-indigo-800">
                        <SettingsIcon size={40} className="animate-spin-slow" />
                    </div>
                    <h2 className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter mb-4">Command Center</h2>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs max-w-md mx-auto leading-relaxed">System administration and data management tools for privileged users.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Export Section */}
                    <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border-0 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 transition-all group-hover:bg-blue-500/10"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/40 text-blue-500 flex items-center justify-center">
                                    <Database size={24} />
                                </div>
                                <h3 className="font-black text-slate-800 dark:text-white text-xl">Data Export</h3>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-10 leading-relaxed font-semibold">Generate real-time reports and CSV exports of employee data, leave balance, and project timelines.</p>

                            <div className="space-y-4">
                                <button
                                    disabled={isExporting}
                                    onClick={() => handleExport('Personnel')}
                                    className="w-full flex items-center justify-between p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-blue-500 hover:text-white transition-all group/btn border border-transparent hover:border-blue-400"
                                >
                                    <div className="flex items-center gap-4">
                                        <FileSpreadsheet size={20} className="text-blue-500 group-hover/btn:text-white" />
                                        <span className="font-black text-[10px] uppercase tracking-widest">Personnel Data</span>
                                    </div>
                                    <Download size={16} />
                                </button>

                                <button
                                    disabled={isExporting}
                                    onClick={() => handleExport('Leave History')}
                                    className="w-full flex items-center justify-between p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-500 hover:text-white transition-all group/btn border border-transparent hover:border-indigo-400"
                                >
                                    <div className="flex items-center gap-4">
                                        <FileText size={20} className="text-indigo-500 group-hover/btn:text-white" />
                                        <span className="font-black text-[10px] uppercase tracking-widest">Leave Analytics</span>
                                    </div>
                                    <Download size={16} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Security & Access */}
                    <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border-0 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 transition-all group-hover:bg-rose-500/10"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-900/40 text-rose-500 flex items-center justify-center">
                                    <ShieldCheck size={24} />
                                </div>
                                <h3 className="font-black text-slate-800 dark:text-white text-xl">System Policy</h3>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-10 leading-relaxed font-semibold">Oversee global leave policies and manage administrative permissions across the organization.</p>

                            <div className="pt-6 border-t border-slate-50 dark:border-slate-800 space-y-4">
                                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    <span>API Status</span>
                                    <span className="flex items-center gap-2 text-emerald-500">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        Optimal
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    <span>Privacy Tier</span>
                                    <span className="text-indigo-500">Enterprise</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 bg-indigo-600 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl shadow-indigo-500/40 group">
                    <Zap className="absolute top-[-20%] right-[-5%] w-64 h-64 text-white opacity-[0.05] -rotate-12 transition-transform duration-1000 group-hover:scale-110" />
                    <div className="relative z-10 max-w-md">
                        <h3 className="text-2xl font-black mb-4 tracking-tighter">Automatic Synchronisation</h3>
                        <p className="text-indigo-50/70 text-sm font-bold leading-relaxed mb-8">All personnel changes, leave approvals, and system exports are securely logged and synced across all network nodes in real-time.</p>
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/10 w-fit">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>
                            <span className="text-[10px] font-black uppercase tracking-widest">Network Verified</span>
                        </div>
                    </div>
                </div>

            </div>
        </DashboardLayout>
    );
};

export default Settings;
