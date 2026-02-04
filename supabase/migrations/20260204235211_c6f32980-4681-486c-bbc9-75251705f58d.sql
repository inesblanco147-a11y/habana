-- Drop existing permissive policies for INSERT, UPDATE, DELETE on all content tables

-- Doctors table
DROP POLICY IF EXISTS "Authenticated users can insert doctors" ON public.doctors;
DROP POLICY IF EXISTS "Authenticated users can update doctors" ON public.doctors;
DROP POLICY IF EXISTS "Authenticated users can delete doctors" ON public.doctors;

-- Courses table
DROP POLICY IF EXISTS "Authenticated users can insert courses" ON public.courses;
DROP POLICY IF EXISTS "Authenticated users can update courses" ON public.courses;
DROP POLICY IF EXISTS "Authenticated users can delete courses" ON public.courses;

-- Products table
DROP POLICY IF EXISTS "Authenticated users can insert products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can update products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can delete products" ON public.products;

-- Events table
DROP POLICY IF EXISTS "Authenticated users can insert events" ON public.events;
DROP POLICY IF EXISTS "Authenticated users can update events" ON public.events;
DROP POLICY IF EXISTS "Authenticated users can delete events" ON public.events;

-- Past courses table
DROP POLICY IF EXISTS "Authenticated users can insert past courses" ON public.past_courses;
DROP POLICY IF EXISTS "Authenticated users can update past courses" ON public.past_courses;
DROP POLICY IF EXISTS "Authenticated users can delete past courses" ON public.past_courses;

-- Create new admin-only policies for doctors
CREATE POLICY "Only admins can insert doctors"
  ON public.doctors FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update doctors"
  ON public.doctors FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete doctors"
  ON public.doctors FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Create new admin-only policies for courses
CREATE POLICY "Only admins can insert courses"
  ON public.courses FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update courses"
  ON public.courses FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete courses"
  ON public.courses FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Create new admin-only policies for products
CREATE POLICY "Only admins can insert products"
  ON public.products FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update products"
  ON public.products FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete products"
  ON public.products FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Create new admin-only policies for events
CREATE POLICY "Only admins can insert events"
  ON public.events FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update events"
  ON public.events FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete events"
  ON public.events FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Create new admin-only policies for past_courses
CREATE POLICY "Only admins can insert past courses"
  ON public.past_courses FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update past courses"
  ON public.past_courses FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete past courses"
  ON public.past_courses FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));