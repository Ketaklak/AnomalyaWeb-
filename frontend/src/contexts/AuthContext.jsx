import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Set up axios interceptor for token
  useEffect(() => {
    if (token) {
      // Add token to future requests
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const response = await api.get('/auth/me');
          setUser(response.data);
        } catch (error) {
          console.error('Auth check failed:', error);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  const login = async (username, password) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      const { access_token, refresh_token } = response.data;
      
      // Store tokens
      localStorage.setItem('token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      setToken(access_token);
      
      // Get user info
      const userResponse = await api.get('/auth/me');
      setUser(userResponse.data);
      
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Erreur de connexion' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Registration failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Erreur d\'inscription' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
  };

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        logout();
        return false;
      }

      const response = await api.post('/auth/refresh-token');
      const { access_token, refresh_token: newRefreshToken } = response.data;
      
      localStorage.setItem('token', access_token);
      localStorage.setItem('refresh_token', newRefreshToken);
      setToken(access_token);
      
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
      return false;
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    refreshToken,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin' || user?.role === 'moderator',
    isClient: user?.role?.startsWith('client') || user?.role === 'prospect',
    isPremiumClient: user?.role === 'client_premium',
    isStandardClient: user?.role === 'client_standard',
    isProspect: user?.role === 'prospect',
    loyaltyTier: user?.loyalty_tier || 'bronze',
    totalPoints: user?.total_points || 0,
    availablePoints: user?.available_points || 0
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};