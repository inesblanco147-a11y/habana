
CREATE TABLE public.gallery (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  images text[] NOT NULL DEFAULT '{}'::text[],
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view gallery" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "Only admins can insert gallery" ON public.gallery FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Only admins can update gallery" ON public.gallery FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Only admins can delete gallery" ON public.gallery FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_gallery_updated_at BEFORE UPDATE ON public.gallery FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
