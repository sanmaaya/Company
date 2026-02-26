import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { RoleBadge } from '../common/StatusBadge';
import Avatar from '../common/Avatar';

const navItems = {
  employee: [
    { path: '/employee', label: 'Dashboard', icon: '📊' },
    { path: '/projects', label: 'Projects', icon: '📁' },
    { path: '/apply-leave', label: 'Apply Leave', icon: '📝' },
    { path: '/my-leaves', label: 'My Leaves', icon: '📋' },
    { path: '/contacts', label: 'Team Directory', icon: '👥' },
    { path: '/profile', label: 'Profile', icon: '👤' }
  ],
  manager: [
    { path: '/employee', label: 'Dashboard', icon: '📊' },
    { path: '/projects', label: 'Projects', icon: '📁' },
    { path: '/apply-leave', label: 'Apply Leave', icon: '📝' },
    { path: '/my-leaves', label: 'My Leaves', icon: '📋' },
    { path: '/approvals', label: 'Approvals', icon: '✅' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
    { path: '/contacts', label: 'Team Directory', icon: '👥' },
    { path: '/profile', label: 'Profile', icon: '👤' }
  ],
  admin: [
    { path: '/employee', label: 'Dashboard', icon: '📊' },
    { path: '/projects', label: 'Projects', icon: '📁' },
    { path: '/admin/users', label: 'Manage Users', icon: '👥' },
    { path: '/admin/leaves', label: 'All Leaves', icon: '📋' },
    { path: '/approvals', label: 'Approvals', icon: '✅' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
    { path: '/contacts', label: 'Team Directory', icon: '👥' },
    { path: '/profile', label: 'Profile', icon: '👤' }
  ]
};

const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const items = navItems[user?.role] || navItems.employee;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* ── Mobile Overlay ────────────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[60] lg:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside className={`
        fixed inset-y-0 left-0 z-[70] bg-white dark:bg-[#0f172a] border-r border-slate-100 dark:border-slate-800/60 flex flex-col transition-all duration-300 shadow-xl lg:shadow-none lg:sticky lg:top-0 h-screen
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${collapsed ? 'lg:w-20' : 'lg:w-64 w-64'}
      `}>

        {/* ── Logo & Toggle ────────────────────────── */}
        <div className={`p-5 border-b border-slate-100 dark:border-slate-800/60 flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center gap-3 hover:opacity-80 transition-all group"
          >
            <div className="w-10 h-10 flex items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm border border-blue-100 dark:border-blue-500/20 text-xs font-black">
              WB
            </div>
            {!collapsed && (
              <span className="font-extrabold text-slate-800 dark:text-white text-lg tracking-tight">WORK Balance</span>
            )}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* ── Navigation ───────────────────────── */}
        <nav className="flex-1 px-3 py-2 overflow-y-auto scrollbar-hide">
          {!collapsed && (
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-3 mb-2 mt-1">
              {user?.role === 'admin' ? 'Admin Panel' : user?.role === 'manager' ? 'HR Menu' : 'Employee Menu'}
            </p>
          )}
          {items.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/employee'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-xl mb-1 text-sm font-semibold transition-all ${isActive
                  ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-500/10 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                }`
              }
              title={collapsed ? item.label : ''}
            >
              <span className="text-base flex-shrink-0">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* ── User Profile & Logout ─────────────────────── */}
        <div className="border-t border-slate-100 dark:border-slate-800/60 bg-white dark:bg-[#0f172a]">
          {!collapsed ? (
            <div className="p-4">
              <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-3 border border-slate-100 dark:border-slate-700/50">
                <Avatar name={user?.name} email={user?.email} src={user?.profilePic} size="md" className="border-2 border-white dark:border-slate-700 shadow-sm" />
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-slate-800 dark:text-slate-200 text-xs truncate leading-tight">{user?.name}</p>
                  <div className="mt-1"><RoleBadge role={user?.role} /></div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-3 mt-3 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all"
              >
                <LogOut size={14} className="flex-shrink-0" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="p-3 space-y-4 flex flex-col items-center">
              <Avatar name={user?.name} email={user?.email} src={user?.profilePic} size="md" className="border-2 border-white dark:border-slate-700 shadow-sm" />
              <button
                onClick={handleLogout}
                className="p-3 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all shadow-sm"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
