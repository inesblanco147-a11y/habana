
# Plan de Implementacion: Autenticacion, Almacenamiento de Imagenes y Configuraciones

## Resumen

Este plan aborda cuatro objetivos principales:
1. Agregar autenticacion para proteger el panel de administracion
2. Verificar y corregir que todos los componentes usen datos de la base de datos
3. Configurar el bucket de almacenamiento para subir imagenes
4. Preparar la infraestructura para integracion de Google Calendar y WhatsApp

---

## Fase 1: Sistema de Autenticacion con Roles de Administrador

### 1.1 Crear estructura de base de datos para roles

Se creara una tabla segura de roles de usuario siguiendo las mejores practicas:

```text
+------------------+     +-------------------+
|    auth.users    |     |   user_roles      |
+------------------+     +-------------------+
| id (uuid) PK     |<----| user_id (uuid) FK |
| email            |     | role (app_role)   |
| ...              |     | id (uuid) PK      |
+------------------+     +-------------------+
```

- Crear enum `app_role` con valores: `admin`, `user`
- Crear tabla `user_roles` con politicas RLS
- Crear funcion `has_role()` con SECURITY DEFINER para verificar roles sin recursividad

### 1.2 Crear pagina de inicio de sesion

- Crear `/auth` con formulario de login (email/password)
- Usar `supabase.auth.signInWithPassword()`
- Redirigir al admin panel si es exitoso y el usuario es admin

### 1.3 Proteger ruta del admin panel

- Crear hook `useAuth` para manejar estado de autenticacion
- Crear componente `ProtectedRoute` que verifique:
  1. Usuario autenticado
  2. Usuario tiene rol `admin`
- Envolver `/admin` con `ProtectedRoute`
- Redirigir a `/auth` si no esta autenticado

### 1.4 Agregar boton de cerrar sesion

- Agregar boton "Cerrar Sesion" en el header del admin panel
- Implementar `supabase.auth.signOut()`

---

## Fase 2: Verificacion de Uso de Base de Datos

### Hallazgos del analisis:

| Componente | Estado | Accion requerida |
|------------|--------|------------------|
| AboutSection (Doctores) | OK - Usa `useDoctors()` | Ninguna |
| CoursesSection | OK - Usa `useCourses()` y `usePastCourses()` | Ninguna |
| ProductsSection | OK - Usa `useProducts()` | Ninguna |
| EventsSection | Parcial - Galeria superior usa datos estaticos | Actualizar |
| useEvents hook | Tiene fallback a imagenes locales | Remover fallback |

### 2.1 Corregir EventsSection

- Eliminar el array estatico `allGalleryImages`
- La galeria superior ("Galeria de Momentos") debera mostrar imagenes de los eventos de la base de datos
- Usar las imagenes reales almacenadas en cada evento

### 2.2 Actualizar useEvents

- Eliminar imports de imagenes fallback locales
- Si un evento no tiene imagenes, mostrar imagen placeholder generico

---

## Fase 3: Configuracion de Storage para Imagenes

### 3.1 Configurar bucket existente

El bucket `imgs` ya existe pero es **privado**. Se configurara:

- Cambiar bucket a **publico** para que las imagenes sean accesibles desde el frontend
- Crear politicas RLS para el bucket:
  - SELECT: Todos pueden ver imagenes
  - INSERT/UPDATE/DELETE: Solo usuarios autenticados

### 3.2 Crear componente de subida de imagenes

- Crear `ImageUpload.tsx` con:
  - Input de tipo file
  - Preview de imagen antes de subir
  - Barra de progreso durante subida
  - Manejo de errores

### 3.3 Integrar en AdminPanel

Reemplazar los campos de texto URL por el componente de subida en:
- Formulario de Cursos (campo `image`)
- Formulario de Productos (campo `image`)
- Formulario de Eventos (campo `images` - multiple)
- Formulario de Doctores (campo `image`)

### 3.4 Flujo de subida

```text
1. Usuario selecciona archivo
2. Se valida tipo (jpg, png, webp) y tamaño (< 5MB)
3. Se sube a storage.imgs/{entity}/{uuid}.ext
4. Se obtiene URL publica
5. Se guarda URL en campo correspondiente de la tabla
```

---

## Fase 4: Tabla de Configuracion del Sitio

### 4.1 Crear tabla site_settings

Para centralizar configuraciones editables como WhatsApp y Google Calendar:

| Campo | Tipo | Descripcion |
|-------|------|-------------|
| id | uuid | PK |
| key | text | Identificador unico (ej: "whatsapp_number") |
| value | text | Valor de la configuracion |
| label | text | Nombre amigable para mostrar |
| category | text | Categoria (contact, calendar, social) |

### 4.2 Configuraciones iniciales

