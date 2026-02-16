
-- Add display_order column to past_courses
ALTER TABLE public.past_courses ADD COLUMN IF NOT EXISTS display_order integer NOT NULL DEFAULT 0;
CREATE INDEX IF NOT EXISTS idx_past_courses_display_order ON public.past_courses(display_order);
