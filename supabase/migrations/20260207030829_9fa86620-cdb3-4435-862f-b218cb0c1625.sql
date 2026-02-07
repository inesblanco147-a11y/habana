
-- 1. Add visibility columns to courses
ALTER TABLE public.courses
  ADD COLUMN show_date boolean NOT NULL DEFAULT true,
  ADD COLUMN show_duration boolean NOT NULL DEFAULT true,
  ADD COLUMN show_participants boolean NOT NULL DEFAULT true,
  ADD COLUMN show_objectives boolean NOT NULL DEFAULT true,
  ADD COLUMN show_includes boolean NOT NULL DEFAULT true,
  ADD COLUMN show_price boolean NOT NULL DEFAULT true;

-- 2. Drop columns from past_courses
ALTER TABLE public.past_courses
  DROP COLUMN IF EXISTS rating,
  DROP COLUMN IF EXISTS testimonial,
  DROP COLUMN IF EXISTS testimonial_author;

-- 3. Add show_price, has_sizes, sizes to products
ALTER TABLE public.products
  ADD COLUMN show_price boolean NOT NULL DEFAULT true,
  ADD COLUMN has_sizes boolean NOT NULL DEFAULT false,
  ADD COLUMN sizes jsonb NOT NULL DEFAULT '[]'::jsonb;

-- 4. Add show_price to services
ALTER TABLE public.services
  ADD COLUMN show_price boolean NOT NULL DEFAULT true;

-- 5. Create videos table
CREATE TABLE public.videos (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  thumbnail text NOT NULL DEFAULT '',
  youtube_url text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view videos" ON public.videos FOR SELECT USING (true);
CREATE POLICY "Only admins can insert videos" ON public.videos FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Only admins can update videos" ON public.videos FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Only admins can delete videos" ON public.videos FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON public.videos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
