import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Users, Filter, Plus, AlertTriangle, ChevronUp, ChevronDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import EventMap from '@/components/EventMap';
import EventForm from '@/components/EventForm';
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

type Alert = {
  id: string;
  title: string;
  description: string;
  alert_type: string;
  latitude: number;
  longitude: number;
  address: string;
  created_at: string;
};

const Map = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [selectedMapLocation, setSelectedMapLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);
  const [showMobilePanel, setShowMobilePanel] = useState(false);

  useEffect(() => {
    fetchEvents();
    fetchAlerts();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .not('latitude', 'is', null)
        .not('longitude', 'is', null)
        .order('date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los eventos del mapa.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAlerts(data || []);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las alertas.",
        variant: "destructive",
      });
    }
  };

  const filteredEvents = categoryFilter === 'all' 
    ? events 
    : events.filter(event => event.category === categoryFilter);

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
      setSelectedMapLocation(null);
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

  const handleMapClick = (lat: number, lng: number, address: string) => {
    if (user) {
      setSelectedMapLocation({ lat, lng, address });
      setShowForm(true);
      setEditingEvent(null);
    } else {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para crear eventos.",
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
      
      {/* Mobile-first layout */}
      <div className="container mx-auto px-4 py-4 lg:py-8">
        {/* Header section - optimized for mobile */}
        <div className="flex flex-col space-y-4 mb-6 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          <div className="text-center lg:text-left">
            <h1 className="text-2xl lg:text-4xl font-bold mb-2">
              <span className="pride-text">Mapa de Madrid</span> <span>🗺️</span>
            </h1>
            <p className="text-sm lg:text-base text-gray-600">Explora eventos y alertas de la ciudad</p>
          </div>
          
          {/* Mobile controls */}
          <div className="flex flex-col space-y-2 lg:flex-row lg:items-center lg:space-y-0 lg:space-x-4">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filtrar categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                <SelectItem value="bar">🍻 Bar</SelectItem>
                <SelectItem value="picnic">🧺 Picnic</SelectItem>
                <SelectItem value="charla">💬 Charla</SelectItem>
                <SelectItem value="discoteca">🪩 Discoteca</SelectItem>
                <SelectItem value="otro">✨ Otro</SelectItem>
              </SelectContent>
            </Select>

            {user && (
              <Button
                onClick={() => setShowForm(true)}
                className="bg-pride-gradient text-white w-full lg:w-auto"
              >
                <Plus className="w-4 h-4 mr-2" />
                Crear Evento
              </Button>
            )}
          </div>
        </div>

        {/* Quick stats for mobile */}
        <div className="grid grid-cols-2 gap-4 mb-6 lg:hidden">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold pride-text">{filteredEvents.length}</div>
              <div className="text-xs text-gray-500">Eventos</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-500">{alerts.length}</div>
              <div className="text-xs text-gray-500">Alertas</div>
            </CardContent>
          </Card>
        </div>

        {/* Main content area */}
        <div className="space-y-6 lg:grid lg:grid-cols-4 lg:gap-6 lg:space-y-0">
          {/* Desktop sidebar - hidden on mobile */}
          <div className="hidden lg:block lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Estadísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold pride-text">{filteredEvents.length}</div>
                  <div className="text-sm text-gray-500">Eventos en el mapa</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-500">{alerts.length}</div>
                  <div className="text-sm text-gray-500">Alertas activas</div>
                </div>
                
                <div className="space-y-2">
                  {['bar', 'picnic', 'charla', 'discoteca', 'otro'].map(category => {
                    const count = events.filter(e => e.category === category).length;
                    const emoji = {
                      'bar': '🍻',
                      'picnic': '🧺',
                      'charla': '💬',
                      'discoteca': '🪩',
                      'otro': '✨'
                    }[category];
                    
                    return (
                      <div key={category} className="flex justify-between items-center">
                        <span className="text-sm capitalize">{emoji} {category}</span>
                        <Badge variant="secondary">{count}</Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Alertas recientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {alerts.slice(0, 3).map((alert) => (
                    <div key={alert.id} className="p-2 bg-red-50 rounded-lg border border-red-200">
                      <div className="font-medium text-sm text-red-700">{alert.title}</div>
                      <div className="text-xs text-red-500 flex items-center">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        {alert.alert_type}
                      </div>
                    </div>
                  ))}
                  {alerts.length === 0 && (
                    <p className="text-sm text-gray-500">No hay alertas activas</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Map section - responsive */}
          <div className="lg:col-span-3">
            <Card className="h-[400px] lg:h-[600px]">
              <CardContent className="p-0 h-full">
                {filteredEvents.length > 0 || alerts.length > 0 ? (
                  <EventMap 
                    events={filteredEvents} 
                    showAlerts={true} 
                    onMapClick={handleMapClick}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center p-4">
                      <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <h3 className="text-lg font-semibold mb-2">No hay eventos o alertas</h3>
                      <p className="text-gray-500 text-sm">Los eventos y alertas aparecerán cuando tengan coordenadas</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Mobile bottom panel toggle */}
        <div className="lg:hidden">
          <Button
            onClick={() => setShowMobilePanel(!showMobilePanel)}
            className="w-full mt-4 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
            variant="outline"
          >
            {showMobilePanel ? (
              <>
                <ChevronDown className="w-4 h-4 mr-2" />
                Ocultar detalles
              </>
            ) : (
              <>
                <ChevronUp className="w-4 h-4 mr-2" />
                Ver eventos y alertas ({filteredEvents.length + alerts.length})
              </>
            )}
          </Button>

          {/* Mobile collapsible panel */}
          {showMobilePanel && (
            <div className="mt-4 space-y-4">
              {/* Category breakdown */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Por categoría</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {['bar', 'picnic', 'charla', 'discoteca', 'otro'].map(category => {
                      const count = events.filter(e => e.category === category).length;
                      const emoji = {
                        'bar': '🍻',
                        'picnic': '🧺',
                        'charla': '💬',
                        'discoteca': '🪩',
                        'otro': '✨'
                      }[category];
                      
                      return (
                        <div key={category} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="text-sm">{emoji} {category}</span>
                          <Badge variant="secondary" className="text-xs">{count}</Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Recent alerts */}
              {alerts.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Alertas recientes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {alerts.slice(0, 3).map((alert) => (
                        <div key={alert.id} className="p-3 bg-red-50 rounded-lg border border-red-200">
                          <div className="font-medium text-sm text-red-700 mb-1">{alert.title}</div>
                          <div className="text-xs text-red-600">{alert.description}</div>
                          <div className="text-xs text-red-500 flex items-center mt-2">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            {alert.alert_type} • {formatDate(alert.created_at)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Upcoming events */}
              {filteredEvents.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Próximos eventos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {filteredEvents.slice(0, 3).map((event) => (
                        <div key={event.id} className="p-3 bg-gray-50 rounded-lg">
                          <div className="font-medium text-sm mb-1">{event.title}</div>
                          <div className="text-xs text-gray-600 space-y-1">
                            <div className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {formatDate(event.date)}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              {event.location}
                            </div>
                            <div className="flex items-center">
                              <Users className="w-3 h-3 mr-1" />
                              Máx. {event.max_attendees}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <EventForm
          event={editingEvent}
          preselectedLocation={selectedMapLocation}
          onSubmit={handleEventSubmit}
          onClose={() => {
            setShowForm(false);
            setEditingEvent(null);
            setSelectedMapLocation(null);
          }}
        />
      )}
    </div>
  );
};

export default Map;
