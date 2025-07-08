
import React from 'react';
import { Heart, Instagram, Twitter, Mail } from 'lucide-react';
import Logo from './Logo';

// Footer con tema blanco - fondo blanco y texto negro
const Footer = () => {
  return (
    <footer className="bg-white text-black py-12 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <div className="mb-4">
              <Logo size="lg" />
            </div>
            <p className="text-gray-600 leading-relaxed mb-6">
              La plataforma digital donde la comunidad LGBTQ+ de Madrid se conecta, 
              crea planes increíbles y celebra la diversidad con amor y respeto.
            </p>
            <div className="flex space-x-4">
              <Instagram className="w-6 h-6 text-gray-600 hover:text-pride-pink cursor-pointer transition-colors" />
              <Twitter className="w-6 h-6 text-gray-600 hover:text-pride-blue cursor-pointer transition-colors" />
              <Mail className="w-6 h-6 text-gray-600 hover:text-pride-green cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Navegación</h4>
            <ul className="space-y-2 text-gray-600">
              <li><a href="#inicio" className="hover:text-black transition-colors">Inicio</a></li>
              <li><a href="#eventos" className="hover:text-black transition-colors">Eventos</a></li>
              <li><a href="#mapa" className="hover:text-black transition-colors">Mapa</a></li>
              <li><a href="#comunidad" className="hover:text-black transition-colors">Comunidad</a></li>
              <li><a href="#chat" className="hover:text-black transition-colors">Chat</a></li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Comunidad</h4>
            <ul className="space-y-2 text-gray-600">
              <li><a href="#normas" className="hover:text-black transition-colors">Normas</a></li>
              <li><a href="#seguridad" className="hover:text-black transition-colors">Espacio Seguro</a></li>
              <li><a href="#ayuda" className="hover:text-black transition-colors">Ayuda</a></li>
              <li><a href="#contacto" className="hover:text-black transition-colors">Contacto</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-300 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-600 text-sm">
            © 2024 Amigas Queer Madriz. Hecho con <Heart className="w-4 h-4 inline text-pride-red" /> para nuestra comunidad.
          </div>
          <div className="flex space-x-6 text-sm text-gray-600 mt-4 md:mt-0">
            <a href="#privacidad" className="hover:text-black transition-colors">Privacidad</a>
            <a href="#terminos" className="hover:text-black transition-colors">Términos</a>
            <a href="#cookies" className="hover:text-black transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
