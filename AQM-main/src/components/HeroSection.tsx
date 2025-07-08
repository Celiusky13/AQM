
import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Users, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-white/80 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
          <div className="mb-8">
            <div className="flex flex-col items-center space-y-4">
              <div className="flex items-baseline space-x-1">
                <span className="letter-a1">A</span>
                <span className="letter-s">M</span>
                <span className="letter-a1">I</span>
                <span className="letter-g">G</span>
                <span className="letter-s">A</span>
                <span className="letter-g">S</span>
                <span className="mx-4"></span>
                <span className="mx-4"></span>
                <span className="letter-a1">Q</span>
                <span className="letter-s">U</span>
                <span className="letter-g">E</span>
                <span className="letter-s">E</span>
                <span className="letter-g">R</span>
              </div>
              <div className="flex items-baseline space-x-1">
                <span className="letter-a1">M</span>
                <span className="letter-s">A</span>
                <span className="letter-a1">D</span>
                <span className="letter-g">R</span>
                <span className="letter-s">I</span>
                <span className="letter-g">Z</span>
              </div>
            </div>
          </div>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed elegant-text">
            La comunidad donde <strong>todes</strong> somos familia.
            <br className="hidden md:block" />
            Conecta y celebra tu autenticidad en Madrid.
          </p>

          
          {/* Características simples */}
          <div className="flex flex-wrap justify-center gap-6 mb-12 text-gray-600">
            <span className="flex items-center space-x-2 elegant-text">
              <Users className="w-5 h-5" />
              <span>Comunidad</span>
            </span>
            <span className="flex items-center space-x-2 elegant-text">
              <Calendar className="w-5 h-5" />
              <span>Eventos</span>
            </span>
            <span className="flex items-center space-x-2 elegant-text">
              <MapPin className="w-5 h-5" />
              <span>Madrid</span>
            </span>
          </div>

          {/* CTA Simple */}
          <div className="max-w-md mx-auto">
            <div className="flex flex-col gap-4">
              <Button 
                size="lg" 
                className="bg-pride-gradient text-white hover:opacity-90 transition-opacity w-full elegant-text"
                onClick={() => navigate('/auth')}
              >
                Únete a la comunidad
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="hover:bg-gray-50 transition-colors w-full elegant-text"
                onClick={() => navigate('/community')}
              >
                Explorar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
