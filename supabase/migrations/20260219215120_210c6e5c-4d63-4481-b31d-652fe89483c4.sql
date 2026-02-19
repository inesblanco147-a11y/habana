
-- Add new columns to products table for multi-image support and specifications
ALTER TABLE public.products 
  ADD COLUMN IF NOT EXISTS images text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS main_image_index integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS specifications jsonb NOT NULL DEFAULT '{}';

-- Migrate existing single image to images array where applicable
UPDATE public.products 
SET images = ARRAY[image] 
WHERE image IS NOT NULL AND image != '' AND (images IS NULL OR array_length(images, 1) IS NULL);
