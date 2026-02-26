import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import ChatWidget from '../common/ChatWidget';

const DashboardLayout = ({ children, title }) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#020617] transition-colors duration-300 relative">
      {/* Ambient background decorative elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-slate-50/50">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-200/20 rounded-full blur-[120px] animate-pulse transition-transform duration-[10000ms]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[700px] h-[700px] bg-indigo-100/30 rounded-full blur-[140px] animate-pulse [animation-delay:2s]"></div>
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-sky-100/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 animate-pulse [animation-delay:4s]"></div>

        {/* Subtle grid pattern for texture */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#4f46e5 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>
      </div>

      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <Header title={title} onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <div className="animate-fade-in relative z-10">
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
