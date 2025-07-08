
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, Users, MapPin, Calendar, MessageCircle, Star, Grid, List } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';

type Profile = {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  bio?: string;
  pronouns?: string;
  identity_tags?: string[];
  avatar_url?: string;
  age?: number;
};

type CommunityStats = {
  totalMembers: number;
  totalEvents: number;
  activeToday: number;
};

const Community = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [stats, setStats] = useState<CommunityStats>({ totalMembers: 0, totalEvents: 0, activeToday: 0 });
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetchCommunityData();
  }, []);

  const fetchCommunityData = async () => {
    try {
      // Obtener perfiles de la comunidad
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .limit(12);

      if (profilesError) throw profilesError;

      const { count: membersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      const { count: eventsCount } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true });

      setProfiles(profilesData || []);
      setStats({
        totalMembers: membersCount || 0,
        totalEvents: eventsCount || 0,
        activeToday: Math.floor((membersCount || 0) * 0.15)
      });
    } catch (error) {
      console.error('Error fetching community data:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos de la comunidad.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getRandomColor = () => {
    const colors = ['bg-pride-pink', 'bg-pride-purple', 'bg-pride-blue', 'bg-pride-green', 'bg-pride-orange'];
    return colors[Math.floor(Math.random() * colors.length)];
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
      
      <div className="container mx-auto px-3 md:px-4 py-4 md:py-8">
        {/* Header móvil optimizado */}
        <div className="text-center mb-6 md:mb-12">
          <h1 className="text-2xl md:text-4xl font-bold pride-text mb-2 md:mb-4">
            Nuestra Comunidad 👥
          </h1>
          <p className="text-sm md:text-xl text-gray-600 max-w-3xl mx-auto px-2">
            Conoce a las personas increíbles que forman parte de Amigas Queer Madriz
          </p>
        </div>

        {/* Estadísticas - Layout móvil mejorado */}
        <div className="grid grid-cols-3 gap-2 md:gap-6 mb-6 md:mb-12">
          <Card className="text-center hover-lift">
            <CardContent className="pt-3 md:pt-6 pb-3 md:pb-6">
              <div className="text-xl md:text-4xl font-bold pride-text mb-1 md:mb-2">
                {stats.totalMembers}
              </div>
              <div className="flex items-center justify-center text-gray-600 text-xs md:text-base">
                <Users className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                <span className="hidden md:inline">Miembros totales</span>
                <span className="md:hidden">Miembros</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="text-center hover-lift">
            <CardContent className="pt-3 md:pt-6 pb-3 md:pb-6">
              <div className="text-xl md:text-4xl font-bold pride-text mb-1 md:mb-2">
                {stats.totalEvents}
              </div>
              <div className="flex items-center justify-center text-gray-600 text-xs md:text-base">
                <Calendar className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                <span className="hidden md:inline">Eventos creados</span>
                <span className="md:hidden">Eventos</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="text-center hover-lift">
            <CardContent className="pt-3 md:pt-6 pb-3 md:pb-6">
              <div className="text-xl md:text-4xl font-bold pride-text mb-1 md:mb-2">
                {stats.activeToday}
              </div>
              <div className="flex items-center justify-center text-gray-600 text-xs md:text-base">
                <Heart className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                <span className="hidden md:inline">Actives hoy</span>
                <span className="md:hidden">Actives</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controles de vista - Solo en móvil */}
        <div className="flex justify-between items-center mb-4 md:hidden">
          <h2 className="text-lg font-bold">Miembros</h2>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="h-8 w-8 p-0"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="h-8 w-8 p-0"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Título desktop */}
        <h2 className="text-2xl font-bold mb-6 hidden md:block">Miembros de la Comunidad</h2>

        {/* Miembros - Layout responsivo */}
        {profiles.length > 0 ? (
          <div className={`mb-8 md:mb-12 ${
            viewMode === 'grid' 
              ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6' 
              : 'space-y-3 md:hidden'
          } md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6`}>
            {profiles.map((profile) => (
              <Card key={profile.id} className={`hover-lift ${viewMode === 'list' ? 'md:hidden' : ''}`}>
                {viewMode === 'grid' ? (
                  <CardContent className="pt-4 md:pt-6 text-center px-3 md:px-6">
                    <Avatar className="w-12 h-12 md:w-20 md:h-20 mx-auto mb-2 md:mb-4">
                      <AvatarImage src={profile.avatar_url} />
                      <AvatarFallback className={getRandomColor()}>
                        {getInitials(profile.first_name, profile.last_name)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <h3 className="font-semibold text-sm md:text-lg mb-1">{profile.username}</h3>
                    <p className="text-xs md:text-sm text-gray-600 mb-2">
                      {profile.first_name} {profile.last_name}
                    </p>
                    
                    {profile.pronouns && (
                      <Badge variant="outline" className="mb-2 text-xs">
                        {profile.pronouns}
                      </Badge>
                    )}
                    
                    {profile.bio && (
                      <p className="text-xs md:text-sm text-gray-500 mb-3 line-clamp-2">
                        {profile.bio}
                      </p>
                    )}
                    
                    {profile.identity_tags && profile.identity_tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 justify-center mb-3">
                        {profile.identity_tags.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {profile.identity_tags.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{profile.identity_tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    <Button size="sm" variant="outline" className="w-full text-xs md:text-sm touch-target">
                      <MessageCircle className="w-3 h-3 mr-2" />
                      Conectar
                    </Button>
                  </CardContent>
                ) : (
                  <CardContent className="p-3 md:hidden">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={profile.avatar_url} />
                        <AvatarFallback className={getRandomColor()}>
                          {getInitials(profile.first_name, profile.last_name)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">{profile.username}</h3>
                        <p className="text-xs text-gray-600">
                          {profile.first_name} {profile.last_name}
                        </p>
                        {profile.pronouns && (
                          <Badge variant="outline" className="text-xs mt-1">
                            {profile.pronouns}
                          </Badge>
                        )}
                      </div>
                      
                      <Button size="sm" variant="outline" className="touch-target">
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold mb-2">Aún no hay miembros visibles</h3>
            <p className="text-gray-500">¡Sé la primera en completar tu perfil!</p>
          </div>
        )}

        {/* Valores de la comunidad - Optimizado para móvil */}
        <div className="bg-pride-gradient p-6 md:p-8 rounded-2xl md:rounded-3xl text-white">
          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 md:mb-4">Nuestros Valores 🌈</h2>
            <p className="text-lg md:text-xl opacity-90">
              Los principios que nos unen como comunidad
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="text-center">
              <div className="text-3xl md:text-4xl mb-2 md:mb-3">💖</div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">Inclusividad</h3>
              <p className="opacity-90 text-sm md:text-base">Todas las identidades son bienvenidas y celebradas</p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl md:text-4xl mb-2 md:mb-3">🤝</div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">Respeto</h3>
              <p className="opacity-90 text-sm md:text-base">Tratamos a todes con dignidad y comprensión</p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl md:text-4xl mb-2 md:mb-3">🎉</div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">Celebración</h3>
              <p className="opacity-90 text-sm md:text-base">Creamos espacios de alegría y autenticidad</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
