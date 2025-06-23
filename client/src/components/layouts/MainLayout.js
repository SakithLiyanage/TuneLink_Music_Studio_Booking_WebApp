import React from 'react';
import { Outlet } from 'react-router-dom';
import ModernNavbar from '../ui/ModernNavbar';
import Footer from '../ui/Footer';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <ModernNavbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
