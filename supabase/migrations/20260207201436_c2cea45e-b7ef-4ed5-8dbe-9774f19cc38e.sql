
-- Rename youtube_url to video_url to store the storage URL instead
ALTER TABLE public.videos RENAME COLUMN youtube_url TO video_url;
