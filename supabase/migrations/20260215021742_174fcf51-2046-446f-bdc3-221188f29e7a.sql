
-- Remove the overly permissive public SELECT policy on appointments
DROP POLICY IF EXISTS "Anyone can view appointments" ON public.appointments;

-- Replace with admin-only SELECT policy
CREATE POLICY "Only admins can view appointments"
ON public.appointments FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));
