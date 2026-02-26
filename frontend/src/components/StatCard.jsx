import React from 'react';

const StatCard = ({ icon, label, value, sub, color = 'blue', onClick }) => {
  const colorMap = {
    sky: { bg: 'bg-primary-50', icon: 'bg-primary-100 text-primary-700', val: 'text-primary-700' },
    yellow: { bg: 'bg-yellow-50', icon: 'bg-yellow-100 text-yellow-700', val: 'text-yellow-700' },
    red: { bg: 'bg-red-50', icon: 'bg-red-100 text-red-700', val: 'text-red-700' },
    blue: { bg: 'bg-blue-50', icon: 'bg-blue-100 text-blue-700', val: 'text-blue-700' },
    purple: { bg: 'bg-purple-50', icon: 'bg-purple-100 text-purple-700', val: 'text-purple-700' },
    gray: { bg: 'bg-gray-50', icon: 'bg-gray-100 text-gray-600', val: 'text-gray-700' },
  };
  const c = colorMap[color] || colorMap.sky;

  return (
    <div
      className={`card p-5 flex items-center gap-4 transition-all duration-200 ${onClick ? 'cursor-pointer hover:shadow-card hover:-translate-y-0.5' : ''}`}
      onClick={onClick}
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${c.icon} flex-shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">{label}</p>
        <p className={`text-2xl font-bold ${c.val}`}>{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
};

export default StatCard;
