-- Enum de roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Tabla de roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Funcion para verificar rol (evita recursividad)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Politicas para user_roles
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- Tabla site_settings
CREATE TABLE public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT DEFAULT '',
  label TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Todos pueden leer settings
CREATE POLICY "Anyone can read settings"
  ON public.site_settings FOR SELECT USING (true);

-- Solo admin puede modificar settings
CREATE POLICY "Admins can insert settings"
  ON public.site_settings FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update settings"
  ON public.site_settings FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete settings"
  ON public.site_settings FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Insertar configuraciones iniciales
INSERT INTO public.site_settings (key, value, label, category) VALUES
  ('whatsapp_number', '', 'Número de WhatsApp', 'contact'),
  ('google_calendar_url', '', 'URL de Google Calendar', 'calendar'),
  ('contact_phone', '+52 442 123 4567', 'Teléfono de contacto', 'contact'),
  ('contact_email', 'contacto@hasace.mx', 'Email de contacto', 'contact');

-- Hacer bucket publico
UPDATE storage.buckets SET public = true WHERE id = 'imgs';

-- Politicas de storage
CREATE POLICY "Public read access for imgs"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'imgs');

CREATE POLICY "Authenticated users can upload to imgs"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'imgs' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update imgs"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'imgs' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete from imgs"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'imgs' AND auth.uid() IS NOT NULL);

-- Trigger para updated_at en site_settings
CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();