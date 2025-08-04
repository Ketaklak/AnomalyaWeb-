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
  Bell,
  Menu,
  X
} from 'lucide-react';

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [notificationCount, setNotificationCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-slate-900 border-r border-slate-700 transition-transform duration-200 ease-in-out
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-slate-700">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Admin Panel</h1>
                <p className="text-sm text-gray-400">Anomalya Corp</p>
              </div>
            </div>
            
            {/* Mobile Close Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)} // Close sidebar on mobile after navigation
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'text-gray-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Info & Actions */}
          <div className="border-t border-slate-700 p-4">
            <div className="mb-4">
              <div className="text-sm font-medium text-white truncate">{user?.full_name}</div>
              <div className="text-xs text-gray-400 capitalize">{user?.role}</div>
            </div>
            
            <div className="space-y-2">
              <Button asChild variant="outline" size="sm" className="w-full justify-start border-slate-600 text-gray-300 hover:bg-slate-800">
                <Link to="/" onClick={() => setSidebarOpen(false)}>
                  <Home className="mr-2 h-4 w-4 flex-shrink-0" />
                  <span className="truncate">Voir le site</span>
                </Link>
              </Button>
              
              <Button 
                onClick={handleLogout}
                variant="outline" 
                size="sm" 
                className="w-full justify-start border-slate-600 text-gray-300 hover:bg-slate-800 hover:text-red-400"
              >
                <LogOut className="mr-2 h-4 w-4 flex-shrink-0" />
                <span className="truncate">Déconnexion</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Header */}
        <header className="bg-slate-900 border-b border-slate-700 px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-300 hover:text-white hover:bg-slate-800"
              >
                <Menu className="h-5 w-5" />
              </Button>
              
              <div className="min-w-0">
                <h2 className="text-lg lg:text-xl font-semibold text-white truncate">
                  {navigation.find(item => isActive(item.href))?.name || 'Dashboard'}
                </h2>
                <p className="text-sm text-gray-400 hidden sm:block">
                  Bienvenue, {user?.full_name}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 lg:gap-4">
              {/* Centre de notifications */}
              <NotificationCenter 
                onNotificationCountChange={setNotificationCount}
                className="relative"
              />
              
              {/* Actions rapides - Hidden on small screens */}
              <div className="hidden sm:flex items-center gap-2">
                <Button asChild variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-slate-800">
                  <Link to="/">
                    <Home className="h-4 w-4 mr-2" />
                    <span className="hidden md:inline">Site</span>
                  </Link>
                </Button>
                
                <Button 
                  onClick={handleLogout}
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-300 hover:text-red-400 hover:bg-slate-800"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span className="hidden md:inline">Déconnexion</span>
                </Button>
              </div>
              
              {/* Mobile User Menu */}
              <div className="sm:hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-gray-300 hover:text-red-400 hover:bg-slate-800"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;