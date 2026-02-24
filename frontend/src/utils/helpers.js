// Format date to readable string
export const formatDate = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
};

// Format date for input fields
export const formatDateInput = (date) => {
  if (!date) return '';
  return new Date(date).toISOString().split('T')[0];
};

// Get today's date for min attribute
export const today = () => new Date().toISOString().split('T')[0];

// Calculate business days between two dates
export const calcDays = (start, end) => {
  if (!start || !end) return 0;
  const s = new Date(start);
  const e = new Date(end);
  return Math.ceil(Math.abs(e - s) / (1000 * 60 * 60 * 24)) + 1;
};

// Capitalize first letter
export const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

// Get leave type color classes
export const leaveTypeColor = (type) => {
  const map = {
    sick: 'bg-red-100 text-red-700',
    casual: 'bg-blue-100 text-blue-700',
    earned: 'bg-purple-100 text-purple-700',
    unpaid: 'bg-gray-100 text-gray-700',
  };
  return map[type] || 'bg-gray-100 text-gray-700';
};

// Get status color classes
export const statusColor = (status) => {
  const map = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };
  return map[status] || 'bg-gray-100 text-gray-800';
};

// Get role badge color
export const roleColor = (role) => {
  const map = {
    admin: 'bg-purple-100 text-purple-800',
    manager: 'bg-blue-100 text-blue-800',
    employee: 'bg-gray-100 text-gray-700',
  };
  return map[role] || 'bg-gray-100 text-gray-700';
};

// Get initials from name
export const getInitials = (name) => {
  if (!name) return '??';
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
};

// Avatar background colors based on name
export const avatarColor = (name) => {
  const colors = [
    'bg-primary-500', 'bg-blue-500', 'bg-purple-500',
    'bg-pink-500', 'bg-indigo-500', 'bg-teal-500',
  ];
  if (!name) return colors[0];
  const idx = name.charCodeAt(0) % colors.length;
  return colors[idx];
};

// Truncate text
export const truncate = (str, len = 60) =>
  str && str.length > len ? str.slice(0, len) + '...' : str;
