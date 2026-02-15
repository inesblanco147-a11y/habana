
-- Remove the overly permissive public INSERT policy on appointments.
-- The create-appointment edge function uses the service role key, so it bypasses RLS.
-- No public INSERT policy is needed.
DROP POLICY IF EXISTS "Anyone can insert appointments" ON public.appointments;
