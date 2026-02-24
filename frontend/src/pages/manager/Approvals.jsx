import React, { useEffect, useState } from 'react';
import { useLeave } from '../../context/LeaveContext';
import { useToast } from '../../components/common/Toast';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatusBadge, { LeaveTypeBadge } from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Avatar from '../../components/common/Avatar';

const ReviewModal = ({ leave, onClose, onSubmit }) => {
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = async (status) => {
    setLoading(true);
    await onSubmit(leave._id, status, comment);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in">
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-bold text-gray-800 text-lg">Review Leave Request</h3>
          <p className="text-gray-500 text-sm mt-1">by {leave.employee?.name}</p>
        </div>
        <div className="p-6 space-y-3">
          <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-2">
            <div className="flex justify-between"><span className="text-gray-500">Type:</span><LeaveTypeBadge type={leave.leaveType} /></div>
            <div className="flex justify-between"><span className="text-gray-500">From:</span><span className="font-medium">{new Date(leave.startDate).toLocaleDateString('en-IN')}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">To:</span><span className="font-medium">{new Date(leave.endDate).toLocaleDateString('en-IN')}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Days:</span><span className="font-bold">{leave.totalDays}</span></div>
            <div className="flex flex-col gap-1"><span className="text-gray-500">Reason:</span><span className="font-medium">{leave.reason}</span></div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Comment (optional)</label>
            <textarea
              rows={2}
              value={comment}
              onChange={e => setComment(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm resize-none"
              placeholder="Add a note to the employee..."
            />
          </div>
        </div>
        <div className="p-6 border-t border-gray-100 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
          <button
            onClick={() => handle('rejected')}
            disabled={loading}
            className="flex-1 py-2.5 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-100 disabled:opacity-60"
          >
            ❌ Reject
          </button>
          <button
            onClick={() => handle('approved')}
            disabled={loading}
            className="flex-1 py-2.5 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 disabled:opacity-60"
          >
            {loading ? '...' : '✅ Approve'}
          </button>
        </div>
      </div>
    </div>
  );
};

const Approvals = () => {
  const { leaves, loading, fetchLeaves, reviewLeave } = useLeave();
  const { toast } = useToast();
  const [filter, setFilter] = useState('pending');
  const [selected, setSelected] = useState(null);

  useEffect(() => { fetchLeaves({ limit: 100 }); }, []);

  const filtered = filter === 'all' ? leaves : leaves.filter(l => l.status === filter);
  const pending = leaves.filter(l => l.status === 'pending').length;

  const handleReview = async (id, status, comment) => {
    try {
      await reviewLeave(id, status, comment);
      toast(`Leave ${status} successfully!`, 'success');
    } catch (err) {
      toast(err.response?.data?.message || 'Action failed', 'error');
    }
  };

  return (
    <DashboardLayout title="Leave Approvals">
      {selected && (
        <ReviewModal
          leave={selected}
          onClose={() => setSelected(null)}
          onSubmit={handleReview}
        />
      )}

      {pending > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-5 flex items-center gap-3">
          <span className="text-2xl">⏳</span>
          <div>
            <p className="font-semibold text-yellow-800">{pending} pending request{pending > 1 ? 's' : ''} awaiting your review</p>
            <p className="text-yellow-700 text-sm">Review and approve/reject to keep your team moving</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-5 border-b border-gray-100 flex flex-wrap gap-2 items-center justify-between">
          <div className="flex gap-2">
            {['all', 'pending', 'approved', 'rejected'].map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${filter === s ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {s} {s === 'pending' && pending > 0 && <span className="ml-1 bg-red-500 text-white rounded-full px-1.5 py-0.5 text-xs">{pending}</span>}
              </button>
            ))}
          </div>
          <span className="text-sm text-gray-400">{filtered.length} records</span>
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
                  {['Employee', 'Dept', 'Type', 'From', 'To', 'Days', 'Reason', 'Status', 'Action'].map(h => (
                    <th key={h} className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(leave => (
                  <tr key={leave._id} className="border-t border-gray-50 hover:bg-gray-50 transition">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar name={leave.employee?.name} size="sm" />
                        <span className="font-medium text-gray-800 text-sm">{leave.employee?.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-500">{leave.employee?.department}</td>
                    <td className="px-5 py-3"><LeaveTypeBadge type={leave.leaveType} /></td>
                    <td className="px-5 py-3 text-gray-600 whitespace-nowrap">{new Date(leave.startDate).toLocaleDateString('en-IN')}</td>
                    <td className="px-5 py-3 text-gray-600 whitespace-nowrap">{new Date(leave.endDate).toLocaleDateString('en-IN')}</td>
                    <td className="px-5 py-3 font-bold text-gray-800">{leave.totalDays}</td>
                    <td className="px-5 py-3 text-gray-500 max-w-[180px] truncate" title={leave.reason}>{leave.reason}</td>
                    <td className="px-5 py-3"><StatusBadge status={leave.status} /></td>
                    <td className="px-5 py-3">
                      {leave.status === 'pending' ? (
                        <button
                          onClick={() => setSelected(leave)}
                          className="bg-green-50 border border-green-200 text-green-700 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-green-100 transition"
                        >
                          Review
                        </button>
                      ) : (
                        <span className="text-gray-400 text-xs">{leave.reviewedBy?.name || '—'}</span>
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

export default Approvals;
