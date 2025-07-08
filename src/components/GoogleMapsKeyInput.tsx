
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExternalLink, Key } from 'lucide-react';

type GoogleMapsKeyInputProps = {
  onApiKeySet: (apiKey: string) => void;
};

const GoogleMapsKeyInput: React.FC<GoogleMapsKeyInputProps> = ({ onApiKeySet }) => {
  const [apiKey, setApiKey] = useState('');
  const [savedKey, setSavedKey] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('google_maps_api_key');
    if (stored) {
      setSavedKey(stored);
      onApiKeySet(stored);
    }
  }, [onApiKeySet]);

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem('google_maps_api_key', apiKey);
      setSavedKey(apiKey);
      onApiKeySet(apiKey);
    }
  };

  const handleClear = () => {
    localStorage.removeItem('google_maps_api_key');
    setSavedKey('');
    setApiKey('');
    onApiKeySet('');
  };

  if (savedKey) {
    return (
      <Alert>
        <Key className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>Google Maps configurado correctamente</span>
          <Button variant="outline" size="sm" onClick={handleClear}>
            Cambiar API Key
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Key className="w-5 h-5 mr-2" />
          Configurar Google Maps
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertDescription>
            Para usar el selector de ubicación, necesitas una API key de Google Maps.{' '}
            <a 
              href="https://developers.google.com/maps/documentation/javascript/get-api-key" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline inline-flex items-center"
            >
              Obtener API Key <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </AlertDescription>
        </Alert>

        <div>
          <Label htmlFor="google-maps-key">Google Maps API Key</Label>
          <div className="flex space-x-2">
            <Input
              id="google-maps-key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIza..."
            />
            <Button onClick={handleSave} disabled={!apiKey.trim()}>
              Guardar
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            La API key se guarda localmente en tu navegador
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoogleMapsKeyInput;
