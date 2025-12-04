import React from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from './Header';
import { BottomNavigation } from './BottomNavigation';
import { StatusBar } from './StatusBar';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  // Hide bottom navigation on inspection page for better UX
  const hideBottomNav = location.pathname.startsWith('/inspection/');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <StatusBar />
      <Header />
      
      <main className={`flex-1 ${hideBottomNav ? 'pb-4' : 'pb-20'}`}>
        {children}
      </main>
      
      {!hideBottomNav && <BottomNavigation />}
    </div>
  );
};
