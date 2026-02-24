import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { RoleBadge } from '../common/StatusBadge';
import Avatar from '../common/Avatar';

const navItems = {
  employee: [
    { path: '/employee', label: 'Dashboard', icon: '📊' },
    { path: '/apply-leave', label: 'Apply Leave', icon: '📝' },
    { path: '/my-leaves', label: 'My Leaves', icon: '📋' },
    { path: '/profile', label: 'Profile', icon: '👤' }
  ],
  manager: [
    { path: '/employee', label: 'Dashboard', icon: '📊' },
    { path: '/apply-leave', label: 'Apply Leave', icon: '📝' },
    { path: '/my-leaves', label: 'My Leaves', icon: '📋' },
    { path: '/approvals', label: 'Approvals', icon: '✅' },
    { path: '/team', label: 'My Team', icon: '👥' },
    { path: '/profile', label: 'Profile', icon: '👤' }
  ],
  admin: [
    { path: '/employee', label: 'Dashboard', icon: '📊' },
    { path: '/admin/users', label: 'Manage Users', icon: '👥' },
    { path: '/admin/leaves', label: 'All Leaves', icon: '📋' },
    { path: '/approvals', label: 'Approvals', icon: '✅' },
    { path: '/profile', label: 'Profile', icon: '👤' }
  ]
};

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const items = navItems[user?.role] || navItems.employee;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className={`${collapsed ? 'w-16' : 'w-64'} min-h-screen bg-white border-r border-gray-100 flex flex-col transition-all duration-300 shadow-sm flex-shrink-0`}>

      {/* ── Logo ─────────────────────────────── */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌿</span>
            <span className="font-bold text-green-700 text-lg tracking-tight">LeaveSync</span>
          </div>
        )}
        {collapsed && <span className="text-2xl mx-auto">🌿</span>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition"
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>

      {/* ── Navigation ───────────────────────── */}
      <nav className="flex-1 p-3 overflow-y-auto">
        {!collapsed && (
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-2 mt-1">
            {user?.role === 'admin' ? 'Admin Panel' : user?.role === 'manager' ? 'HR Menu' : 'Employee Menu'}
          </p>
        )}
        {items.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/employee'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-sm font-medium transition-all ${isActive
                ? 'bg-green-50 text-green-700 border border-green-100 shadow-sm'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
            title={collapsed ? item.label : ''}
          >
            <span className="text-base flex-shrink-0">{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* ── User Profile ─────────────────────── */}
      <div className="border-t border-gray-100">
        {!collapsed ? (
          <div className="p-4">
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
              <Avatar name={user?.name} email={user?.email} size="md" />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-gray-800 text-sm truncate leading-tight">{user?.name}</p>
                <p className="text-gray-400 text-xs truncate">{user?.email}</p>
                <div className="mt-1"><RoleBadge role={user?.role} /></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3 flex justify-center">
            <Avatar name={user?.name} email={user?.email} size="md" />
          </div>
        )}

        {/* ── Logout ───────────────────────── */}
        <div className="px-3 pb-3">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
            title={collapsed ? 'Logout' : ''}
          >
            <span className="text-base flex-shrink-0">🚪</span>
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
