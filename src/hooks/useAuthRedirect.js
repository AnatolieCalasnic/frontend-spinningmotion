import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const useAuthRedirect = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated && user?.isAdmin) {
      // If admin is accessing public routes, redirect to admin dashboard
      if (!location.pathname.startsWith('/admin')) {
        navigate('/admin/dashboard');
      }
    }
  }, [isAuthenticated, user, navigate, location]);

  return { isAuthenticated, isAdmin: user?.isAdmin };
};