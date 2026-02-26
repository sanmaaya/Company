import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useReimbursement } from '../../context/ReimbursementContext';
import { useToast } from '../../components/common/Toast';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatusBadge, { ReimbursementTypeBadge } from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export const ApplyReimbursementModal = ({ onClose, onSuccess }) => {
    const { applyReimbursement } = useReimbursement();
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        type: 'Travel',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        receiptUrl: ''
    });
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, receiptUrl: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await applyReimbursement({ ...formData, amount: Number(formData.amount) });
            toast('Reimbursement submitted successfully', 'success');
            onSuccess();
        } catch (err) {
            toast(err.response?.data?.message || 'Failed to submit', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 animate-fade-in">
                <h2 className="text-xl font-bold text-gray-800 mb-4">New Reimbursement Request</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                            <select
                                value={formData.type}
                                onChange={e => setFormData({ ...formData, type: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm"
                            >
                                <option value="Travel">Travel</option>
                                <option value="Meals">Meals</option>
                                <option value="Supplies">Supplies</option>
                                <option value="Others">Others</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                            <input
                                type="date"
                                required
                                value={formData.date}
                                onChange={e => setFormData({ ...formData, date: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
                        <input
                            type="number"
                            required
                            min="1"
                            value={formData.amount}
                            onChange={e => setFormData({ ...formData, amount: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm"
                            placeholder="e.g. 50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            required
                            rows={3}
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm resize-none"
                            placeholder="Provide details about the expense..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Upload Bill/Receipt (Optional)</label>
                        <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={handleFileChange}
                            className="w-full border border-gray-300 rounded-lg p-2 outline-none bg-gray-50 text-sm"
                        />
                    </div>
                    <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition disabled:bg-blue-400">
                            {loading ? 'Submitting...' : 'Submit Request'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const MyReimbursements = () => {
    const { reimbursements, loading, fetchMyReimbursements, cancelReimbursement } = useReimbursement();
    const { toast } = useToast();
    const [filter, setFilter] = useState('all');
    const [cancelling, setCancelling] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => { fetchMyReimbursements(); }, []);

    const filtered = filter === 'all' ? reimbursements : reimbursements.filter(r => r.status === filter);

    const handleCancel = async (id) => {
        if (!window.confirm('Cancel this reimbursement request?')) return;
        setCancelling(id);
        try {
            await cancelReimbursement(id);
            toast('Reimbursement cancelled successfully', 'success');
        } catch (err) {
            toast(err.response?.data?.message || 'Failed to cancel', 'error');
        } finally {
            setCancelling(null);
        }
    };

    return (
        <DashboardLayout title="My Reimbursements">
            {showModal && <ApplyReimbursementModal onClose={() => setShowModal(false)} onSuccess={() => setShowModal(false)} />}

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="p-5 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex gap-2">
                        {['all', 'pending', 'approved', 'rejected'].map(s => (
                            <button
                                key={s}
                                onClick={() => setFilter(s)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${filter === s ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                    <button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition" >
                        + New Request
                    </button>
                </div>

                {loading ? (
                    <div className="p-12 flex justify-center"><LoadingSpinner text="Loading..." /></div>
                ) : filtered.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">
                        <p className="text-4xl mb-3">🧾</p>
                        <p className="font-medium text-gray-500">No {filter === 'all' ? '' : filter} requests found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-left">
                                    {['Date', 'Type', 'Amount', 'Description', 'Receipt', 'Status', 'Actions'].map(h => (
                                        <th key={h} className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(r => (
                                    <tr key={r._id} className="border-t border-gray-50 hover:bg-gray-50 transition">
                                        <td className="px-5 py-3 text-gray-600 whitespace-nowrap">{new Date(r.date).toLocaleDateString('en-IN')}</td>
                                        <td className="px-5 py-3"><ReimbursementTypeBadge type={r.type} /></td>
                                        <td className="px-5 py-3 font-bold text-gray-800">${r.amount}</td>
                                        <td className="px-5 py-3 text-gray-500 max-w-[150px] truncate" title={r.description}>{r.description}</td>
                                        <td className="px-5 py-3 text-center">
                                            {r.receiptUrl ? (
                                                <a href={r.receiptUrl} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline text-xs font-bold">View</a>
                                            ) : <span className="text-gray-400 text-xs">-</span>}
                                        </td>
                                        <td className="px-5 py-3"><StatusBadge status={r.status} /></td>
                                        <td className="px-5 py-3">
                                            {r.status === 'pending' && (
                                                <button
                                                    onClick={() => handleCancel(r._id)}
                                                    disabled={cancelling === r._id}
                                                    className="text-red-500 hover:text-red-700 text-xs font-semibold disabled:opacity-50"
                                                >
                                                    {cancelling === r._id ? '...' : 'Cancel'}
                                                </button>
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

export default MyReimbursements;
