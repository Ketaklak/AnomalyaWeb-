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
    
    if (requiredRole === 'client' && !isClient) {
      return <Navigate to="/unauthorized" replace />;
    }
    
    // Check for specific client roles
    if (requiredRole === 'client_premium' && user?.role !== 'client_premium') {
      return <Navigate to="/unauthorized" replace />;
    }
    
    if (requiredRole === 'client_standard' && user?.role !== 'client_standard') {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;