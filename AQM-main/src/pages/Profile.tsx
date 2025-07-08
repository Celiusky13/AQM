
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Instagram, User, X, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Database } from '@/integrations/supabase/types';

type IdentityTag = Database['public']['Enums']['identity_tag'];

type ProfileData = {
  username: string;
  first_name: string;
  last_name: string;
  age: number;
  instagram_username: string;
  identity_tags: IdentityTag[];
};

const identityOptions: IdentityTag[] = [
  'lesbiana', 'gay', 'bisexual', 'trans', 'no_binarie', 
  'queer', 'intersex', 'asexual', 'pansexual', 'aliade', 
  'cuir', 'fluido', 'otro'
];

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  const form = useForm<ProfileData>({
    defaultValues: {
      username: '',
      first_name: '',
      last_name: '',
      age: 18,
      instagram_username: '',
      identity_tags: []
    },
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      console.log('Fetching profile for user:', user?.id);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }

      console.log('Profile data:', data);

      if (data) {
        setProfile(data);
        form.reset({
          username: data.username || '',
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          age: data.age || 18,
          instagram_username: data.instagram_username || '',
          identity_tags: (data.identity_tags as IdentityTag[]) || []
        });
      } else {
        console.log('No profile found, creating default profile');
        await createDefaultProfile();
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar el perfil. Inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  const createDefaultProfile = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .insert({
          user_id: user?.id,
          username: user?.email?.split('@')[0] || 'usuario',
          first_name: '',
          last_name: '',
          age: 18
        });

      if (error) throw error;

      await fetchProfile();
    } catch (error) {
      console.error('Error creating default profile:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el perfil.",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data: ProfileData) => {
    setLoading(true);
    
    try {
      console.log('Updating profile with data:', data);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          username: data.username,
          first_name: data.first_name,
          last_name: data.last_name,
          age: data.age,
          instagram_username: data.instagram_username,
          identity_tags: data.identity_tags
        })
        .eq('user_id', user?.id);

      if (error) {
        console.error('Error updating profile:', error);
        throw error;
      }

      toast({
        title: "¡Perfil actualizado!",
        description: "Tus cambios han sido guardados correctamente.",
      });
    } catch (error) {
      console.error('Error in onSubmit:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el perfil.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleIdentityTag = (tag: IdentityTag) => {
    const currentTags = form.getValues('identity_tags');
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    form.setValue('identity_tags', newTags);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Acceso Restringido</h1>
            <p className="text-gray-600 mb-4">Por favor, inicia sesión para ver tu perfil.</p>
            <Button onClick={() => window.location.href = '/auth'}>
              Iniciar Sesión
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Header con botón de cerrar */}
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al inicio
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="text-center mb-8">
            <Avatar className="w-24 h-24 mx-auto mb-4">
              <AvatarImage src={profile?.avatar_url} />
              <AvatarFallback className="bg-pride-gradient text-white text-2xl">
                <User className="w-12 h-12" />
              </AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm" className="mb-4">
              <Camera className="w-4 h-4 mr-2" />
              Cambiar foto
            </Button>
            <h1 className="text-3xl font-bold pride-text">Mi Perfil</h1>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                rules={{ 
                  required: "El nombre de usuario es obligatorio",
                  pattern: {
                    value: /^[a-zA-Z0-9_]+$/,
                    message: "Solo letras, números y guiones bajos"
                  }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de usuario</FormLabel>
                    <FormControl>
                      <Input placeholder="@tu_usuario" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="first_name"
                  rules={{ required: "El nombre es obligatorio" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input placeholder="Tu nombre" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="last_name"
                  rules={{ required: "Los apellidos son obligatorios" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apellidos</FormLabel>
                      <FormControl>
                        <Input placeholder="Tus apellidos" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="instagram_username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Instagram className="w-4 h-4" />
                      Instagram (opcional)
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="@tu_instagram" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="age"
                rules={{ 
                  required: "La edad es obligatoria",
                  min: { value: 16, message: "Debes tener al menos 16 años" }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Edad</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="18" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <FormLabel>Etiquetas de identidad</FormLabel>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {identityOptions.map((tag) => (
                    <Button
                      key={tag}
                      type="button"
                      variant={form.watch('identity_tags').includes(tag) ? "default" : "outline"}
                      size="sm"
                      className={`text-xs ${
                        form.watch('identity_tags').includes(tag) 
                          ? 'bg-pride-gradient text-white' 
                          : ''
                      }`}
                      onClick={() => toggleIdentityTag(tag)}
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <Button 
                  type="submit" 
                  className="flex-1 bg-pride-gradient text-white" 
                  disabled={loading}
                >
                  {loading ? 'Guardando...' : 'Actualizar Perfil'}
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate('/')}
                  disabled={loading}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
