
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import LocationPicker from './LocationPicker';

type EventFormProps = {
  event?: any;
  onSubmit: (eventData: any) => void;
  onClose: () => void;
  preselectedLocation?: {
    lat: number;
    lng: number;
    address: string;
  };
};

const EventForm: React.FC<EventFormProps> = ({ event, onSubmit, onClose, preselectedLocation }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    address: '',
    category: 'bar',
    max_attendees: 50,
    latitude: null as number | null,
    longitude: null as number | null
  });

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        description: event.description || '',
        date: event.date ? new Date(event.date).toISOString().slice(0, 16) : '',
        location: event.location || '',
        address: event.address || '',
        category: event.category || 'bar',
        max_attendees: event.max_attendees || 50,
        latitude: event.latitude || null,
        longitude: event.longitude || null
      });
    } else if (preselectedLocation) {
      setFormData(prev => ({
        ...prev,
        latitude: preselectedLocation.lat,
        longitude: preselectedLocation.lng,
        address: preselectedLocation.address
      }));
    }
  }, [event, preselectedLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Datos del formulario al enviar:', formData);
    
    if (!formData.latitude || !formData.longitude) {
      alert('Por favor selecciona una ubicación en el mapa');
      return;
    }
    
    const eventData = {
      ...formData,
      date: new Date(formData.date).toISOString(),
    };

    console.log('Enviando evento:', eventData);
    onSubmit(eventData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'max_attendees' ? parseInt(value) : value
    }));
  };

  const extractLocationFromAddress = (fullAddress: string): string => {
    // Extraer información relevante para el campo "lugar"
    const addressParts = fullAddress.split(',');
    
    // Buscar palabras clave que indiquen barrios/zonas conocidas de Madrid
    const madridNeighborhoods = [
      'Malasaña', 'Chueca', 'La Latina', 'Lavapiés', 'Salamanca', 'Chamberí',
      'Retiro', 'Centro', 'Sol', 'Gran Vía', 'Plaza Mayor', 'Atocha',
      'Argüelles', 'Moncloa', 'Cuatro Caminos', 'Nuevos Ministerios',
      'Plaza de España', 'Callao', 'Opera'
    ];

    // Buscar si alguna parte contiene un barrio conocido
    for (const part of addressParts) {
      const cleanPart = part.trim();
      for (const neighborhood of madridNeighborhoods) {
        if (cleanPart.toLowerCase().includes(neighborhood.toLowerCase())) {
          return neighborhood;
        }
      }
    }

    // Si no encuentra barrio, usar las primeras partes de la dirección
    if (addressParts.length >= 2) {
      // Tomar la calle y el primer elemento adicional (posiblemente barrio)
      const street = addressParts[0].trim();
      const area = addressParts[1].trim();
      
      // Si el área parece un código postal o contiene números, usar solo la calle
      if (/^\d/.test(area)) {
        return street;
      }
      
      return `${street}, ${area}`;
    }

    // Fallback: usar la primera parte de la dirección
    return addressParts[0].trim();
  };

  const handleLocationSelect = (locationData: {
    address: string;
    latitude: number;
    longitude: number;
    formattedAddress: string;
  }) => {
    console.log('Datos de ubicación recibidos en EventForm:', locationData);
    
    const extractedLocation = extractLocationFromAddress(locationData.formattedAddress);
    
    console.log('Ubicación extraída:', extractedLocation);
    
    setFormData(prev => {
      const newData = {
        ...prev,
        location: extractedLocation, // Auto-rellenar el campo lugar
        address: locationData.formattedAddress,
        latitude: locationData.latitude,
        longitude: locationData.longitude
      };
      console.log('Nuevo estado del formulario:', newData);
      return newData;
    });
  };

  // Verificar si el formulario está completo
  const isFormValid = formData.title && formData.date && formData.location && formData.latitude && formData.longitude;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {event ? 'Editar Evento' : 'Crear Nuevo Evento'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title">Título del evento *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ej: Noche de Karaoke Queer"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe tu evento..."
              className="min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Fecha y hora *</Label>
              <Input
                id="date"
                name="date"
                type="datetime-local"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="category">Categoría *</Label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                required
              >
                <option value="bar">Bar</option>
                <option value="picnic">Picnic</option>
                <option value="charla">Charla</option>
                <option value="discoteca">Discoteca</option>
                <option value="otro">Otro</option>
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="location">Lugar *</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Se completará automáticamente al seleccionar ubicación"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Este campo se rellena automáticamente cuando seleccionas una ubicación en el mapa
            </p>
          </div>

          <div>
            <Label>Ubicación exacta *</Label>
            <LocationPicker
              onLocationSelect={handleLocationSelect}
              initialAddress={formData.address}
            />
            
            {formData.address && (
              <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
                <strong>Dirección seleccionada:</strong> {formData.address}
                <br />
                <strong>Coordenadas:</strong> {formData.latitude?.toFixed(6)}, {formData.longitude?.toFixed(6)}
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="max_attendees">Máximo de asistentes</Label>
            <Input
              id="max_attendees"
              name="max_attendees"
              type="number"
              value={formData.max_attendees}
              onChange={handleChange}
              min="1"
              max="500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="bg-pride-gradient text-white"
              disabled={!isFormValid}
            >
              {event ? 'Actualizar' : 'Crear'} Evento
            </Button>
          </div>
          
          {!isFormValid && (
            <div className="text-sm text-red-500 mt-2">
              {!formData.title && "• Falta el título del evento\n"}
              {!formData.date && "• Falta la fecha del evento\n"}
              {!formData.location && "• Falta seleccionar una ubicación\n"}
              {(!formData.latitude || !formData.longitude) && "• Falta seleccionar ubicación en el mapa\n"}
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EventForm;
