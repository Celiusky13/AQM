
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import LocationPicker from './LocationPicker';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type AlertFormProps = {
  onClose: () => void;
  onAlertCreated: () => void;
};

const AlertForm: React.FC<AlertFormProps> = ({ onClose, onAlertCreated }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    alert_type: 'seguridad',
    address: '',
    latitude: null as number | null,
    longitude: null as number | null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.latitude || !formData.longitude) {
      toast({
        title: "Error",
        description: "Debes seleccionar una ubicación en el mapa",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('alerts')
        .insert([{
          title: formData.title,
          description: formData.description,
          alert_type: formData.alert_type,
          address: formData.address,
          latitude: formData.latitude,
          longitude: formData.longitude,
          user_id: user?.id
        }]);

      if (error) throw error;

      toast({
        title: "¡Alerta creada!",
        description: "Tu alerta se ha publicado correctamente.",
      });

      onAlertCreated();
      onClose();
    } catch (error) {
      console.error('Error creating alert:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la alerta.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLocationSelect = (locationData: {
    address: string;
    latitude: number;
    longitude: number;
    formattedAddress: string;
  }) => {
    setFormData(prev => ({
      ...prev,
      address: locationData.formattedAddress,
      latitude: locationData.latitude,
      longitude: locationData.longitude
    }));
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear Nueva Alerta</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title">Título de la alerta *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ej: Corte de tráfico en Gran Vía"
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
              placeholder="Describe la situación..."
              className="min-h-[80px]"
            />
          </div>

          <div>
            <Label htmlFor="alert_type">Tipo de alerta *</Label>
            <select
              id="alert_type"
              name="alert_type"
              value={formData.alert_type}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              required
            >
              <option value="seguridad">🚨 Seguridad</option>
              <option value="trafico">🚦 Tráfico</option>
              <option value="evento">📢 Evento</option>
              <option value="clima">🌧️ Clima</option>
              <option value="otro">⚠️ Otro</option>
            </select>
          </div>

          <div>
            <Label>Ubicación exacta *</Label>
            <LocationPicker
              onLocationSelect={handleLocationSelect}
              initialAddress={formData.address}
            />
            
            {formData.address && (
              <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                <strong>Ubicación seleccionada:</strong> {formData.address}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="bg-red-500 hover:bg-red-600 text-white"
              disabled={!formData.address || !formData.latitude || !formData.longitude || isSubmitting}
            >
              {isSubmitting ? 'Creando...' : 'Crear Alerta'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AlertForm;
