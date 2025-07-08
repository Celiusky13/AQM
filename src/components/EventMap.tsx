import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Users, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const GOOGLE_MAPS_API_KEY = 'AIzaSyADJSEBqkpMGN_bQLhCYhyW4NpRLzmSgR0';

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

type EventMapProps = {
  events: Event[];
  showAlerts?: boolean;
  onMapClick?: (lat: number, lng: number, address: string) => void;
};

const EventMap: React.FC<EventMapProps> = ({ events, showAlerts = false, onMapClick }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map | null>(null);
  const [selectedItem, setSelectedItem] = useState<Event | Alert | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const initMap = async () => {
      try {
        console.log('Cargando Google Maps para EventMap...');
        const loader = new Loader({
          apiKey: GOOGLE_MAPS_API_KEY,
          version: 'weekly',
          libraries: ['places', 'geometry']
        });

        await loader.load();
        console.log('Google Maps cargado exitosamente para EventMap');
        setIsLoaded(true);

        if (!mapContainer.current) return;

        const madridCenter = { lat: 40.4168, lng: -3.7038 };
        
        const mapInstance = new google.maps.Map(mapContainer.current, {
          center: madridCenter,
          zoom: 12,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        });

        map.current = mapInstance;

        // Agregar listener para clicks en el mapa
        if (onMapClick) {
          mapInstance.addListener('click', async (event: google.maps.MapMouseEvent) => {
            const lat = event.latLng?.lat();
            const lng = event.latLng?.lng();
            
            if (lat && lng) {
              try {
                // Usar geocoding para obtener la dirección
                const geocoder = new google.maps.Geocoder();
                const response = await geocoder.geocode({ location: { lat, lng } });
                
                let address = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
                if (response.results && response.results.length > 0) {
                  address = response.results[0].formatted_address;
                }
                
                onMapClick(lat, lng, address);
              } catch (error) {
                console.error('Error getting address:', error);
                onMapClick(lat, lng, `${lat.toFixed(6)}, ${lng.toFixed(6)}`);
              }
            }
          });
        }

      } catch (error) {
        console.error('Error cargando Google Maps en EventMap:', error);
        toast({
          title: "Error",
          description: "No se pudo cargar Google Maps",
          variant: "destructive",
        });
      }
    };

    initMap();
  }, [toast]);

  useEffect(() => {
    if (showAlerts) {
      fetchAlerts();
    }
  }, [showAlerts]);

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
        description: "No se pudieron cargar las alertas",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (!map.current || !isLoaded) return;

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));
    setMarkers([]);

    const newMarkers: google.maps.Marker[] = [];

    // Add event markers
    events.forEach((event) => {
      if (event.latitude && event.longitude) {
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

        const marker = new google.maps.Marker({
          position: { lat: event.latitude, lng: event.longitude },
          map: map.current,
          title: event.title,
          icon: {
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
              <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="18" fill="#EC4899" stroke="white" stroke-width="3"/>
                <text x="20" y="28" text-anchor="middle" font-size="18" fill="white">${getCategoryEmoji(event.category)}</text>
              </svg>
            `)}`,
            scaledSize: new google.maps.Size(40, 40),
            anchor: new google.maps.Point(20, 20)
          }
        });

        marker.addListener('click', () => {
          setSelectedItem(event);
        });

        newMarkers.push(marker);
      }
    });

    // Add alert markers if enabled
    if (showAlerts) {
      alerts.forEach((alert) => {
        if (alert.latitude && alert.longitude) {
          const getAlertEmoji = (alertType: string) => {
            const emojis: { [key: string]: string } = {
              'seguridad': '🚨',
              'trafico': '🚦',
              'evento': '📢',
              'clima': '🌧️',
              'otro': '⚠️'
            };
            return emojis[alertType] || '⚠️';
          };

          const marker = new google.maps.Marker({
            position: { lat: alert.latitude, lng: alert.longitude },
            map: map.current,
            title: alert.title,
            icon: {
              url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="20" cy="20" r="18" fill="#EF4444" stroke="white" stroke-width="3"/>
                  <text x="20" y="28" text-anchor="middle" font-size="18" fill="white">${getAlertEmoji(alert.alert_type)}</text>
                  <animateTransform attributeName="transform" type="scale" values="1;1.2;1" dur="2s" repeatCount="indefinite"/>
                </svg>
              `)}`,
              scaledSize: new google.maps.Size(40, 40),
              anchor: new google.maps.Point(20, 20)
            }
          });

          marker.addListener('click', () => {
            setSelectedItem(alert);
          });

          newMarkers.push(marker);
        }
      });
    }

    setMarkers(newMarkers);
  }, [events, alerts, isLoaded, showAlerts]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const flyToItem = (item: Event | Alert) => {
    if (item.latitude && item.longitude && map.current) {
      map.current.setCenter({ lat: item.latitude, lng: item.longitude });
      map.current.setZoom(16);
      setSelectedItem(item);
    }
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

  const getAlertEmoji = (alertType: string) => {
    const emojis: { [key: string]: string } = {
      'seguridad': '🚨',
      'trafico': '🚦',
      'evento': '📢',
      'clima': '🌧️',
      'otro': '⚠️'
    };
    return emojis[alertType] || '⚠️';
  };

  const isAlert = (item: Event | Alert): item is Alert => {
    return 'alert_type' in item;
  };

  return (
    <div className={`flex ${isMobile ? 'flex-col' : 'gap-6'} h-full`}>
      {/* Map */}
      <div className={`${isMobile ? 'h-full' : 'flex-1'} relative`}>
        <div ref={mapContainer} className="absolute inset-0 rounded-lg shadow-lg" />
      </div>

      {/* Items list - hidden on mobile, shown as overlay on desktop */}
      {!isMobile && (
        <div className="w-80 overflow-y-auto space-y-3">
          <h3 className="font-semibold text-lg mb-4">
            {showAlerts ? 'Eventos y Alertas' : 'Eventos en el mapa'}
          </h3>
          
          {/* Events */}
          {events.filter(event => event.latitude && event.longitude).map((event) => (
            <Card 
              key={event.id} 
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedItem?.id === event.id ? 'ring-2 ring-pride-purple' : ''
              }`}
              onClick={() => flyToItem(event)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">{getCategoryEmoji(event.category)}</span>
                    <Badge variant="secondary" className="text-xs">
                      {event.category}
                    </Badge>
                  </div>
                </div>
                <CardTitle className="text-sm">{event.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-1 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-3 h-3" />
                    <span>Máx. {event.max_attendees}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Alerts */}
          {showAlerts && alerts.map((alert) => (
            <Card 
              key={alert.id} 
              className={`cursor-pointer transition-all hover:shadow-md border-red-200 ${
                selectedItem?.id === alert.id ? 'ring-2 ring-red-500' : ''
              }`}
              onClick={() => flyToItem(alert)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">{getAlertEmoji(alert.alert_type)}</span>
                    <Badge variant="destructive" className="text-xs">
                      Alerta
                    </Badge>
                  </div>
                </div>
                <CardTitle className="text-sm text-red-700">{alert.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-1 text-xs text-gray-500">
                  <p className="text-red-600">{alert.description}</p>
                  <div className="flex items-center space-x-1">
                    <AlertTriangle className="w-3 h-3" />
                    <span className="capitalize">{alert.alert_type}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span>{alert.address}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(alert.created_at)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {events.filter(event => event.latitude && event.longitude).length === 0 && (!showAlerts || alerts.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No hay {showAlerts ? 'eventos o alertas' : 'eventos'} en el mapa</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EventMap;
