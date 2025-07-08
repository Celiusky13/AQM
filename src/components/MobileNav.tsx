
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Heart, MapPin, Calendar, Users, MessageCircle, LogOut, User, Menu, X, Home } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const MobileNav = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setIsOpen(false);
  };

  const navigateAndClose = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const menuItems = [
    { icon: Home, label: 'Inicio', path: '/' },
    { icon: Calendar, label: 'Eventos', path: '/events' },
    { icon: MapPin, label: 'Mapa', path: '/map' },
    { icon: Users, label: 'Comunidad', path: '/community' },
    { icon: MessageCircle, label: 'Chat', path: '/chat' },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden touch-target">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80 p-0">
        <div className="flex flex-col h-full">
          {/* Header mejorado */}
          <div className="p-6 border-b bg-pride-gradient">
            <div className="flex items-center justify-between">
              <div className="text-white">
                <div className="font-bold text-lg">Amigas Queer</div>
                <div className="text-sm opacity-90">Madriz 🏳️‍🌈</div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 touch-target"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* User info si está logueado */}
          {user && (
            <div className="p-4 border-b bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-pride-purple rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">
                    {user.email?.split('@')[0]}
                  </div>
                  <div className="text-sm text-gray-500">Miembro activo</div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation mejorada */}
          <div className="flex-1 py-4">
            <nav className="space-y-1 px-2">
              {menuItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigateAndClose(item.path)}
                  className={`w-full flex items-center space-x-4 px-4 py-4 text-left rounded-xl transition-all touch-target ${
                    isActive(item.path)
                      ? 'bg-pride-gradient text-white shadow-md transform scale-105'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-pride-purple'
                  }`}
                >
                  <item.icon className={`w-6 h-6 ${
                    isActive(item.path) ? 'text-white' : 'text-gray-600'
                  }`} />
                  <span className="font-medium text-base">{item.label}</span>
                  {isActive(item.path) && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full" />
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Footer mejorado */}
          <div className="border-t p-4 space-y-3 bg-gray-50">
            {user ? (
              <>
                <Button
                  variant="outline"
                  className="w-full justify-start h-12 touch-target border-gray-300"
                  onClick={() => navigateAndClose('/profile')}
                >
                  <User className="w-5 h-5 mr-3" />
                  <span className="text-base">Mi Perfil</span>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start h-12 touch-target border-red-200 text-red-600 hover:bg-red-50"
                  onClick={handleSignOut}
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  <span className="text-base">Cerrar Sesión</span>
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="w-full h-12 touch-target"
                  onClick={() => navigateAndClose('/auth')}
                >
                  <span className="text-base">Iniciar Sesión</span>
                </Button>
                <Button
                  className="w-full bg-pride-gradient text-white h-12 touch-target shadow-md"
                  onClick={() => navigateAndClose('/auth')}
                >
                  <span className="text-base font-semibold">Únete Gratis ✨</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
