
## Plan: Cambios multiples en secciones, base de datos, y panel de administrador

### Resumen de cambios

Este plan abarca 10 areas de cambio: doctores (sobre nosotros), cursos, productos, servicios, galeria/videos, header, contacto, y limpieza de doctores externos.

---

### 1. Sobre Nosotros - Cards centrados y eliminar equipo externo

**Archivo:** `src/components/AboutSection.tsx`
- Cuando hay 1 doctor: mostrar una sola card centrada (max-w limitado, mx-auto)
- Cuando hay 2 doctores: grid de 2 columnas centrado con el mismo gap que cuando son 3
- Cuando hay 3+: mantener el carrusel actual
- Eliminar toda la seccion de "Equipo Medico Externo" (lineas 184-231)
- Eliminar imports de `useExternalDoctors`, `ExternalDoctor`, `Loader2` (si ya no se usa), y todo el estado/logica relacionada con doctores externos (`extCurrentIndex`, `externalDoctors`, etc.)
- Simplificar el tipo `AnyDoctor` a solo `Doctor`

### 2. Eliminar base de datos de doctores externos

**Archivos a eliminar:**
- `src/hooks/useExternalDoctors.ts`
- `src/hooks/useExternalDoctorMutations.ts`
- `src/types/externalDoctor.ts`
- `src/api/doctors.ts`
- `src/api/config.ts`

**Archivos a modificar:**
- `src/pages/AdminPanel.tsx`: Eliminar la pestana "Doctores Ext.", su tabla, modal, handlers, imports y estado relacionado

### 3. Cursos - Agregar campos de visibilidad a proximos cursos

**Migracion de base de datos:**
```sql
ALTER TABLE public.courses
  ADD COLUMN show_date boolean NOT NULL DEFAULT true,
  ADD COLUMN show_duration boolean NOT NULL DEFAULT true,
  ADD COLUMN show_participants boolean NOT NULL DEFAULT true,
  ADD COLUMN show_objectives boolean NOT NULL DEFAULT true,
  ADD COLUMN show_includes boolean NOT NULL DEFAULT true,
  ADD COLUMN show_price boolean NOT NULL DEFAULT true;
```

**Archivos a modificar:**
- `src/types/course.ts`: Agregar campos `showDate`, `showDuration`, `showParticipants`, `showObjectives`, `showIncludes`, `showPrice` a la interfaz `Course`. Eliminar `rating`, `testimonial`, `testimonialAuthor` de `PastCourse`.
- `src/hooks/useCourses.ts`: Mapear los nuevos campos `show_*` en la consulta de cursos. Eliminar mapeo de `rating`, `testimonial`, `testimonialAuthor` en past courses.
- `src/hooks/useCourseMutations.ts`: Incluir los campos `show_*` en insert/update.
- `src/hooks/usePastCourseMutations.ts`: Eliminar `rating`, `testimonial`, `testimonial_author` de insert/update.
- `src/components/CoursesSection.tsx`: Condicionar la visibilidad de fecha, duracion, participantes, precio en el card segun los booleanos. Eliminar rating, testimonial y testimonialAuthor del card de cursos pasados.
- `src/pages/AdminPanel.tsx`:
  - En el modal de curso: agregar 6 switches para `showDate`, `showDuration`, `showParticipants`, `showObjectives`, `showIncludes`, `showPrice`.
  - En el modal de curso pasado: eliminar campos de rating, testimonio y autor del testimonio.
  - En la tabla de cursos pasados: eliminar columna "Rating".
  - En `handleAddCourse`: agregar valores por defecto para los nuevos campos.

### 4. Cursos pasados - Eliminar campos de la base de datos

**Migracion de base de datos:**
```sql
ALTER TABLE public.past_courses
  DROP COLUMN IF EXISTS rating,
  DROP COLUMN IF EXISTS testimonial,
  DROP COLUMN IF EXISTS testimonial_author;
```

**Nota:** Verificar si hay datos existentes en Live antes de ejecutar. Estos campos se eliminaran de la tabla.

### 5. Productos - Ocultar precio y sistema de tallas

**Migracion de base de datos:**
```sql
ALTER TABLE public.products
  ADD COLUMN show_price boolean NOT NULL DEFAULT true,
  ADD COLUMN has_sizes boolean NOT NULL DEFAULT false,
  ADD COLUMN sizes jsonb NOT NULL DEFAULT '[]'::jsonb;
```

El campo `sizes` sera un arreglo JSON con objetos como `[{"name": "S", "inStock": true}, {"name": "M", "inStock": false}, ...]`

**Archivos a modificar:**
- `src/types/product.ts`: Agregar `showPrice`, `hasSizes`, `sizes` (con tipo `ProductSize[]` donde `ProductSize = { name: string; inStock: boolean }`)
- `src/hooks/useProducts.ts`: Mapear los nuevos campos
- `src/hooks/useProductMutations.ts`: Incluir `show_price`, `has_sizes`, `sizes` en insert/update
- `src/components/ProductsSection.tsx`:
  - Condicionar la visibilidad del precio segun `showPrice`
  - Cuando `hasSizes` sea true, mostrar las tallas disponibles como badges en el card (verdes si estan en stock, rojas si no)
