

## Plan: Popup de servicios, visibilidad de ubicacion en cursos, visibilidad de fecha/ubicacion en eventos, y fix del reproductor de videos

### 1. Popup de detalle de servicio con boton de WhatsApp

**Archivo:** `src/components/ServicesSection.tsx`

- Agregar estado para `selectedService` y `isModalOpen` (igual que en ProductsSection)
- Hacer las cards clickeables para abrir el modal con la informacion del servicio
- El modal mostrara: imagen, categoria, nombre, descripcion completa, oferta (si aplica), precio (si `showPrice`), y un boton de WhatsApp
- El boton de WhatsApp usara el mismo numero configurado en site_settings (`whatsapp_number`) via `useSiteSetting`
- Formato del boton igual al de productos: fondo rojo, icono de MessageCircle, texto "Consultar por WhatsApp"
- Importar `useState` de React, `Dialog/DialogContent/DialogHeader/DialogTitle/DialogDescription` de UI, `MessageCircle` de lucide, `Button` de UI, y `useSiteSetting` del hook

### 2. Cursos - Ocultar campo de ubicacion

**Migracion de base de datos:**
```sql
ALTER TABLE public.courses ADD COLUMN show_location boolean NOT NULL DEFAULT true;
```

**Archivos a modificar:**
- `src/types/course.ts`: Agregar `showLocation: boolean` a la interfaz `Course`
- `src/hooks/useCourses.ts`: Mapear `show_location` a `showLocation`
- `src/hooks/useCourseMutations.ts`: Incluir `show_location` en insert/update
- `src/components/CoursesSection.tsx`: Condicionar la ubicacion en el card (linea 145-148) y en el modal (linea 246-249) con `course.showLocation`
- `src/pages/AdminPanel.tsx`:
  - Agregar `showLocation: true` al `handleAddCourse` (linea 145)
  - Agregar un Switch para `showLocation` en el modal de curso

### 3. Eventos - Ocultar fecha y ubicacion en el card

**Migracion de base de datos:**
```sql
ALTER TABLE public.events
  ADD COLUMN show_date boolean NOT NULL DEFAULT true,
  ADD COLUMN show_location boolean NOT NULL DEFAULT true;
```

**Archivos a modificar:**
- `src/types/event.ts`: Agregar `showDate?: boolean` y `showLocation?: boolean`
- `src/hooks/useEvents.ts`: Mapear `show_date` y `show_location`
- `src/hooks/useEventMutations.ts`: Incluir `show_date` y `show_location` en insert/update
- `src/components/EventsSection.tsx`: Condicionar la fecha (lineas 110-115) y ubicacion (lineas 116-119) con `event.showDate` y `event.showLocation`
- `src/pages/AdminPanel.tsx`:
  - Agregar `showDate: true, showLocation: true` al `handleAddEvent` (linea 170)
  - Agregar dos Switches en el modal de evento (linea 650): "Mostrar Fecha" y "Mostrar Ubicacion"

### 4. Fix del reproductor de videos

**Archivo:** `src/components/EventsSection.tsx`

El modal de video (lineas 242-263) tiene la estructura correcta pero puede fallar por:
- Falta de `DialogDescription` (causa warning de accesibilidad que puede interferir en algunos navegadores)
- El iframe necesita un borde explicito de 0

Cambios:
- Agregar `DialogDescription` con texto descriptivo debajo del `DialogTitle`
- Agregar `border="0"` y `style={{ border: 0 }}` al iframe
- Asegurar que el contenido del modal solo se renderice cuando `selectedVideo` Y `getYoutubeId(selectedVideo.youtubeUrl)` no sean null, para evitar iframes con src invalido
- Usar key en el Dialog basado en el video ID para forzar re-render del iframe al cambiar de video

---

### Resumen de migracion

```sql
ALTER TABLE public.courses ADD COLUMN show_location boolean NOT NULL DEFAULT true;
ALTER TABLE public.events
  ADD COLUMN show_date boolean NOT NULL DEFAULT true,
  ADD COLUMN show_location boolean NOT NULL DEFAULT true;
```

### Archivos a modificar
- `src/components/ServicesSection.tsx` (popup + WhatsApp)
- `src/components/CoursesSection.tsx` (condicionar ubicacion)
- `src/components/EventsSection.tsx` (condicionar fecha/ubicacion en cards + fix video)
- `src/types/course.ts` (agregar showLocation)
- `src/types/event.ts` (agregar showDate, showLocation)
- `src/hooks/useCourses.ts` (mapear show_location)
- `src/hooks/useCourseMutations.ts` (incluir show_location)
- `src/hooks/useEvents.ts` (mapear show_date, show_location)
- `src/hooks/useEventMutations.ts` (incluir show_date, show_location)
- `src/pages/AdminPanel.tsx` (switches nuevos en modales de curso y evento)

