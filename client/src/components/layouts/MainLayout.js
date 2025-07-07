import React from 'react';
import { Outlet } from 'react-router-dom';
import ModernNavbar from '../ui/ModernNavbar';
import Footer from '../ui/Footer';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary-50 via-accent-100 to-light">
      <ModernNavbar />
      <main className="flex-grow px-2 md:px-0 pt-4 md:pt-8 pb-8 md:pb-12">
        <div className="max-w-7xl mx-auto w-full bg-glass/80 rounded-3xl shadow-glass p-4 md:p-10 backdrop-blur-xs border border-primary-50">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
