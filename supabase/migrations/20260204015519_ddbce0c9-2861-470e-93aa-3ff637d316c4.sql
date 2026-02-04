-- Create events table
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date TEXT NOT NULL,
  location TEXT NOT NULL,
  images TEXT[] NOT NULL DEFAULT '{}',
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create courses table
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT DEFAULT '',
  modality TEXT NOT NULL CHECK (modality IN ('presencial', 'online', 'hibrido')),
  availability TEXT NOT NULL CHECK (availability IN ('disponible', 'ultimos-lugares', 'agotado')),
  date TEXT NOT NULL,
  duration TEXT NOT NULL,
  location TEXT NOT NULL,
  price NUMERIC NOT NULL,
  instructor TEXT NOT NULL,
  objectives TEXT[] NOT NULL DEFAULT '{}',
  includes TEXT[] NOT NULL DEFAULT '{}',
  max_participants INTEGER NOT NULL,
  current_participants INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create past_courses table
CREATE TABLE public.past_courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT DEFAULT '',
  modality TEXT NOT NULL CHECK (modality IN ('presencial', 'online', 'hibrido')),
  date TEXT NOT NULL,
  participants INTEGER NOT NULL,
  rating NUMERIC NOT NULL,
  testimonial TEXT NOT NULL,
  testimonial_author TEXT NOT NULL,
  instructor TEXT NOT NULL,
  gallery_images TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC NOT NULL,
  image TEXT DEFAULT '',
  category TEXT NOT NULL,
  in_stock BOOLEAN NOT NULL DEFAULT true,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create doctors table
CREATE TABLE public.doctors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  specialty TEXT NOT NULL,
  summary TEXT NOT NULL,
  experience TEXT NOT NULL,
  education TEXT[] NOT NULL DEFAULT '{}',
  certifications TEXT[] NOT NULL DEFAULT '{}',
  image TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.past_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (everyone can view)
CREATE POLICY "Anyone can view events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Anyone can view courses" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Anyone can view past courses" ON public.past_courses FOR SELECT USING (true);
CREATE POLICY "Anyone can view products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Anyone can view doctors" ON public.doctors FOR SELECT USING (true);

-- Create policies for authenticated users to manage content (temporary - should be admin only later)
CREATE POLICY "Authenticated users can insert events" ON public.events FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update events" ON public.events FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can delete events" ON public.events FOR DELETE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert courses" ON public.courses FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update courses" ON public.courses FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can delete courses" ON public.courses FOR DELETE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert past courses" ON public.past_courses FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update past courses" ON public.past_courses FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can delete past courses" ON public.past_courses FOR DELETE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert products" ON public.products FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update products" ON public.products FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can delete products" ON public.products FOR DELETE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert doctors" ON public.doctors FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update doctors" ON public.doctors FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can delete doctors" ON public.doctors FOR DELETE USING (auth.uid() IS NOT NULL);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_past_courses_updated_at BEFORE UPDATE ON public.past_courses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_doctors_updated_at BEFORE UPDATE ON public.doctors FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();