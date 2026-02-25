import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import Avatar from '../common/Avatar';

const Header = ({ title, onMenuClick }) => {
  const { user } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <header className="bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800/60 px-4 sm:px-8 py-5 flex items-center justify-between shadow-sm sticky top-0 z-40 transition-all duration-300">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Toggle */}
        <button
          onClick={onMenuClick}
          className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-600 hover:text-white transition-all border border-green-100 dark:border-green-900/50 shadow-sm"
        >
          <span className="text-xl">🌿</span>
        </button>
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 dark:text-white tracking-tight">{title}</h1>
          <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">{greeting}, {user?.name?.split(' ')[0]} 👋</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleDarkMode}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all border border-slate-100 dark:border-slate-800/50"
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? <Sun size={18} className="fill-current" /> : <Moon size={18} className="fill-current" />}
        </button>

        <div className="text-right hidden md:block mr-2">
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{new Date().toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
        </div>
        <Avatar name={user?.name} email={user?.email} src={user?.profilePic} size="md" className="border-2 border-white dark:border-slate-700 shadow-sm" />
      </div>
    </header>
  );
};

export default Header;
