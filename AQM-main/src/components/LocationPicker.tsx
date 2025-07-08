
import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const GOOGLE_MAPS_API_KEY = 'AIzaSyADJSEBqkpMGN_bQLhCYhyW4NpRLzmSgR0';

type LocationPickerProps = {
  onLocationSelect: (location: {
    address: string;
    latitude: number;
    longitude: number;
    formattedAddress: string;
  }) => void;
  initialAddress?: string;
};

const LocationPicker: React.FC<LocationPickerProps> = ({ 
  onLocationSelect, 
  initialAddress = ''
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentAddress, setCurrentAddress] = useState(initialAddress);
  const { toast } = useToast();

  useEffect(() => {
    const initMap = async () => {
      try {
        console.log('Cargando Google Maps...');
        const loader = new Loader({
          apiKey: GOOGLE_MAPS_API_KEY,
          version: 'weekly',
          libraries: ['places', 'geometry']
        });

        await loader.load();
        console.log('Google Maps cargado exitosamente');
        setIsLoaded(true);

        if (!mapRef.current) return;

        // Centro en Madrid
        const madridCenter = { lat: 40.4168, lng: -3.7038 };
        
        const mapInstance = new google.maps.Map(mapRef.current, {
          center: madridCenter,
          zoom: 13,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        });

        setMap(mapInstance);

        const markerInstance = new google.maps.Marker({
          position: madridCenter,
          map: mapInstance,
          draggable: true,
          title: 'Arrastra para seleccionar ubicación'
        });

        setMarker(markerInstance);

        // Configurar autocomplete
        if (inputRef.current) {
          const autocompleteInstance = new google.maps.places.Autocomplete(inputRef.current, {
            fields: ['address_components', 'geometry', 'name', 'formatted_address'],
            types: ['address'],
            componentRestrictions: { country: 'es' }
          });

          setAutocomplete(autocompleteInstance);

          autocompleteInstance.addListener('place_changed', () => {
            const place = autocompleteInstance.getPlace();
            console.log('Lugar seleccionado desde autocomplete:', place);
            
            if (!place.geometry || !place.geometry.location) {
              toast({
                title: "Error",
                description: `No se encontraron detalles para: '${place.name}'`,
                variant: "destructive",
              });
              return;
            }

            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            const formattedAddress = place.formatted_address || place.name || '';
            
            // Actualizar mapa y marcador
            mapInstance.setCenter({ lat, lng });
            mapInstance.setZoom(16);
            markerInstance.setPosition({ lat, lng });
            
            // Actualizar el estado local
            setCurrentAddress(formattedAddress);

            // Notificar al componente padre
            console.log('Enviando datos de ubicación al padre:', { formattedAddress, lat, lng });
            onLocationSelect({
              address: formattedAddress,
              latitude: lat,
              longitude: lng,
              formattedAddress: formattedAddress
            });

            toast({
              title: "Ubicación seleccionada",
              description: formattedAddress,
            });
          });
        }

        // Listeners para clics en el mapa
        mapInstance.addListener('click', (event: google.maps.MapMouseEvent) => {
          console.log('Clic en mapa detectado');
          if (event.latLng) {
            const lat = event.latLng.lat();
            const lng = event.latLng.lng();
            markerInstance.setPosition({ lat, lng });
            geocodePosition(lat, lng);
          }
        });

        markerInstance.addListener('dragend', () => {
          console.log('Marcador arrastrado');
          const position = markerInstance.getPosition();
          if (position) {
            const lat = position.lat();
            const lng = position.lng();
            geocodePosition(lat, lng);
          }
        });

      } catch (error) {
        console.error('Error cargando Google Maps:', error);
        toast({
          title: "Error",
          description: "No se pudo cargar Google Maps",
          variant: "destructive",
        });
      }
    };

    initMap();
  }, [toast, onLocationSelect]);

  const geocodePosition = async (lat: number, lng: number) => {
    if (!isLoaded) return;

    console.log('Geocodificando posición:', lat, lng);
    const geocoder = new google.maps.Geocoder();
    
    try {
      const response = await geocoder.geocode({
        location: { lat, lng }
      });

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        const formattedAddress = result.formatted_address;
        
        console.log('Dirección geocodificada:', formattedAddress);
        
        // Actualizar el input
        if (inputRef.current) {
          inputRef.current.value = formattedAddress;
        }
        
        // Actualizar el estado local
        setCurrentAddress(formattedAddress);
        
        // Notificar al componente padre
        console.log('Enviando datos de geocodificación al padre:', { formattedAddress, lat, lng });
        onLocationSelect({
          address: formattedAddress,
          latitude: lat,
          longitude: lng,
          formattedAddress: formattedAddress
        });

        toast({
          title: "Ubicación actualizada",
          description: formattedAddress,
        });
      }
    } catch (error) {
      console.error('Error en geocodificación:', error);
      toast({
        title: "Error",
        description: "No se pudo obtener la dirección",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="location-search">Buscar dirección en Madrid</Label>
        <Input
          ref={inputRef}
          id="location-search"
          defaultValue={initialAddress}
          placeholder="Escribe una dirección, ej: Gran Vía, Madrid"
          className="w-full"
        />
        <p className="text-sm text-gray-500 mt-1">
          Escribe para buscar o selecciona directamente en el mapa
        </p>
      </div>

      <div className="space-y-2">
        <Label>Selecciona en el mapa</Label>
        <div 
          ref={mapRef} 
          className="w-full h-64 rounded-lg border border-gray-300"
          style={{ minHeight: '250px' }}
        />
        <p className="text-sm text-gray-500 flex items-center">
          <MapPin className="w-4 h-4 mr-1" />
          Haz clic en el mapa o arrastra el marcador para seleccionar la ubicación exacta
        </p>
        {currentAddress && (
          <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm">
            <strong>Ubicación actual:</strong> {currentAddress}
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationPicker;
