
-- Eliminar y recrear los tipos enum para asegurar que existan correctamente
DROP TYPE IF EXISTS identity_tag CASCADE;
DROP TYPE IF EXISTS sex_type CASCADE;

-- Crear tipo enum para las etiquetas de identidad
CREATE TYPE identity_tag AS ENUM (
  'lesbiana', 'gay', 'bisexual', 'trans', 'no_binarie', 
  'queer', 'intersex', 'asexual', 'pansexual', 'aliade', 
  'cuir', 'fluido', 'otro'
);

-- Crear tipo enum para sexo
CREATE TYPE sex_type AS ENUM ('masculino', 'femenino', 'intersex', 'prefiero_no_decir');

-- Verificar y actualizar la tabla profiles
DO $$
BEGIN
  -- Verificar si la columna sex existe, si no, crearla
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='sex') THEN
    ALTER TABLE public.profiles ADD COLUMN sex sex_type;
  ELSE
    ALTER TABLE public.profiles ALTER COLUMN sex TYPE sex_type USING sex::text::sex_type;
  END IF;
  
  -- Verificar si la columna identity_tags existe, si no, crearla
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='identity_tags') THEN
    ALTER TABLE public.profiles ADD COLUMN identity_tags identity_tag[] DEFAULT '{}';
  ELSE
    ALTER TABLE public.profiles ALTER COLUMN identity_tags TYPE identity_tag[] USING identity_tags::text[]::identity_tag[];
  END IF;
END $$;

-- Crear tabla de eventos
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  category TEXT NOT NULL CHECK (category IN ('bar', 'picnic', 'charla', 'discoteca', 'otro')),
  max_attendees INTEGER DEFAULT 50,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS en la tabla events
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Política para que todos los usuarios autenticados puedan ver eventos
CREATE POLICY "Los usuarios pueden ver todos los eventos" 
  ON public.events 
  FOR SELECT 
  TO authenticated 
  USING (true);

-- Política para que los usuarios solo puedan crear sus propios eventos
CREATE POLICY "Los usuarios pueden crear eventos" 
  ON public.events 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

-- Política para que los usuarios solo puedan editar sus propios eventos
CREATE POLICY "Los usuarios pueden editar sus propios eventos" 
  ON public.events 
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Política para que los usuarios solo puedan eliminar sus propios eventos
CREATE POLICY "Los usuarios pueden eliminar sus propios eventos" 
  ON public.events 
  FOR DELETE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- Trigger para actualizar updated_at en events
CREATE TRIGGER update_events_updated_at 
  BEFORE UPDATE ON public.events 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Habilitar realtime para eventos
ALTER TABLE public.events REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.events;
