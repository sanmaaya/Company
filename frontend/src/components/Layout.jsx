import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';
import { getInitials, avatarColor, capitalize } from '../utils/helpers';

const Layout = ({ children, title }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main content */}
      <div className="flex-1 lg:ml-56 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-100 px-4 lg:px-6 py-3.5 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-5 h-0.5 bg-gray-600 mb-1"></div>
              <div className="w-5 h-0.5 bg-gray-600 mb-1"></div>
              <div className="w-5 h-0.5 bg-gray-600"></div>
            </button>
            <h1 className="text-lg font-semibold text-gray-800">{title}</h1>
          </div>
          {/* Header right */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
              <p className="text-xs text-gray-500">
                <span className={`inline-block px-1.5 py-0.5 rounded-full text-xs font-semibold
                  ${user?.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                    user?.role === 'manager' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-600'}`}>
                  {capitalize(user?.role)}
                </span>
              </p>
            </div>
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold ${avatarColor(user?.name)}`}>
              {getInitials(user?.name)}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 fade-in">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
