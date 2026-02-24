import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLeave } from '../../context/LeaveContext';
import { useToast } from '../../components/common/Toast';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatusBadge, { LeaveTypeBadge } from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const MyLeaves = () => {
  const { leaves, loading, fetchLeaves, cancelLeave } = useLeave();
  const { toast } = useToast();
  const [filter, setFilter] = useState('all');
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => { fetchLeaves({ limit: 50 }); }, []);

  const filtered = filter === 'all' ? leaves : leaves.filter(l => l.status === filter);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this leave request?')) return;
    setCancelling(id);
    try {
      await cancelLeave(id);
      toast('Leave cancelled successfully', 'success');
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to cancel', 'error');
    } finally {
      setCancelling(null);
    }
  };

  return (
    <DashboardLayout title="My Leave Requests">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-5 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            {['all', 'pending', 'approved', 'rejected'].map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${filter === s ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {s}
              </button>
            ))}
          </div>
          <Link to="/apply-leave" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">
            + Apply Leave
          </Link>
        </div>

        {loading ? (
          <div className="p-12 flex justify-center"><LoadingSpinner text="Loading..." /></div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <p className="text-4xl mb-3">📭</p>
            <p className="font-medium text-gray-500">No {filter === 'all' ? '' : filter} leave requests found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  {['Type', 'From', 'To', 'Days', 'Reason', 'Status', 'Reviewed By', 'Comment', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(leave => (
                  <tr key={leave._id} className="border-t border-gray-50 hover:bg-gray-50 transition">
                    <td className="px-5 py-3"><LeaveTypeBadge type={leave.leaveType} /></td>
                    <td className="px-5 py-3 text-gray-600 whitespace-nowrap">{new Date(leave.startDate).toLocaleDateString('en-IN')}</td>
                    <td className="px-5 py-3 text-gray-600 whitespace-nowrap">{new Date(leave.endDate).toLocaleDateString('en-IN')}</td>
                    <td className="px-5 py-3 font-bold text-gray-800">{leave.totalDays}</td>
                    <td className="px-5 py-3 text-gray-500 max-w-[180px] truncate" title={leave.reason}>{leave.reason}</td>
                    <td className="px-5 py-3"><StatusBadge status={leave.status} /></td>
                    <td className="px-5 py-3 text-gray-500">{leave.reviewedBy?.name || '—'}</td>
                    <td className="px-5 py-3 text-gray-500 max-w-[150px] truncate" title={leave.reviewComment}>{leave.reviewComment || '—'}</td>
                    <td className="px-5 py-3">
                      {leave.status === 'pending' && (
                        <button
                          onClick={() => handleCancel(leave._id)}
                          disabled={cancelling === leave._id}
                          className="text-red-500 hover:text-red-700 text-xs font-semibold disabled:opacity-50"
                        >
                          {cancelling === leave._id ? '...' : 'Cancel'}
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

export default MyLeaves;
