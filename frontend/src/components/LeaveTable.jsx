import React from 'react';
import { formatDate, capitalize, leaveTypeColor, statusColor, truncate } from '../utils/helpers';

const LeaveTable = ({ leaves, showEmployee = false, onApprove, onReject, loading }) => {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-8 h-8 border-3 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto" style={{ borderWidth: '3px' }} />
        <p className="text-sm text-gray-400 mt-3">Loading leave requests...</p>
      </div>
    );
  }

  if (!leaves || leaves.length === 0) {
    return (
      <div className="text-center py-14">
        <div className="text-5xl mb-3">📭</div>
        <p className="text-gray-500 font-medium">No leave requests found</p>
        <p className="text-gray-400 text-sm mt-1">Records will appear here once submitted</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100">
            {showEmployee && <th className="table-header rounded-tl-lg">Employee</th>}
            <th className="table-header">Leave Type</th>
            <th className="table-header">From</th>
            <th className="table-header">To</th>
            <th className="table-header">Days</th>
            <th className="table-header">Reason</th>
            <th className="table-header">Status</th>
            {(onApprove || onReject) && <th className="table-header rounded-tr-lg">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {leaves.map((leave) => (
            <tr key={leave._id} className="hover:bg-gray-50/60 transition-colors group">
              {showEmployee && (
                <td className="table-cell">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {leave.employee?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-xs">{leave.employee?.name}</p>
                      <p className="text-gray-400 text-xs">{leave.employee?.department}</p>
                    </div>
                  </div>
                </td>
              )}
              <td className="table-cell">
                <span className={`badge ${leaveTypeColor(leave.leaveType)}`}>
                  {capitalize(leave.leaveType)}
                </span>
              </td>
              <td className="table-cell text-gray-600">{formatDate(leave.startDate)}</td>
              <td className="table-cell text-gray-600">{formatDate(leave.endDate)}</td>
              <td className="table-cell">
                <span className="font-semibold text-gray-800">{leave.totalDays}</span>
                <span className="text-gray-400 text-xs"> d</span>
              </td>
              <td className="table-cell max-w-[200px]">
                <span className="text-gray-600 text-xs" title={leave.reason}>
                  {truncate(leave.reason, 45)}
                </span>
              </td>
              <td className="table-cell">
                <span className={`badge ${statusColor(leave.status)}`}>
                  {capitalize(leave.status)}
                </span>
              </td>
              {(onApprove || onReject) && leave.status === 'pending' && (
                <td className="table-cell">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onApprove && onApprove(leave)}
                      className="px-3 py-1.5 bg-primary-50 text-primary-700 border border-primary-200 hover:bg-primary-600 hover:text-white rounded-lg text-xs font-semibold transition-all duration-200"
                    >
                      ✓ Approve
                    </button>
                    <button
                      onClick={() => onReject && onReject(leave)}
                      className="px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 hover:bg-red-600 hover:text-white rounded-lg text-xs font-semibold transition-all duration-200"
                    >
                      ✕ Reject
                    </button>
                  </div>
                </td>
              )}
              {(onApprove || onReject) && leave.status !== 'pending' && (
                <td className="table-cell">
                  <span className="text-xs text-gray-400 italic">
                    {leave.reviewComment ? truncate(leave.reviewComment, 30) : 'Reviewed'}
                  </span>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveTable;
