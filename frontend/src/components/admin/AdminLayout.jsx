import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import NotificationCenter from './NotificationCenter';
import { 
  LayoutDashboard, 
  FileText, 
  MessageSquare, 
  Users, 
  UserPlus,
  Quote,
  LifeBuoy,
  Settings, 
  LogOut,
  Zap,
  Home,
  BarChart3,
  Bell
} from 'lucide-react';

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [notificationCount, setNotificationCount] = useState(0);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Articles', href: '/admin/articles', icon: FileText },
    { name: 'Contacts', href: '/admin/contacts', icon: MessageSquare },
    { name: 'Utilisateurs', href: '/admin/users', icon: Users },
    { name: 'Clients', href: '/admin/clients', icon: UserPlus },
    { name: 'Devis', href: '/admin/quotes', icon: Quote },
    { name: 'Support', href: '/admin/tickets', icon: LifeBuoy },
    { name: 'Notifications', href: '/admin/notifications', icon: Bell },
  ];

  const isActive = (href) => {
    if (href === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 border-r border-slate-700">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center space-x-3 p-6 border-b border-slate-700">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Admin Panel</h1>
              <p className="text-sm text-gray-400">Anomalya Corp</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'text-gray-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Info & Actions */}
          <div className="border-t border-slate-700 p-4">
            <div className="mb-4">
              <div className="text-sm font-medium text-white">{user?.full_name}</div>
              <div className="text-xs text-gray-400">{user?.role}</div>
            </div>
            
            <div className="space-y-2">
              <Button asChild variant="outline" size="sm" className="w-full justify-start border-slate-600 text-gray-300 hover:bg-slate-800">
                <Link to="/">
                  <Home className="mr-2 h-4 w-4" />
                  Voir le site
                </Link>
              </Button>
              
              <Button 
                onClick={handleLogout}
                variant="outline" 
                size="sm" 
                className="w-full justify-start border-slate-600 text-gray-300 hover:bg-slate-800 hover:text-red-400"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-slate-900 border-b border-slate-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">
                {navigation.find(item => isActive(item.href))?.name || 'Dashboard'}
              </h2>
              <p className="text-sm text-gray-400">
                Bienvenue, {user?.full_name}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Centre de notifications */}
              <NotificationCenter 
                onNotificationCountChange={setNotificationCount}
                className="relative"
              />
              
              {/* Actions rapides */}
              <div className="flex items-center gap-2">
                <Button asChild variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-slate-800">
                  <Link to="/">
                    <Home className="h-4 w-4 mr-2" />
                    Site
                  </Link>
                </Button>
                
                <Button 
                  onClick={handleLogout}
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-300 hover:text-red-400 hover:bg-slate-800"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Déconnexion
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;