import React, { useEffect, useState } from 'react';
import { useReimbursement } from '../../context/ReimbursementContext';
import { useToast } from '../../components/common/Toast';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatusBadge, { ReimbursementTypeBadge } from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Avatar from '../../components/common/Avatar';
import { ApplyReimbursementModal } from '../employee/MyReimbursements';

const ReviewModal = ({ reimbursement, onClose, onSubmit }) => {
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);

    const handle = async (status) => {
        setLoading(true);
        await onSubmit(reimbursement._id, status, comment);
        setLoading(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md animate-fade-in">
                <div className="p-8 border-b border-gray-100">
                    <h3 className="text-xl font-extrabold text-gray-800 tracking-tight">Review Reimbursement</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Requested by {reimbursement.employee?.name}</p>
                </div>
                <div className="p-8 space-y-4">
                    <div className="bg-gray-50 rounded-2xl p-5 text-sm space-y-3 border border-gray-100">
                        <div className="flex justify-between items-center"><span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Type</span><ReimbursementTypeBadge type={reimbursement.type} /></div>
                        <div className="flex justify-between items-center"><span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Date</span><span className="font-bold">{new Date(reimbursement.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span></div>
                        <div className="flex justify-between items-center pt-2 border-t border-gray-200/50"><span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Amount</span><span className="text-lg font-black text-blue-600">${reimbursement.amount}</span></div>
                        <div className="pt-2 border-t border-gray-200/50"><span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Description</span><p className="font-medium text-gray-700 leading-relaxed italic">"{reimbursement.description}"</p></div>
                        {reimbursement.receiptUrl && (
                            <div className="pt-2 border-t border-gray-200/50">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Receipt</span>
                                <a href={reimbursement.receiptUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline font-bold inline-flex items-center gap-1">🔗 View Attached Bill</a>
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Review Comment</label>
                        <textarea
                            rows={3}
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm resize-none"
                            placeholder="Add a note (e.g. Approved, amount will be credited next month)"
                        />
                    </div>
                </div>
                <div className="p-8 border-t border-gray-100 flex gap-4">
                    <button onClick={onClose} className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl w-full transition">Back</button>
                    <button
                        onClick={() => handle('rejected')}
                        disabled={loading}
                        className="px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl w-full transition border border-red-200"
                    >
                        Reject
                    </button>
                    <button
                        onClick={() => handle('approved')}
                        disabled={loading}
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl w-full transition"
                    >
                        {loading ? '...' : 'Approve'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const ReimbursementApprovals = () => {
    const { reimbursements, loading, fetchAllReimbursements, reviewReimbursement } = useReimbursement();
    const { toast } = useToast();
    const [filter, setFilter] = useState('pending');
    const [selected, setSelected] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => { fetchAllReimbursements(); }, []);

    const filtered = filter === 'all' ? reimbursements : reimbursements.filter(r => r.status === filter);
    const pending = reimbursements.filter(r => r.status === 'pending').length;

    const handleReview = async (id, status, comment) => {
        try {
            await reviewReimbursement(id, status, comment);
            toast(`Reimbursement ${status} successfully!`, 'success');
        } catch (err) {
            toast(err.response?.data?.message || 'Action failed', 'error');
        }
    };

    return (
        <DashboardLayout title="Reimbursement Approvals">
            {selected && (
                <ReviewModal
                    reimbursement={selected}
                    onClose={() => setSelected(null)}
                    onSubmit={handleReview}
                />
            )}

            {showModal && (
                <ApplyReimbursementModal
                    onClose={() => setShowModal(false)}
                    onSuccess={() => { setShowModal(false); fetchAllReimbursements(); }}
                />
            )}

            {pending > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-3xl p-6 mb-8 flex items-center gap-5 shadow-sm">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-blue-100">⏳</div>
                    <div>
                        <p className="text-lg font-extrabold text-blue-800 tracking-tight">{pending} Approval{pending > 1 ? 's' : ''} Pending</p>
                        <p className="text-blue-700/70 text-sm font-medium">Please review these expenses to ensure employees get paid.</p>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-wrap gap-4 items-center justify-between bg-gray-50/50">
                    <div className="flex gap-2">
                        {['all', 'pending', 'approved', 'rejected'].map(s => (
                            <button
                                key={s}
                                onClick={() => setFilter(s)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${filter === s ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                            >
                                {s} {s === 'pending' && pending > 0 && <span className="ml-1 bg-red-500 text-white rounded-full px-1.5 py-0.5 text-[10px]">{pending}</span>}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{filtered.length} requests total</span>
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-500/20"
                        >
                            + New Expense
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="p-12 flex justify-center"><LoadingSpinner text="Loading requests..." /></div>
                ) : filtered.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">
                        <p className="text-4xl mb-3">🎉</p>
                        <p className="font-medium text-gray-500">No {filter} requests</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-left">
                                    {['Employee', 'Department', 'Type', 'Date', 'Amount', 'Description', 'Receipt', 'Status', 'Review'].map(h => (
                                        <th key={h} className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filtered.map(r => (
                                    <tr key={r._id} className="hover:bg-gray-50 transition">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar name={r.employee?.name} src={r.employee?.profilePic} size="sm" />
                                                <span className="font-bold text-gray-800">{r.employee?.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-gray-500 font-medium">{r.employee?.department}</td>
                                        <td className="px-5 py-4"><ReimbursementTypeBadge type={r.type} /></td>
                                        <td className="px-5 py-4 font-bold text-gray-600 text-xs">
                                            {new Date(r.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                        </td>
                                        <td className="px-5 py-4 font-black text-gray-800">${r.amount}</td>
                                        <td className="px-5 py-4 text-gray-500 italic max-w-[150px] truncate" title={r.description}>{r.description}</td>
                                        <td className="px-5 py-4 text-center">
                                            {r.receiptUrl ? (
                                                <a href={r.receiptUrl} target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-700" title="View Bill">🔗</a>
                                            ) : <span className="text-gray-300">-</span>}
                                        </td>
                                        <td className="px-5 py-4"><StatusBadge status={r.status} /></td>
                                        <td className="px-5 py-4">
                                            {r.status === 'pending' ? (
                                                <button
                                                    onClick={() => setSelected(r)}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition"
                                                >
                                                    Review Now
                                                </button>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                                                    <span className="text-gray-400 font-bold text-[10px] uppercase">{r.reviewedBy?.name?.split(' ')[0] || 'System'}</span>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default ReimbursementApprovals;
