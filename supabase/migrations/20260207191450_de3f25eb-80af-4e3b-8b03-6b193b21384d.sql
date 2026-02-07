ALTER TABLE public.courses ADD COLUMN show_location boolean NOT NULL DEFAULT true;
ALTER TABLE public.events
  ADD COLUMN show_date boolean NOT NULL DEFAULT true,
  ADD COLUMN show_location boolean NOT NULL DEFAULT true;