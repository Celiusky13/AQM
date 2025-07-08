import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Users, Plus, Edit2, Trash2, List, Map } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import EventForm from '@/components/EventForm';
import EventMap from '@/components/EventMap';
import Header from '@/components/Header';

type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  address: string;
  latitude: number;
  longitude: number;
  category: string;
  max_attendees: number;
  user_id: string;
  created_at: string;
};

const Events = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los eventos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEventSubmit = async (eventData: any) => {
    try {
      if (editingEvent) {
        const { error } = await supabase
          .from('events')
          .update(eventData)
          .eq('id', editingEvent.id);

        if (error) throw error;

        toast({
          title: "¡Evento actualizado!",
          description: "El evento se ha actualizado correctamente.",
        });
      } else {
        const { error } = await supabase
          .from('events')
          .insert([{ ...eventData, user_id: user?.id }]);

        if (error) throw error;

        toast({
          title: "¡Evento creado!",
          description: "Tu evento se ha creado correctamente.",
        });
      }

      setShowForm(false);
      setEditingEvent(null);
      fetchEvents();
    } catch (error) {
      console.error('Error saving event:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar el evento.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('¿Estás segura de que quieres eliminar este evento?')) return;

    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;

      toast({
        title: "Evento eliminado",
        description: "El evento se ha eliminado correctamente.",
      });

      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el evento.",
        variant: "destructive",
      });
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pride-purple"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold pride-text mb-1 md:mb-2">Eventos</h1>
              <p className="text-gray-600 text-sm md:text-base">Descubre y crea eventos increíbles para la comunidad</p>
            </div>
            
            {user && (
              <Button
                onClick={() => setShowForm(true)}
                className="bg-pride-gradient text-white w-full md:w-auto order-first md:order-last"
                size="lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                Crear Evento
              </Button>
            )}
          </div>

          <div className="flex justify-center mt-4 md:mt-6">
            <div className="flex rounded-lg border border-gray-200 overflow-hidden bg-white shadow-sm">
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                onClick={() => setViewMode('list')}
                className="rounded-none px-6 md:px-8"
                size="sm"
              >
                <List className="w-4 h-4 mr-2 md:mr-1" />
                <span className="hidden md:inline">Lista</span>
              </Button>
              <Button
                variant={viewMode === 'map' ? 'default' : 'ghost'}
                onClick={() => setViewMode('map')}
                className="rounded-none px-6 md:px-8"
                size="sm"
              >
                <Map className="w-4 h-4 mr-2 md:mr-1" />
                <span className="hidden md:inline">Mapa</span>
              </Button>
            </div>
          </div>
        </div>

        {viewMode === 'map' ? (
          <div className="h-[70vh] md:h-[80vh]">
            <EventMap events={events} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {events.map((event) => (
              <Card key={event.id} className="hover-lift border-0 shadow-lg">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="text-2xl md:text-3xl mb-2">{getCategoryEmoji(event.category)}</div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs">
                        {event.category}
                      </Badge>
                      {user?.id === event.user_id && (
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingEvent(event);
                              setShowForm(true);
                            }}
                            className="h-8 w-8 p-0"
                          >
                            <Edit2 className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteEvent(event.id)}
                            className="text-red-500 hover:text-red-700 h-8 w-8 p-0"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  <CardTitle className="text-lg leading-tight">{event.title}</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
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
        )}

        {events.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl md:text-6xl mb-4">🎉</div>
            <h3 className="text-xl font-semibold mb-2">No hay eventos aún</h3>
            <p className="text-gray-600 mb-6 px-4">¡Sé la primera en crear un evento increíble!</p>
            {user && (
              <Button
                onClick={() => setShowForm(true)}
                className="bg-pride-gradient text-white"
                size="lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                Crear Primer Evento
              </Button>
            )}
          </div>
        )}
      </div>

      {showForm && (
        <EventForm
          event={editingEvent}
          onSubmit={handleEventSubmit}
          onClose={() => {
            setShowForm(false);
            setEditingEvent(null);
          }}
        />
      )}
    </div>
  );
};

export default Events;
