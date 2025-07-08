
import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, MapPin, Calendar, Users, MessageCircle, LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import MobileNav from './MobileNav';
import Logo from './Logo';

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { icon: Heart, label: 'Inicio', path: '/', color: 'hover:text-pride-purple' },
    { icon: Calendar, label: 'Eventos', path: '/events', color: 'hover:text-pride-blue' },
    { icon: MapPin, label: 'Mapa', path: '/map', color: 'hover:text-pride-green' },
    { icon: Users, label: 'Comunidad', path: '/community', color: 'hover:text-pride-orange' },
    { icon: MessageCircle, label: 'Chat', path: '/chat', color: 'hover:text-pride-pink' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <nav className="container mx-auto px-3 md:px-4 py-3 md:py-4">
        <div className="flex items-center justify-between">
          {/* Logo optimizado para móvil */}
          <div 
            className="flex items-center cursor-pointer touch-target" 
            onClick={() => navigate('/')}
          >
            <Logo size="sm" className="md:hidden" />
            <Logo size="md" className="hidden md:block" />
          </div>

          {/* Desktop Navigation Menu */}
          <div className="hidden lg:flex items-center space-x-6">
            {navItems.map((item) => (
              <button 
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center space-x-2 transition-colors font-medium ${
                  isActive(item.path)
                    ? 'text-pride-purple'
                    : `text-gray-700 ${item.color}`
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/profile')}
                  className="touch-target"
                >
                  <User className="w-4 h-4 mr-2" />
                  <span className="hidden lg:inline">Mi Perfil</span>
                  <span className="lg:hidden">Perfil</span>
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleSignOut}
                  className="touch-target"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  <span className="hidden lg:inline">Cerrar Sesión</span>
                  <span className="lg:hidden">Salir</span>
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/auth')}
                  className="touch-target"
                >
                  <span className="hidden lg:inline">Iniciar Sesión</span>
                  <span className="lg:hidden">Entrar</span>
                </Button>
                <Button 
                  className="bg-pride-gradient text-white hover:opacity-90 transition-opacity touch-target"
                  onClick={() => navigate('/auth')}
                >
                  <span className="hidden lg:inline">Registrarse</span>
                  <span className="lg:hidden">Únete</span>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Auth + Menu */}
          <div className="md:hidden flex items-center space-x-2">
            {!user && (
              <Button 
                size="sm"
                className="bg-pride-gradient text-white text-xs px-3 touch-target"
                onClick={() => navigate('/auth')}
              >
                Únete
              </Button>
            )}
            <MobileNav />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
