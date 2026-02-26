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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md animate-fade-in border border-white/5 dark:border-slate-800">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-xl font-extrabold text-slate-800 dark:text-white tracking-tight">Review Leave</h3>
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Requested by {leave.employee?.name}</p>
        </div>
        <div className="p-8 space-y-4">
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 text-sm space-y-3 border border-slate-100 dark:border-slate-700/50">
            <div className="flex justify-between items-center"><span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Type</span><LeaveTypeBadge type={leave.leaveType} /></div>
            <div className="flex justify-between items-center"><span className="text-xs font-bold text-slate-400 uppercase tracking-wider">From</span><span className="font-bold dark:text-white">{new Date(leave.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span></div>
            <div className="flex justify-between items-center"><span className="text-xs font-bold text-slate-400 uppercase tracking-wider">To</span><span className="font-bold dark:text-white">{new Date(leave.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span></div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-200/50 dark:border-slate-700/50"><span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Duration</span><span className="text-lg font-black text-blue-600 dark:text-blue-400">{leave.totalDays} Days</span></div>
            <div className="pt-2 border-t border-slate-200/50 dark:border-slate-700/50"><span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Reason</span><p className="font-medium text-slate-700 dark:text-slate-300 leading-relaxed italic">"{leave.reason}"</p></div>
          </div>
          <div>
            <label className="form-label">Review Comment</label>
            <textarea
              rows={3}
              value={comment}
              onChange={e => setComment(e.target.value)}
              className="input resize-none"
              placeholder="Add a note for the employee (e.g. Approved, please hand over tasks)"
            />
          </div>
        </div>
        <div className="p-8 border-t border-slate-100 dark:border-slate-800 flex gap-4">
          <button onClick={onClose} className="btn-secondary flex-1">Back</button>
          <button
            onClick={() => handle('rejected')}
            disabled={loading}
            className="btn-danger flex-1 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 shadow-none hover:bg-rose-100"
          >
            Reject
          </button>
          <button
            onClick={() => handle('approved')}
            disabled={loading}
            className="btn-primary flex-1"
          >
            {loading ? '...' : 'Approve'}
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
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/50 rounded-3xl p-6 mb-8 flex items-center gap-5 shadow-sm">
          <div className="w-14 h-14 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-amber-100 dark:border-slate-800">⏳</div>
          <div>
            <p className="text-lg font-extrabold text-amber-800 dark:text-amber-400 tracking-tight">{pending} Approval{pending > 1 ? 's' : ''} Pending</p>
            <p className="text-amber-700/70 dark:text-amber-500/80 text-sm font-medium">Please review these requests to ensure smooth team operations.</p>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-wrap gap-4 items-center justify-between bg-slate-50/30 dark:bg-slate-800/20">
          <div className="flex gap-2">
            {['all', 'pending', 'approved', 'rejected'].map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${filter === s ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
              >
                {s} {s === 'pending' && pending > 0 && <span className="ml-1 bg-rose-500 text-white rounded-full px-1.5 py-0.5 text-[10px]">{pending}</span>}
              </button>
            ))}
          </div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{filtered.length} requests total</span>
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
                <tr>
                  {['Employee', 'Department', 'Type', 'Dates', 'Days', 'Reason', 'Status', 'Review'].map(h => (
                    <th key={h} className="table-header">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {filtered.map(leave => (
                  <tr key={leave._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition">
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <Avatar name={leave.employee?.name} email={leave.employee?.email} src={leave.employee?.profilePic} size="sm" className="shadow-sm border-2 border-white dark:border-slate-800" />
                        <span className="font-bold text-slate-800 dark:text-slate-200">{leave.employee?.name}</span>
                      </div>
                    </td>
                    <td className="table-cell text-slate-500 font-medium">{leave.employee?.department}</td>
                    <td className="table-cell"><LeaveTypeBadge type={leave.leaveType} /></td>
                    <td className="table-cell font-bold text-slate-600 dark:text-slate-400 text-xs">
                      {new Date(leave.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} - {new Date(leave.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </td>
                    <td className="table-cell font-black text-slate-800 dark:text-slate-100">{leave.totalDays}</td>
                    <td className="table-cell text-slate-500 italic max-w-[180px] truncate" title={leave.reason}>{leave.reason}</td>
                    <td className="table-cell"><StatusBadge status={leave.status} /></td>
                    <td className="table-cell">
                      {leave.status === 'pending' ? (
                        <button
                          onClick={() => setSelected(leave)}
                          className="btn-primary px-3 py-1.5 !rounded-lg text-[10px]"
                        >
                          Review Now
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                          <span className="text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase">{leave.reviewedBy?.name?.split(' ')[0] || 'System'}</span>
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

export default Approvals;
