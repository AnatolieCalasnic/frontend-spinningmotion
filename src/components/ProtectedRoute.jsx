import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminRequired = false }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Save the location they were trying to access
    return <Navigate to="/login" state={{ from: location.pathname }} />;
  }

  if (adminRequired && !user?.isAdmin) {
    return <Navigate to="/" />;
  }

  // If user is admin and trying to access public routes, redirect to admin dashboard
  if (user?.isAdmin && !location.pathname.startsWith('/admin')) {
    return <Navigate to="/admin/dashboard" />;
  }

  return children;
};

export default ProtectedRoute;