
-- Crear tipo enum para las etiquetas de identidad
CREATE TYPE identity_tag AS ENUM (
  'lesbiana', 'gay', 'bisexual', 'trans', 'no_binarie', 
  'queer', 'intersex', 'asexual', 'pansexual', 'aliade', 
  'cuir', 'fluido', 'otro'
);

-- Crear tipo enum para sexo
CREATE TYPE sex_type AS ENUM ('masculino', 'femenino', 'intersex', 'prefiero_no_decir');

-- Crear tabla de perfiles de usuario
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  age INTEGER,
  sex sex_type,
  pronouns TEXT,
  bio TEXT,
  avatar_url TEXT,
  instagram_username TEXT,
  identity_tags identity_tag[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Habilitar RLS en la tabla profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Política para que los usuarios puedan ver todos los perfiles (comunidad pública)
CREATE POLICY "Los usuarios pueden ver todos los perfiles" 
  ON public.profiles 
  FOR SELECT 
  TO authenticated 
  USING (true);

-- Política para que los usuarios solo puedan editar su propio perfil
CREATE POLICY "Los usuarios pueden editar su propio perfil" 
  ON public.profiles 
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Política para insertar perfil (solo el propio)
CREATE POLICY "Los usuarios pueden crear su propio perfil" 
  ON public.profiles 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = id);

-- Función para manejar nuevos usuarios y crear perfil automáticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    username, 
    first_name, 
    last_name, 
    age,
    sex
  )
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data ->> 'username', 'user_' || SUBSTRING(new.id::text, 1, 8)),
    COALESCE(new.raw_user_meta_data ->> 'first_name', ''),
    COALESCE(new.raw_user_meta_data ->> 'last_name', ''),
    CASE 
      WHEN new.raw_user_meta_data ->> 'age' ~ '^[0-9]+$' 
      THEN (new.raw_user_meta_data ->> 'age')::integer 
      ELSE NULL 
    END,
    CASE 
      WHEN new.raw_user_meta_data ->> 'sex' IN ('masculino', 'femenino', 'intersex', 'prefiero_no_decir')
      THEN (new.raw_user_meta_data ->> 'sex')::sex_type
      ELSE NULL
    END
  );
  RETURN new;
END;
$$;

-- Trigger para crear perfil automáticamente cuando se registra un usuario
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at en profiles
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON public.profiles 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
