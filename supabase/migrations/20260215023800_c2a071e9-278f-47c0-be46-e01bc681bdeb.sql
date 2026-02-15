
-- Add display_order column to services, products, courses, gallery, and doctors tables
ALTER TABLE public.services ADD COLUMN display_order integer NOT NULL DEFAULT 0;
ALTER TABLE public.products ADD COLUMN display_order integer NOT NULL DEFAULT 0;
ALTER TABLE public.courses ADD COLUMN display_order integer NOT NULL DEFAULT 0;
ALTER TABLE public.gallery ADD COLUMN display_order integer NOT NULL DEFAULT 0;
ALTER TABLE public.doctors ADD COLUMN display_order integer NOT NULL DEFAULT 0;

-- Create indexes for efficient ordering
CREATE INDEX idx_services_display_order ON public.services(display_order);
CREATE INDEX idx_products_display_order ON public.products(display_order);
CREATE INDEX idx_courses_display_order ON public.courses(display_order);
CREATE INDEX idx_gallery_display_order ON public.gallery(display_order);
CREATE INDEX idx_doctors_display_order ON public.doctors(display_order);
