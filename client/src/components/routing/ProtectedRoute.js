import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  // If user is not logged in, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If roles are specified, check if user has an allowed role
  if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
    // Redirect based on user role
    switch (currentUser.role) {
      case 'client':
        return <Navigate to="/client" replace />;
      case 'artist':
        return <Navigate to="/artist" replace />;
      case 'studio':
        return <Navigate to="/studio" replace />;
      case 'admin':
        return <Navigate to="/admin" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  // User is authenticated and authorized
  return children;
};

export default ProtectedRoute;
