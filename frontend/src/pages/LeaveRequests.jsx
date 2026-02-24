import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { leaveAPI } from '../utils/api';
import { toast } from 'react-hot-toast';
import { Check, X, Search, Filter, MessageSquare, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/Layout';

const LeaveRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('pending');
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [reviewMessage, setReviewMessage] = useState('');
    const [actionLoading, setActionLoading] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        fetchRequests();
    }, [user]);

    const fetchRequests = async () => {
        try {
            const res = await leaveAPI.getAllLeaves();
            const data = Array.isArray(res.data) ? res.data : (res.data?.leaves || res.data?.data || []);
            setRequests(data);
        } catch (err) {
            console.error(err);
            toast.error('Failed to fetch requests');
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, status) => {
        setActionLoading(true);
        try {
            await leaveAPI.updateLeave(id, { status, reviewComment: reviewMessage });
            toast.success(`Leave ${status} successfully`);
            fetchRequests();
            setSelectedRequest(null);
            setReviewMessage('');
        } catch (err) {
            toast.error('Failed to update status');
        } finally {
            setActionLoading(false);
        }
    };

    const filteredRequests = requests.filter(req => filter === 'all' || req.status === filter);

    if (loading) return <Layout title="Leave Requests"><div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-emerald-500" size={48} /></div></Layout>;

    return (
        <Layout title="Leave Requests">
            <div className="space-y-8">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-syne font-extrabold text-brand-text tracking-tighter">Leave Requests</h2>
                        <p className="text-brand-muted mt-1 font-medium">Manage and respond to employee leave applications.</p>
                    </div>

                    <div className="flex bg-white p-1 rounded-2xl border border-brand-border shadow-sm">
                        {['pending', 'approved', 'rejected', 'all'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all capitalize ${filter === f ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200' : 'text-brand-muted hover:text-emerald-600'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </header>

                {/* Requests Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <AnimatePresence mode='popLayout'>
                        {filteredRequests.map((req) => (
                            <motion.div
                                key={req._id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="glass p-6 rounded-3xl group"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-lg font-bold text-primary-600">
                                            {req.user?.name?.[0]}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900">{req.user?.name}</h4>
                                            <p className="text-xs text-slate-500 font-medium">{req.user?.department} • {req.user?.email}</p>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${req.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500' :
                                        req.status === 'pending' ? 'bg-amber-500/10 text-amber-500' :
                                            'bg-rose-500/10 text-rose-500'
                                        }`}>
                                        {req.status}
                                    </span>
                                </div>

                                <div className="bg-emerald-50/30 border border-emerald-100 rounded-2xl p-4 mb-6 grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-slate-500 text-xs mb-1">Leave Type</p>
                                        <p className="font-bold capitalize text-slate-800">{req.leaveType}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500 text-xs mb-1">Applied On</p>
                                        <p className="font-semibold text-slate-200">{new Date(req.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-slate-500 text-xs mb-1">Duration</p>
                                        <p className="font-semibold text-slate-200">
                                            {new Date(req.startDate).toLocaleDateString()} to {new Date(req.endDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <p className="text-slate-500 text-xs mb-2">Reason</p>
                                    <p className="text-sm text-slate-600 italic leading-relaxed font-medium">"{req.reason}"</p>
                                </div>

                                {req.status === 'pending' && (user?.role === 'manager' || user?.role === 'admin') ? (
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setSelectedRequest(req)}
                                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all border border-slate-200"
                                        >
                                            <MessageSquare size={18} />
                                            <span>Review</span>
                                        </button>
                                        <button
                                            onClick={() => handleAction(req._id, 'approved')}
                                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold shadow-lg shadow-emerald-900/20 transition-all"
                                        >
                                            <Check size={18} />
                                            <span>Approve</span>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="pt-4 border-t border-emerald-100">
                                        <p className="text-xs text-emerald-600 font-bold">
                                            Reviewed by {req.reviewedBy === user._id ? 'You' : 'another Manager'}
                                        </p>
                                        {req.reviewMessage && (
                                            <p className="text-sm text-slate-600 mt-2 font-medium">Note: {req.reviewMessage}</p>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Review Modal */}
                {selectedRequest && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass w-full max-w-lg p-8 rounded-3xl"
                        >
                            <h3 className="text-xl font-syne font-extrabold text-brand-text mb-6 tracking-tight">Review Leave Request</h3>

                            <div className="space-y-4 mb-8">
                                <label className="text-sm font-medium text-slate-400">Add a message (optional)</label>
                                <textarea
                                    value={reviewMessage}
                                    onChange={(e) => setReviewMessage(e.target.value)}
                                    rows="4"
                                    className="w-full bg-white border border-slate-200 focus:border-primary-500 rounded-2xl py-4 px-6 outline-none transition-all resize-none text-slate-800 placeholder:text-slate-400"
                                    placeholder="Explain the reason for approval or rejection..."
                                ></textarea>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setSelectedRequest(null)}
                                    className="flex-1 py-4 text-slate-500 font-bold hover:text-slate-800 transition-colors"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() => handleAction(selectedRequest._id, 'rejected')}
                                    className="flex-1 py-4 bg-rose-600/20 hover:bg-rose-600/30 text-rose-500 rounded-2xl font-bold transition-all border border-rose-500/20"
                                >
                                    Reject
                                </button>
                                <button
                                    onClick={() => handleAction(selectedRequest._id, 'approved')}
                                    className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
                                >
                                    {actionLoading ? <Loader2 className="animate-spin" size={20} /> : 'Approve'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {filteredRequests.length === 0 && (
                    <div className="py-20 text-center">
                        <div className="inline-flex p-6 bg-slate-900 rounded-full mb-4 text-slate-700 border border-slate-800">
                            <Filter size={48} />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-400">No requests found here</h3>
                        <p className="text-slate-500 mt-2">Try changing the filter or wait for new applications.</p>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default LeaveRequests;
