
-- Fix 1: Restrict storage to admin-only
DROP POLICY IF EXISTS "Authenticated users can upload to imgs" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update imgs" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete from imgs" ON storage.objects;

CREATE POLICY "Admins can upload to imgs"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'imgs' AND 
    public.has_role(auth.uid(), 'admin'::app_role)
  );

CREATE POLICY "Admins can update imgs"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'imgs' AND 
    public.has_role(auth.uid(), 'admin'::app_role)
  );

CREATE POLICY "Admins can delete from imgs"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'imgs' AND 
    public.has_role(auth.uid(), 'admin'::app_role)
  );

-- Fix 2: Add NULL checks to has_role function
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF _user_id IS NULL OR _role IS NULL THEN
    RETURN FALSE;
  END IF;
  
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
END;
$$;
