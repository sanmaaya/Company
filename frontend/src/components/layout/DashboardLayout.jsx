import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import ChatWidget from '../common/ChatWidget';

const DashboardLayout = ({ children, title }) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#0b0f1a] transition-colors duration-300">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header title={title} onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <div className="animate-fade-in">
            {children}
          </div>
        </main>
        <Footer />
      </div>
      {/* Live Chat — floats on every protected page */}
      <ChatWidget />
    </div>
  );
};

export default DashboardLayout;
