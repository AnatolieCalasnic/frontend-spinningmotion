import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const navigate = useNavigate();
  const location = useLocation();

  // Check auth status and handle redirects
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('http://localhost:8080/tokens/validate', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (!response.ok) {
          setUser(null);
          localStorage.removeItem('user');
          return;
        }
        
        const userData = await response.json();
        setUser(prev => ({
          ...prev,
          ...userData
        }));

        // Redirect admin users to dashboard if they're on public pages
        if (userData.isAdmin && 
            !location.pathname.startsWith('/admin') && 
            location.pathname !== '/login') {
          navigate('/admin/dashboard');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setUser(null);
        localStorage.removeItem('user');
      }
    };

    if (user) {
      checkAuthStatus();
    }
  }, [navigate, location.pathname]);

  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:8080/tokens', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Login failed');
      }

      const userData = await response.json();
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      await transferGuestBasket(userData.id);

      // Handles redirects based on user role
      if (userData.isAdmin) {
        navigate('/admin/dashboard');
      } else {
        // Redirects to the page they were trying to access, or home
        const intendedPath = location.state?.from || '/';
        navigate(intendedPath);
      }

      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fetch('http://localhost:8080/tokens/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('user');
      navigate('/');
    }
  };
  const transferGuestBasket = async (userId) => {
    try {
      const guestBasket = localStorage.getItem('guestBasket');
      if (!guestBasket) return;
  
      const parsedBasket = JSON.parse(guestBasket);
      
      // Transfer each item to the user's basket
      for (const item of parsedBasket.items) {
        const addToBasketRequest = {
          userId: userId,
          recordId: item.recordId,
          quantity: item.quantity
        };
        
        await fetch('http://localhost:8080/basket/add', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(addToBasketRequest)
        });
      }
      
      // Clear guest basket after successful transfer
      localStorage.removeItem('guestBasket');
      
    } catch (error) {
      console.error('Error transferring guest basket:', error);
      // Consider showing a user-friendly error message
      // You might want to keep the guest basket in localStorage if transfer fails
    }
  };
  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      login,
      logout,
      isAuthenticated: !!user,
      // isAdmin: user?.isAdmin || false
    }}>
      {children}
    </AuthContext.Provider>
  );
};