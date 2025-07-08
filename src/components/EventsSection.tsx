
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Users, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  max_attendees: number;
  user_id?: string;
};

const EventsSection = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentEvents();
  }, []);

  const fetchRecentEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('id, title, description, date, location, category, max_attendees, user_id')
        .order('date', { ascending: true })
        .limit(4);

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryEmoji = (category: string) => {
    const emojis: { [key: string]: string } = {
      'bar': '🍻',
      'picnic': '🧺',
      'charla': '💬',
      'discoteca': '🪩',
      'otro': '✨'
    };
    return emojis[category] || '✨';
  };

  const getCategoryGradient = (category: string) => {
    const gradients: { [key: string]: string } = {
      'bar': 'from-pride-pink to-pride-purple',
      'picnic': 'from-pride-green to-pride-yellow',
      'charla': 'from-pride-blue to-pride-cyan',
      'discoteca': 'from-pride-orange to-pride-red',
      'otro': 'from-pride-pink to-pride-purple'
    };
    return gradients[category] || 'from-pride-pink to-pride-purple';
  };

  const fallbackEvents = [
    {
      id: 'demo-1',
      title: "Noche de Karaoke Queer",
      description: "Cantamos, reímos y celebramos juntes en el mejor karaoke LGBTQ+ de Madrid.",
      date: "2024-12-25T21:00:00",
      location: "Malasaña",
      category: "bar",
      max_attendees: 30
    },
    {
      id: 'demo-2',
      title: "Picnic Pride en El Retiro",
      description: "Tarde de relax, comida rica y buena compañía en el parque más bonito de Madrid.",
      date: "2024-12-30T17:00:00",
      location: "Parque del Retiro",
      category: "picnic",
      max_attendees: 20
    },
    {
      id: 'demo-3',
      title: "Charla: Diversidad Corporal",
      description: "Espacio seguro para hablar sobre amor propio, diversidad corporal y bienestar.",
      date: "2024-12-28T19:30:00",
      location: "Centro LGBTI",
      category: "charla",
      max_attendees: 15
    },
    {
      id: 'demo-4',
      title: "Fiesta Disco Fever",
      description: "La mejor música disco, ambiente increíble y pista de baile que no para.",
      date: "2025-01-01T23:00:00",
      location: "Chueca",
      category: "discoteca",
      max_attendees: 50
    }
  ];

  const displayEvents = events.length > 0 ? events : fallbackEvents;

  if (loading) {
    return (
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pride-purple"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="pride-text">Próximos Eventos</span> ✨
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-2">
            Descubre los planes más emocionantes de la comunidad queer madrileña
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {displayEvents.map((event) => (
            <Card key={event.id} className="group hover-lift overflow-hidden border-0 shadow-lg">
              <div className={`h-2 bg-gradient-to-r ${getCategoryGradient(event.category)}`}></div>
              
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="text-2xl md:text-3xl mb-2">{getCategoryEmoji(event.category)}</div>
                  <Badge variant="secondary" className="text-xs">
                    {event.category}
                  </Badge>
                </div>
                <CardTitle className="text-base md:text-lg group-hover:text-pride-purple transition-colors leading-tight">
                  {event.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3 md:space-y-4">
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                  {event.description}
                </p>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Users className="w-4 h-4 flex-shrink-0" />
                    <span>Máximo {event.max_attendees} personas</span>
                  </div>
                </div>

                <Button className="bg-pride-gradient text-white w-full hover:opacity-90 transition-opacity elegant-text">
                  Me apunto 🎉
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8 md:mt-12">
          <Button 
            size="lg" 
            variant="outline" 
            className="text-base md:text-lg px-6 md:px-8 py-3 md:py-4 hover:bg-gray-100"
            onClick={() => navigate('/events')}
          >
            Ver todos los eventos 📅
          </Button>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
