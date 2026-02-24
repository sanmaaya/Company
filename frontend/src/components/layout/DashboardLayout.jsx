import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import ChatWidget from '../common/ChatWidget';

const DashboardLayout = ({ children, title }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header title={title} />
        <main className="flex-1 p-6 overflow-auto">
          <div className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>
      {/* Live Chat — floats on every protected page */}
      <ChatWidget />
    </div>
  );
};

export default DashboardLayout;
