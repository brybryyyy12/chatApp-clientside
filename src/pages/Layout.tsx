import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const Layout: React.FC = () => {
  const location = useLocation();
  // Check if we are on the base homepage or inside a message
  const isChatting = location.pathname.includes('/message');

  return (
    <div className="flex h-screen w-full bg-[#0F172A] overflow-hidden">
      
      {/* SIDEBAR: Hidden on mobile when a chat is open */}
      <div className={`${isChatting ? 'hidden md:block' : 'block'} w-full md:w-80 flex-shrink-0 h-full border-r border-white/5`}>
        <Sidebar />
      </div>

      {/* CONTENT AREA: Hidden on mobile when looking at the sidebar (homepage) */}
      <main className={`${isChatting ? 'flex' : 'hidden md:flex'} flex-1 h-full overflow-hidden`}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;