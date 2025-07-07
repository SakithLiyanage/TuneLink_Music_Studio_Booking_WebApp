import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-accent-100 to-light pt-28">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-primary-700 mb-2">Admin Dashboard</h1>
          <p className="text-dark/60 text-lg">Manage your TuneLink platform</p>
        </div>
        
        <div className="bg-glass/80 rounded-3xl p-6 border border-primary-100">
          <h2 className="text-2xl font-bold text-primary-700 mb-4">Welcome to Admin Dashboard</h2>
          <p className="text-dark/60">This is a minimal version for testing.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
