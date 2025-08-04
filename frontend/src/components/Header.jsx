import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Menu, X, Zap, Settings, User, LogOut, FileText, MessageSquare } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from './ui/dropdown-menu';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { 
    user, 
    logout, 
    isAuthenticated, 
    isAdmin, 
    isClient, 
    loyaltyTier, 
    totalPoints 
  } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: 'Accueil', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Actualités', href: '/actualites' },
    { name: 'Compétences', href: '/competences' },
    { name: 'Contact', href: '/contact' }
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-slate-900/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg group-hover:scale-105 transition-transform">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Anomalya Corp</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`relative px-3 py-2 text-sm font-medium transition-colors hover:text-blue-400 ${
                  location.pathname === item.href ? 'text-blue-400' : 'text-gray-300'
                }`}
              >
                {item.name}
                {location.pathname === item.href && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* User Menu & CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-slate-600 text-gray-300 hover:bg-slate-800">
                    <User className="h-4 w-4 mr-2" />
                    {user?.full_name || user?.username}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-slate-800 border-slate-600">
                  {isAdmin && (
                    <>
                      <DropdownMenuItem asChild className="text-white hover:bg-slate-700">
                        <Link to="/admin">
                          <Settings className="h-4 w-4 mr-2" />
                          Administration
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-slate-600" />
                    </>
                  )}
                  
                  {isAuthenticated && (
                    <>
                      <DropdownMenuItem asChild className="text-white hover:bg-slate-700">
                        <Link to="/client/tickets">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Support & Tickets
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-slate-600" />
                    </>
                  )}
                  
                  {isClient && (
                    <>
                      <DropdownMenuItem asChild className="text-white hover:bg-slate-700">
                        <Link to="/client/dashboard">
                          <User className="h-4 w-4 mr-2" />
                          Mon espace client
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="text-white hover:bg-slate-700">
                        <Link to="/client/profile">
                          <Settings className="h-4 w-4 mr-2" />
                          Mon profil
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="text-white hover:bg-slate-700">
                        <Link to="/client/quotes/new">
                          <FileText className="h-4 w-4 mr-2" />
                          Demander un devis
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="text-white hover:bg-slate-700">
                        <Link to="/client/tickets">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Support & Tickets
                        </Link>
                      </DropdownMenuItem>
                      
                      {/* Loyalty Status */}
                      <DropdownMenuSeparator className="bg-slate-600" />
                      <div className="px-2 py-2">
                        <div className="text-xs text-gray-400 mb-1">Statut fidélité</div>
                        <div className="flex items-center space-x-2">
                          <div className={`px-2 py-1 rounded text-xs font-medium ${
                            loyaltyTier === 'bronze' ? 'bg-amber-600/20 text-amber-300' :
                            loyaltyTier === 'silver' ? 'bg-gray-400/20 text-gray-300' :
                            loyaltyTier === 'gold' ? 'bg-yellow-400/20 text-yellow-300' :
                            'bg-purple-400/20 text-purple-300'
                          }`}>
                            {loyaltyTier ? loyaltyTier.charAt(0).toUpperCase() + loyaltyTier.slice(1) : 'Bronze'}
                          </div>
                          <div className="text-xs text-gray-400">
                            {totalPoints || 0} pts
                          </div>
                        </div>
                      </div>
                      
                      <DropdownMenuSeparator className="bg-slate-600" />
                    </>
                  )}
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="text-white hover:bg-slate-700"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button asChild variant="outline" className="border-slate-600 text-gray-300 hover:bg-slate-800">
                  <Link to="/login">Connexion</Link>
                </Button>
                <Button asChild className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold">
                  <Link to="/contact">Devis Gratuit</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute left-0 right-0 top-16 bg-slate-900/95 backdrop-blur-md border-t border-slate-700">
            <nav className="px-4 py-4 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2 text-base font-medium rounded-lg transition-colors ${
                    location.pathname === item.href 
                      ? 'text-blue-400 bg-slate-800' 
                      : 'text-gray-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              
              <div className="pt-4 border-t border-slate-700 space-y-2">
                {isAuthenticated ? (
                  <>
                    <div className="px-3 py-2 text-sm text-gray-400">
                      Connecté en tant que {user?.full_name || user?.username}
                      {isClient && (
                        <div className="mt-1 flex items-center space-x-2">
                          <div className={`px-2 py-1 rounded text-xs font-medium ${
                            loyaltyTier === 'bronze' ? 'bg-amber-600/20 text-amber-300' :
                            loyaltyTier === 'silver' ? 'bg-gray-400/20 text-gray-300' :
                            loyaltyTier === 'gold' ? 'bg-yellow-400/20 text-yellow-300' :
                            'bg-purple-400/20 text-purple-300'
                          }`}>
                            {loyaltyTier ? loyaltyTier.charAt(0).toUpperCase() + loyaltyTier.slice(1) : 'Bronze'}
                          </div>
                          <span className="text-xs">
                            {totalPoints || 0} points
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Support link for all authenticated users */}
                    <Link
                      to="/client/tickets"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Support & Tickets
                    </Link>
                    
                    {isClient && (
                      <>
                        <Link
                          to="/client/dashboard"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                        >
                          <User className="h-4 w-4 mr-2" />
                          Mon espace client
                        </Link>
                        <Link
                          to="/client/profile"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Mon profil
                        </Link>
                        <Link
                          to="/client/quotes/new"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Demander un devis
                        </Link>
                      </>
                    )}
                    
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Administration
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center w-full px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Déconnexion
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      Connexion
                    </Link>
                    <Button asChild className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold">
                      <Link to="/contact" onClick={() => setIsMenuOpen(false)}>Devis Gratuit</Link>
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;