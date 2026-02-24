import React from 'react';

const StatusBadge = ({ status }) => {
  const styles = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    approved: 'bg-green-100 text-green-800 border-green-200',
    rejected: 'bg-red-100 text-red-800 border-red-200'
  };
  const icons = { pending: '⏳', approved: '✅', rejected: '❌' };

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
      <span>{icons[status]}</span>
      {status?.charAt(0).toUpperCase() + status?.slice(1)}
    </span>
  );
};

export const RoleBadge = ({ role }) => {
  const styles = {
    admin: 'bg-purple-100 text-purple-800',
    manager: 'bg-blue-100 text-blue-800',
    employee: 'bg-gray-100 text-gray-700'
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[role]}`}>
      {role?.charAt(0).toUpperCase() + role?.slice(1)}
    </span>
  );
};

export const LeaveTypeBadge = ({ type }) => {
  const styles = {
    casual: 'bg-sky-100 text-sky-800',
    sick: 'bg-orange-100 text-orange-800',
    earned: 'bg-teal-100 text-teal-800',
    unpaid: 'bg-gray-100 text-gray-700'
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${styles[type]}`}>
      {type}
    </span>
  );
};

export default StatusBadge;