- `src/pages/AdminPanel.tsx`:
  - En el modal de producto: agregar switch para `showPrice` y `hasSizes`
  - Cuando `hasSizes` este activo: mostrar input para agregar tallas personalizadas y toggle individual de stock por talla

### 6. Cambiar "Tienda" por "Productos"

**Archivos a modificar:**
- `src/components/Header.tsx`: Cambiar `label: "Tienda"` por `label: "Productos"` y `href: "#store"` por `href: "#products"`
- `src/components/ProductsSection.tsx`: Cambiar `id="store"` por `id="products"` y el titulo "Tienda" por "Productos"

### 7. Servicios - Ocultar precio

**Migracion de base de datos:**
```sql
ALTER TABLE public.services
  ADD COLUMN show_price boolean NOT NULL DEFAULT true;
```

**Archivos a modificar:**
- `src/types/service.ts`: Agregar `showPrice: boolean`
- `src/hooks/useServices.ts`: Mapear `show_price`
- `src/hooks/useServiceMutations.ts`: Incluir `show_price` en insert/update (buscar en `src/hooks/useServiceMutations.ts`)
- `src/components/ServicesSection.tsx`: Condicionar la visibilidad del precio segun `showPrice`
- `src/pages/AdminPanel.tsx`: Agregar switch en el modal de servicios

### 8. Seccion de Videos (bajo Galeria)

**Migracion de base de datos:**
```sql
CREATE TABLE public.videos (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  thumbnail text NOT NULL DEFAULT '',
  youtube_url text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view videos" ON public.videos FOR SELECT USING (true);
CREATE POLICY "Only admins can insert videos" ON public.videos FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Only admins can update videos" ON public.videos FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Only admins can delete videos" ON public.videos FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON public.videos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

**Nuevos archivos:**
- `src/types/video.ts`: Interfaz `Video` con `id`, `title`, `description`, `thumbnail`, `youtubeUrl`
- `src/hooks/useVideos.ts`: Query para obtener videos
- `src/hooks/useVideoMutations.ts`: CRUD mutations

**Archivos a modificar:**
- `src/components/EventsSection.tsx`: Agregar la seccion "Videos" debajo de la galeria de momentos. Solo se muestra el titulo si hay videos. Cada video se muestra como un card con la imagen de thumbnail. Al hacer clic, abre un modal/dialog con el reproductor embebido de YouTube (iframe). Para extraer el ID del video de YouTube, parsear la URL.
- `src/pages/AdminPanel.tsx`: Agregar pestana "Videos" con tabla y modal para CRUD. Los campos seran: titulo, descripcion, thumbnail (image upload al bucket), y URL de YouTube.

### 9. Contactanos - Enviar por WhatsApp

**Archivo:** `src/components/HelpSection.tsx`
- En `handleSubmit`, en lugar de simular un envio, construir un mensaje de WhatsApp con los datos del formulario (nombre, telefono, email, tema, mensaje) y abrir `wa.me/{numero}?text={mensaje}`
- Obtener el numero de WhatsApp desde `useSiteSetting("whatsapp_number")` (el mismo usado en citas)
- Eliminar la simulacion de envio (el `setTimeout`)

### 10. Datos de contacto dinamicos en HelpSection

**Archivo:** `src/components/HelpSection.tsx`
- Usar `useSiteSetting("contact_phone")` y `useSiteSetting("contact_email")` para los enlaces de telefono y email del footer de contacto

---

### Resumen de migraciones de base de datos

Se ejecutaran las siguientes migraciones:
1. Agregar columnas `show_date`, `show_duration`, `show_participants`, `show_objectives`, `show_includes`, `show_price` a `courses`
2. Eliminar columnas `rating`, `testimonial`, `testimonial_author` de `past_courses`
3. Agregar columnas `show_price`, `has_sizes`, `sizes` a `products`
4. Agregar columna `show_price` a `services`
5. Crear tabla `videos` con RLS

### Archivos nuevos
```
src/types/video.ts
src/hooks/useVideos.ts
src/hooks/useVideoMutations.ts
```

### Archivos a eliminar
```
src/hooks/useExternalDoctors.ts
src/hooks/useExternalDoctorMutations.ts
src/types/externalDoctor.ts
src/api/doctors.ts
src/api/config.ts
```

### Archivos a modificar
```
src/components/AboutSection.tsx
src/components/CoursesSection.tsx
src/components/ProductsSection.tsx
src/components/ServicesSection.tsx
src/components/EventsSection.tsx
src/components/HelpSection.tsx
src/components/Header.tsx
src/types/course.ts
src/types/product.ts
src/types/service.ts
src/hooks/useCourses.ts
src/hooks/useCourseMutations.ts
src/hooks/usePastCourseMutations.ts
src/hooks/useProducts.ts
src/hooks/useProductMutations.ts
src/hooks/useServices.ts
src/hooks/useServiceMutations.ts
src/pages/AdminPanel.tsx
```
