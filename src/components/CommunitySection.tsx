import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, MapPin, Users, Heart, Calendar, Vote } from 'lucide-react';
const CommunitySection = () => {
  const features = [{
    icon: MapPin,
    title: "Mapa Interactivo",
    description: "Descubre eventos cerca de ti con nuestro mapa de Madrid lleno de planes queer",
    color: "text-pride-green",
    bgColor: "bg-green-100"
  }, {
    icon: MessageCircle,
    title: "Chat Comunitario",
    description: "Conecta con otras personas, crea grupos privados y participa en conversaciones increíbles",
    color: "text-pride-blue",
    bgColor: "bg-blue-100"
  }, {
    icon: Vote,
    title: "Vota Ideas",
    description: "Propón planes, vota las mejores ideas y ayuda a crear los eventos más deseados",
    color: "text-pride-purple",
    bgColor: "bg-purple-100"
  }, {
    icon: Users,
    title: "Perfiles Únicos",
    description: "Crea tu perfil con pronombres, etiquetas y conecta con personas afines",
    color: "text-pride-pink",
    bgColor: "bg-pink-100"
  }, {
    icon: Calendar,
    title: "Crear Eventos",
    description: "Organiza tus propios planes y compártelos con toda la comunidad madrileña",
    color: "text-pride-orange",
    bgColor: "bg-orange-100"
  }, {
    icon: Heart,
    title: "Espacio Seguro",
    description: "Una comunidad inclusiva donde todes somos bienvenides sin excepciones",
    color: "text-pride-red",
    bgColor: "bg-red-100"
  }];
  return <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            <span className="pride-text">Únete a la Familia</span> 👨‍👩‍👧‍👦
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubre todas las formas de conectar, compartir y celebrar juntes en nuestra plataforma
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => <Card key={index} className="group hover-lift border-0 shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 mx-auto ${feature.bgColor} rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </div>
                <CardTitle className="text-xl group-hover:text-pride-purple transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>)}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-pride-gradient p-8 rounded-3xl text-white max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold mb-4">¿Liste para ser parte? 🌈</h3>
            <p className="text-xl mb-6 opacity-90">
              Únete a cientos de personas que ya están creando la Madrid más inclusiva y divertida
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white hover:bg-gray-100 text-lg px-8 py-4 text-slate-950">
                Crear cuenta gratis ✨
              </Button>
              <Button size="lg" variant="outline" className="border-white text-lg px-8 py-4 text-zinc-950 bg-white">
                Ver comunidad 👀
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default CommunitySection;