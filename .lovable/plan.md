
# Plan de Implementacion: Mejoras Integrales para HASACE

## Resumen

Este plan aborda cinco mejoras principales: sincronizacion de horarios con Google Calendar, optimizacion SEO, refuerzo de seguridad, nueva seccion de Servicios con gestion administrativa, y rediseno del Hero Section.

---

## 1. Sincronizacion de Horarios con Google Calendar

### Descripcion
Integrar la API de Google Calendar para obtener los horarios ocupados y mostrar solo los disponibles en la seccion de citas.

### Pasos Tecnicos

1. **Conectar Google Calendar**
   - Usar el conector de Google Calendar disponible en Lovable
   - Configurar las credenciales OAuth

2. **Crear Edge Function**
   - Nueva funcion `get-available-slots` que:
     - Consulte los eventos del calendario para la fecha seleccionada
     - Calcule los horarios libres (09:00-18:00)
     - Retorne solo los slots disponibles

3. **Actualizar AppointmentSection**
   - Llamar a la edge function cuando el usuario seleccione una fecha
   - Mostrar solo los horarios disponibles
   - Mostrar indicador de carga mientras consulta

---

## 2. Mejoras de SEO

### Descripcion
Implementar mejoras de posicionamiento en buscadores.

### Pasos

1. **Crear Sitemap.xml**
   - Archivo estatico en `/public/sitemap.xml`
   - Incluir todas las rutas principales

2. **Agregar Datos Estructurados (JSON-LD)**
   - Schema de `MedicalBusiness` para la clinica
   - Schema de `LocalBusiness` con direccion y horarios
   - Schema de `Service` para servicios

3. **Mejorar Meta Tags**
   - Agregar mas Open Graph tags
   - Incluir imagen OG personalizada de HASACE (no Lovable)
   - Agregar `theme-color` meta tag

4. **Actualizar robots.txt**
   - Agregar referencia al sitemap
   - Configurar directivas especificas

---

## 3. Mejoras de Seguridad

### Descripcion
Reforzar la seguridad del sitio basado en el escaneo realizado.

### Pasos

1. **Validacion de Inputs**
   - Agregar validacion con Zod en formularios del admin
   - Sanitizar datos antes de enviar a la base de datos

2. **Proteccion XSS**
   - Revisar uso de `dangerouslySetInnerHTML` (no existe actualmente)
   - Asegurar escapado de contenido dinamico

3. **Headers de Seguridad**
   - Agregar Content Security Policy via meta tags
   - Implementar X-Frame-Options

4. **Autenticacion Robusta**
   - Ya implementada con roles de admin
   - Verificar que ProtectedRoute funcione correctamente

---

## 4. Nueva Seccion de Servicios

### Descripcion
Crear una seccion de servicios entre Tienda y Galeria con gestion desde el panel de administrador.

### Estructura de Datos

```text
+-------------------+
|     services      |
+-------------------+
| id (uuid)         |
| name (text)       |
| description (text)|
| image (text)      |
| price (numeric)   |
| discount (numeric)|
| offer_active (bool)|
| offer_description |
| category (text)   |
| created_at        |
| updated_at        |
+-------------------+
```

### Pasos

1. **Crear tabla `services` en la base de datos**
   - Campos: id, name, description, image, price, discount, offer_active, offer_description, category
   - RLS: Lectura publica, escritura solo admins

2. **Crear componentes**
   - `ServicesSection.tsx` - Seccion publica con tarjetas de servicios
   - Mostrar badge "Oferta del Mes" cuando `offer_active = true`
   - Mostrar precio original tachado y precio con descuento

3. **Actualizar Panel de Administrador**
   - Nueva pestana "Servicios"
   - Formulario con: nombre, descripcion, imagen, precio, descuento, toggle de oferta, descripcion de oferta

4. **Crear hooks**
   - `useServices.ts` - Obtener servicios
   - `useServiceMutations.ts` - CRUD de servicios

5. **Actualizar Index.tsx**
   - Insertar ServicesSection entre ProductsSection y EventsSection

---

## 5. Rediseno del Hero Section

### Descripcion
Hacer el Hero mas claro con mejor contraste y colores azul/rojo de la marca.

### Cambios

1. **Reducir opacidad del overlay**
   - Hacer la imagen de fondo mas visible
   - Usar gradiente mas suave

2. **Tipografia**
   - Titulo principal en azul oscuro (#1e3a5f)
   - "Vive sin Limites" en rojo HASACE
   - Mayor contraste con sombra de texto

3. **Estructura Visual**
   ```text
   +--------------------------------+
   |   [Imagen de fondo clara]     |
   |                                |
   |   RECUPERA TU BIENESTAR       |
   |   (texto azul oscuro)         |
   |                                |
   |   VIVE SIN LIMITES            |
   |   (texto rojo HASACE)         |
   |                                |
   |   [Boton Agendar Cita]        |
   +--------------------------------+
   ```

4. **Sincronizar boton con configuracion**
   - Usar URL de Google Calendar desde site_settings
   - Aplicar tecnica anchor para evitar COOP

---

## Orden de Implementacion

| Fase | Tarea | Prioridad |
|------|-------|-----------|
| 1 | Rediseno Hero Section | Alta |
| 2 | Crear tabla services | Alta |
| 3 | Implementar ServicesSection | Alta |
| 4 | Agregar Servicios al admin | Alta |
| 5 | Mejoras SEO (sitemap, JSON-LD) | Media |
| 6 | Mejoras de seguridad | Media |
| 7 | Conectar Google Calendar | Media |
| 8 | Sincronizar horarios disponibles | Media |

---

## Archivos a Crear/Modificar

### Nuevos Archivos
- `src/components/ServicesSection.tsx`
- `src/types/service.ts`
- `src/hooks/useServices.ts`
- `src/hooks/useServiceMutations.ts`
- `public/sitemap.xml`
- `supabase/functions/get-available-slots/index.ts`

### Archivos a Modificar
- `src/components/Hero.tsx` - Rediseno visual
- `src/components/AppointmentSection.tsx` - Sincronizacion de horarios
- `src/pages/AdminPanel.tsx` - Nueva pestana de servicios
- `src/pages/Index.tsx` - Agregar ServicesSection
- `index.html` - SEO y datos estructurados
- `public/robots.txt` - Referencia al sitemap

### Migracion de Base de Datos
- Crear tabla `services` con RLS

