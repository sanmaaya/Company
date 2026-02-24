import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { leaveAPI } from '../utils/api';
import { toast } from 'react-hot-toast';
import { Send, Calendar, FileText, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';

const ApplyLeave = () => {
    const [formData, setFormData] = useState({
        leaveType: 'sick',
        startDate: '',
        endDate: '',
        reason: '',
    });
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await leaveAPI.apply(formData);
            toast.success('Leave Request Submitted! 🎉');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to submit');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <Layout title="Apply for Leave">
            <div className="max-w-4xl mx-auto py-8">
                <header className="mb-10">
                    <h2 className="text-3xl font-syne font-extrabold text-brand-text tracking-tighter">Apply for Leave</h2>
                    <p className="text-brand-muted mt-2 font-medium">Fill the form below to request time off.</p>
                </header>

                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass p-8 rounded-3xl"
                >
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-slate-700 ml-1">Leave Type</label>
                                <select
                                    name="leaveType"
                                    value={formData.leaveType}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-slate-200 focus:border-primary-500 rounded-2xl py-4 px-6 outline-none transition-all placeholder:text-slate-400"
                                >
                                    <option value="sick">Sick Leave</option>
                                    <option value="casual">Casual Leave</option>
                                    <option value="annual">Annual Leave</option>
                                    <option value="maternity">Maternity Leave</option>
                                    <option value="paternity">Paternity Leave</option>
                                </select>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-bold text-slate-700 ml-1">Start Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-6 top-4.5 text-slate-500" size={20} />
                                    <input
                                        name="startDate"
                                        type="date"
                                        required
                                        value={formData.startDate}
                                        onChange={handleChange}
                                        className="w-full bg-white border border-slate-200 focus:border-primary-500 rounded-2xl py-4 pl-16 pr-6 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-bold text-slate-700 ml-1">End Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-6 top-4.5 text-slate-500" size={20} />
                                    <input
                                        name="endDate"
                                        type="date"
                                        required
                                        value={formData.endDate}
                                        onChange={handleChange}
                                        className="w-full bg-white border border-slate-200 focus:border-primary-500 rounded-2xl py-4 pl-16 pr-6 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-slate-300 ml-1">Reason for Leave</label>
                            <div className="relative">
                                <FileText className="absolute left-6 top-5 text-slate-500" size={20} />
                                <textarea
                                    name="reason"
                                    rows="4"
                                    required
                                    value={formData.reason}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-slate-200 focus:border-primary-500 rounded-2xl py-4 pl-16 pr-6 outline-none transition-all resize-none placeholder:text-slate-400"
                                    placeholder="Briefly describe why you are taking leave..."
                                ></textarea>
                            </div>
                        </div>

                        <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100 space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-brand-muted font-bold uppercase tracking-wider text-[10px]">Policy Agreement</span>
                                <span className="text-emerald-600 cursor-help font-bold underline decoration-emerald-200 underline-offset-4">Read rules</span>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                By submitting this request, you confirm that the information provided is accurate and complies with the company's leave policies. Requests should be submitted at least 48 hours in advance for non-emergencies.
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => navigate('/dashboard')}
                                className="flex-1 py-4 px-6 border border-brand-border hover:bg-emerald-50 rounded-2xl font-bold text-brand-muted transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-[2] bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-4 px-6 rounded-2xl shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    <>
                                        <span>Submit Request</span>
                                        <Send className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" size={18} />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </Layout>
    );
};

export default ApplyLeave;
