import React, { useEffect, useState } from 'react';
import { useLeave } from '../../context/LeaveContext';
import { useToast } from '../../components/common/Toast';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatusBadge, { LeaveTypeBadge } from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminLeaves = () => {
  const { leaves, loading, fetchLeaves, reviewLeave } = useLeave();
  const { toast } = useToast();
  const [filter, setFilter] = useState('all');
  const [reviewing, setReviewing] = useState(null);

  useEffect(() => { fetchLeaves({ limit: 200 }); }, []);

  const filtered = filter === 'all' ? leaves : leaves.filter(l => l.status === filter);

  const quickAction = async (id, status) => {
    setReviewing(id + status);
    try {
      await reviewLeave(id, status, '');
      toast(`Leave ${status}`, 'success');
    } catch (err) {
      toast(err.response?.data?.message || 'Action failed', 'error');
    } finally {
      setReviewing(null);
    }
  };

  return (
    <DashboardLayout title="All Leave Requests">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-5 border-b border-gray-100 flex flex-wrap gap-3 items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {['all', 'pending', 'approved', 'rejected'].map(s => (
              <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${filter === s ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {s} ({s === 'all' ? leaves.length : leaves.filter(l => l.status === s).length})
              </button>
            ))}
          </div>
          <span className="text-sm text-gray-400">{filtered.length} results</span>
        </div>

        {loading ? (
          <div className="p-12 flex justify-center"><LoadingSpinner text="Loading all leave records..." /></div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400"><p className="text-4xl mb-3">📭</p><p>No records found</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  {['Employee', 'Dept', 'Type', 'From', 'To', 'Days', 'Reason', 'Status', 'Reviewed By', 'Applied', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(leave => (
                  <tr key={leave._id} className="border-t border-gray-50 hover:bg-gray-50 transition">
                    <td className="px-4 py-3 font-medium text-gray-800">{leave.employee?.name}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{leave.employee?.department}</td>
                    <td className="px-4 py-3"><LeaveTypeBadge type={leave.leaveType} /></td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap text-xs">{new Date(leave.startDate).toLocaleDateString('en-IN')}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap text-xs">{new Date(leave.endDate).toLocaleDateString('en-IN')}</td>
                    <td className="px-4 py-3 font-bold text-gray-800">{leave.totalDays}</td>
                    <td className="px-4 py-3 text-gray-500 max-w-[150px] truncate text-xs" title={leave.reason}>{leave.reason}</td>
                    <td className="px-4 py-3"><StatusBadge status={leave.status} /></td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{leave.reviewedBy?.name || '—'}</td>
                    <td className="px-4 py-3 text-gray-400 whitespace-nowrap text-xs">{new Date(leave.createdAt).toLocaleDateString('en-IN')}</td>
                    <td className="px-4 py-3">
                      {leave.status === 'pending' ? (
                        <div className="flex gap-1">
                          <button
                            onClick={() => quickAction(leave._id, 'approved')}
                            disabled={!!reviewing}
                            className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold hover:bg-green-200 disabled:opacity-50"
                          >
                            ✅
                          </button>
                          <button
                            onClick={() => quickAction(leave._id, 'rejected')}
                            disabled={!!reviewing}
                            className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-semibold hover:bg-red-200 disabled:opacity-50"
                          >
                            ❌
                          </button>
                        </div>
                      ) : <span className="text-gray-300 text-xs">—</span>}
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

export default AdminLeaves;
