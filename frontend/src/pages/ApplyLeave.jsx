import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Send, Calendar, FileText, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

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
            await axios.post('/api/leaves', formData, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            toast.success('Leave Request Submitted!');
            navigate('/');
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
        <div className="max-w-4xl mx-auto py-8">
            <header className="mb-10">
                <h2 className="text-3xl font-bold text-white">Apply for Leave</h2>
                <p className="text-slate-400 mt-2">Fill the form below to request time off.</p>
            </header>

            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass p-8 rounded-3xl"
            >
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-slate-300 ml-1">Leave Type</label>
                            <select
                                name="leaveType"
                                value={formData.leaveType}
                                onChange={handleChange}
                                className="w-full bg-slate-900/50 border border-slate-700 focus:border-primary-500 rounded-2xl py-4 px-6 outline-none transition-all appearance-none cursor-pointer"
                            >
                                <option value="sick">Sick Leave</option>
                                <option value="casual">Casual Leave</option>
                                <option value="annual">Annual Leave</option>
                                <option value="maternity">Maternity Leave</option>
                                <option value="paternity">Paternity Leave</option>
                            </select>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-slate-300 ml-1">Start Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-6 top-4.5 text-slate-500" size={20} />
                                <input
                                    name="startDate"
                                    type="date"
                                    required
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    className="w-full bg-slate-900/50 border border-slate-700 focus:border-primary-500 rounded-2xl py-4 pl-16 pr-6 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-slate-300 ml-1">End Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-6 top-4.5 text-slate-500" size={20} />
                                <input
                                    name="endDate"
                                    type="date"
                                    required
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    className="w-full bg-slate-900/50 border border-slate-700 focus:border-primary-500 rounded-2xl py-4 pl-16 pr-6 outline-none transition-all"
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
                                className="w-full bg-slate-900/50 border border-slate-700 focus:border-primary-500 rounded-2xl py-4 pl-16 pr-6 outline-none transition-all resize-none"
                                placeholder="Briefly describe why you are taking leave..."
                            ></textarea>
                        </div>
                    </div>

                    <div className="bg-slate-900/40 p-6 rounded-2xl border border-white/5 space-y-4">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-400">Policy Agreement</span>
                            <span className="text-primary-400 cursor-help underline decoration-primary-900 underline-offset-4">Read rules</span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            By submitting this request, you confirm that the information provided is accurate and complies with the company's leave policies. Requests should be submitted at least 48 hours in advance for non-emergencies.
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="flex-1 py-4 px-6 border border-slate-700 hover:bg-white/5 rounded-2xl font-semibold transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-[2] bg-primary-600 hover:bg-primary-500 text-white font-bold py-4 px-6 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
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
    );
};

export default ApplyLeave;
