import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, requiredRole, requireAdmin = false }) => {
  const { user, loading, isAuthenticated, isAdmin, isClient } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-white">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Vérification de l'authentification...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Handle legacy requireAdmin prop
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Handle new role-based access
  if (requiredRole) {
    if (requiredRole === 'admin' && !isAdmin) {
      return <Navigate to="/unauthorized" replace />;
    }
    
    // Allow admins to access client routes for testing/supervision
    if (requiredRole === 'client' && !isClient && !isAdmin) {
      return <Navigate to="/unauthorized" replace />;
    }
    
    // Check for specific client roles (admins bypass this)
    if (requiredRole === 'client_premium' && user?.role !== 'client_premium' && !isAdmin) {
      return <Navigate to="/unauthorized" replace />;
    }
    
    if (requiredRole === 'client_standard' && user?.role !== 'client_standard' && !isAdmin) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;