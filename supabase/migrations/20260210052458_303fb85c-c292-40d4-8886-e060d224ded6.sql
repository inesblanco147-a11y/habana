
-- Create appointments table
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  service TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  google_event_id TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'confirmed',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Anyone can view appointments (needed for slot availability check)
CREATE POLICY "Anyone can view appointments"
ON public.appointments FOR SELECT
USING (true);

-- Anyone can insert appointments (visitors booking)
CREATE POLICY "Anyone can insert appointments"
ON public.appointments FOR INSERT
WITH CHECK (true);

-- Only admins can update
CREATE POLICY "Only admins can update appointments"
ON public.appointments FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete
CREATE POLICY "Only admins can delete appointments"
ON public.appointments FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_appointments_updated_at
BEFORE UPDATE ON public.appointments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Unique constraint to prevent double bookings
CREATE UNIQUE INDEX idx_appointments_date_time ON public.appointments (date, time) WHERE status = 'confirmed';
