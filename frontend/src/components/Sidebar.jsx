import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getInitials, avatarColor, capitalize } from '../utils/helpers';
import toast from 'react-hot-toast';

const navItems = {
  employee: [
    { to: '/employee', label: 'Dashboard', icon: '📊', end: true },
    { to: '/apply-leave', label: 'Apply Leave', icon: '📝' },
    { to: '/leave-history', label: 'Leave History', icon: '📋' },
  ],
  manager: [
    { to: '/employee', label: 'My Dashboard', icon: '📊', end: true },
    { to: '/manager', label: 'Approvals', icon: '✅' },
    { to: '/apply-leave', label: 'Apply Leave', icon: '📝' },
    { to: '/leave-history', label: 'My Leaves', icon: '📋' },
  ],
  admin: [
    { to: '/admin', label: 'Admin Panel', icon: '⚙️', end: true },
    { to: '/manager', label: 'Leave Approvals', icon: '✅' },
    { to: '/employee', label: 'My Dashboard', icon: '📊' },
    { to: '/apply-leave', label: 'Apply Leave', icon: '📝' },
  ],
};

const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const items = navItems[user?.role] || navItems.employee;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">LS</span>
          </div>
          <span className="text-lg font-bold text-primary-700">LeaveSync</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          {capitalize(user?.role)} Menu
        </p>
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setMobileOpen && setMobileOpen(false)}
            className={({ isActive }) =>
              isActive ? 'sidebar-link-active' : 'sidebar-link'
            }
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User profile */}
      <div className="px-3 py-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gray-50 mb-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${avatarColor(user?.name)}`}>
            {getInitials(user?.name)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 truncate">{user?.department}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="sidebar-link w-full text-red-600 hover:bg-red-50 hover:text-red-700"
        >
          <span>🚪</span>
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-56 min-h-screen bg-white border-r border-gray-100 fixed left-0 top-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-64 bg-white h-full shadow-xl slide-in">
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
};

export default Sidebar;