- `whatsapp_number`: Numero de WhatsApp (inicialmente vacio)
- `google_calendar_url`: URL de Google Calendar (inicialmente vacio)
- `contact_phone`: Telefono de contacto
- `contact_email`: Email de contacto

### 4.3 Seccion de configuracion en Admin Panel

- Agregar nueva pestana "Configuracion" en el admin panel
- Formulario para editar cada configuracion
- Los campos de WhatsApp y Google Calendar mostraran mensaje indicando que se pueden configurar

### 4.4 Actualizar componentes

- `AppointmentSection`: Usar URL de calendar desde configuracion
- `ProductsSection`, `CoursesSection`, `Footer`, `HelpSection`: Usar numero de WhatsApp desde configuracion
- Crear hook `useSiteSettings()` para obtener configuraciones

---

## Fase 5: Preparacion para Integraciones Futuras

### 5.1 WhatsApp

- El numero se guardara en `site_settings` con key `whatsapp_number`
- El admin podra actualizarlo desde la pestana de Configuracion
- Formato esperado: `521234567890` (codigo de pais + numero)

### 5.2 Google Calendar

- El link se guardara en `site_settings` con key `google_calendar_url`
- El admin podra pegarlo desde Google Calendar
- Se usara directamente en el boton "Agendar con Google Calendar"

---

## Archivos a Crear

| Archivo | Proposito |
|---------|-----------|
| `src/pages/Auth.tsx` | Pagina de inicio de sesion |
| `src/hooks/useAuth.ts` | Hook para manejar autenticacion |
| `src/components/ProtectedRoute.tsx` | Componente para rutas protegidas |
| `src/components/ImageUpload.tsx` | Componente reutilizable de subida de imagenes |
| `src/hooks/useSiteSettings.ts` | Hook para configuraciones del sitio |

## Archivos a Modificar

| Archivo | Cambios |
|---------|---------|
| `src/App.tsx` | Agregar ruta `/auth`, proteger `/admin` |
| `src/pages/AdminPanel.tsx` | Agregar boton logout, componentes de upload, pestana configuracion |
| `src/components/EventsSection.tsx` | Usar imagenes de BD en galeria superior |
| `src/hooks/useEvents.ts` | Eliminar fallbacks de imagenes locales |
| `src/components/AppointmentSection.tsx` | Usar URL calendar desde settings |
| `src/components/ProductsSection.tsx` | Usar WhatsApp desde settings |
| `src/components/CoursesSection.tsx` | Usar WhatsApp desde settings |
| `src/components/Footer.tsx` | Usar WhatsApp y telefono desde settings |
| `src/components/HelpSection.tsx` | Usar telefono desde settings |

## Migraciones de Base de Datos

1. Crear tipo enum `app_role`
2. Crear tabla `user_roles` con RLS
3. Crear funcion `has_role()`
4. Crear tabla `site_settings` con RLS
5. Insertar configuraciones iniciales
6. Actualizar bucket `imgs` a publico
7. Crear politicas de storage para `imgs`

---

## Secuencia de Implementacion

1. Ejecutar migraciones de base de datos
2. Crear sistema de autenticacion (Auth page, hooks, protected route)
3. Configurar storage y crear componente de upload
4. Integrar upload en AdminPanel
5. Crear tabla y hook de site_settings
6. Agregar pestana de configuracion en admin
7. Actualizar componentes para usar settings dinamicos
8. Corregir EventsSection para usar datos de BD
9. Probar flujo completo

---

## Seccion Tecnica

### Migracion SQL para roles

```sql
-- Enum de roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Tabla de roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Funcion para verificar rol (evita recursividad)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Politicas
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);
```

### Migracion SQL para site_settings

```sql
CREATE TABLE public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT DEFAULT '',
  label TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Todos pueden leer
CREATE POLICY "Anyone can read settings"
  ON public.site_settings FOR SELECT USING (true);

-- Solo admin puede modificar
CREATE POLICY "Only admins can modify settings"
  ON public.site_settings FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Insertar configuraciones iniciales
INSERT INTO public.site_settings (key, value, label, category) VALUES
  ('whatsapp_number', '', 'Numero de WhatsApp', 'contact'),
  ('google_calendar_url', '', 'URL de Google Calendar', 'calendar'),
  ('contact_phone', '+52 442 123 4567', 'Telefono de contacto', 'contact'),
  ('contact_email', 'contacto@hasace.mx', 'Email de contacto', 'contact');
```

### Configuracion de Storage

```sql
-- Hacer bucket publico
UPDATE storage.buckets SET public = true WHERE id = 'imgs';

-- Politicas de storage
CREATE POLICY "Public read access"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'imgs');

CREATE POLICY "Authenticated users can upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'imgs' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'imgs' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'imgs' AND auth.uid() IS NOT NULL);
```
