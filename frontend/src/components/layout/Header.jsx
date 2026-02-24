import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../common/Avatar';

const Header = ({ title }) => {
  const { user } = useAuth();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shadow-sm">
      <div>
        <h1 className="text-xl font-bold text-gray-800">{title}</h1>
        <p className="text-sm text-gray-400 mt-0.5">{greeting}, {user?.name?.split(' ')[0]} 👋</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-xs text-gray-400">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <Avatar name={user?.name} email={user?.email} size="md" />
      </div>
    </header>
  );
};

export default Header;
