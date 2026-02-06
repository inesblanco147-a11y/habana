

## Plan: Correccion integral de estilos, sincronizacion de servicios, gestion de cursos pasados y errores de guardado

### Problemas identificados

1. **CardContent tiene estilos globales incorrectos** - El componente `CardContent` en `src/components/ui/card.tsx` tiene `border-secondary bg-secondary` aplicado globalmente, lo cual afecta todas las tarjetas del sitio con un fondo no deseado
2. **Titulos de seccion inconsistentes** - Cada seccion usa un formato diferente para su titulo (algunas con icono, otras sin el, diferentes clases CSS)
3. **Estilos de tarjetas inconsistentes** - Las tarjetas de diferentes secciones no comparten el mismo estilo visual
4. **Servicios hardcodeados en Citas** - La seccion de citas tiene una lista estatica de servicios en lugar de usar los servicios registrados en la base de datos
5. **Falta gestion de cursos pasados (past_courses) en el admin** - La tabla existe pero no hay CRUD en el panel de administracion
6. **Errores de guardado / sesion colgada** - Las mutaciones no tienen manejo robusto de errores ni timeouts; cuando una peticion falla silenciosamente, la interfaz se queda en estado "guardando"

---

### Cambios propuestos

#### 1. Corregir CardContent global
**Archivo:** `src/components/ui/card.tsx`
- Quitar `border-secondary bg-secondary` de CardContent, dejando solo `p-6 pt-0` (estandar de shadcn)

#### 2. Estandarizar titulos de seccion (formato "Sobre Nosotros")
El formato de referencia es:
```
<h2 class="text-3xl lg:text-4xl mb-4 font-bold uppercase tracking-wide text-destructive">
  Titulo
</h2>
<div class="w-24 h-1 bg-hasace-red mx-auto rounded-full" />
```

**Archivos a modificar:**
- `src/components/ServicesSection.tsx` - Quitar icono circular, aplicar formato estandar
- `src/components/ProductsSection.tsx` - Quitar icono circular, aplicar formato estandar
- `src/components/EventsSection.tsx` - Ajustar al formato estandar
- `src/components/AppointmentSection.tsx` - Quitar icono circular, aplicar formato estandar
- `src/components/HelpSection.tsx` - Quitar icono circular, aplicar formato estandar
- `src/components/CoursesSection.tsx` - Ajustar el hero gradient para incluir el formato estandar

#### 3. Estandarizar estilo de tarjetas (como Cursos)
El estilo de referencia de cursos es:
- `className="border-0 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"`
- Imagen con `h-48 object-cover rounded-t-lg`
- Titulo: `text-lg font-bold`
- Texto: `text-sm text-muted-foreground`

**Archivos a ajustar:**
- `src/components/ServicesSection.tsx` - Agregar `border-0`, efecto hover
- `src/components/ProductsSection.tsx` - Ya tiene el estilo correcto
- `src/components/EventsSection.tsx` - Agregar `border-0`
- `src/components/AboutSection.tsx` - Ajustar cards de doctores

#### 4. Sincronizar servicios en Citas con la base de datos
**Archivo:** `src/components/AppointmentSection.tsx`
- Importar y usar `useServices()` para obtener los servicios dinamicamente
- Reemplazar la lista hardcodeada por los nombres de servicios de la base de datos
- Usar `service.name` como valor y etiqueta del select

#### 5. Agregar CRUD de cursos pasados al admin
**Nuevos archivos:**
- `src/hooks/usePastCourseMutations.ts` - Hooks de create/update/delete para `past_courses`

**Archivo a modificar:**
- `src/pages/AdminPanel.tsx`:
  - Agregar pestana "Cursos Pasados" con tabla y modal de edicion
  - Incluir campos: titulo, descripcion, imagen, modalidad, fecha, participantes, rating, testimonial, autor del testimonial, instructor, galeria de imagenes
  - Reutilizar componentes ImageUpload y MultiImageUpload

#### 6. Corregir errores de guardado y sesion
**Archivos a modificar:**
- `src/hooks/useCourseMutations.ts` - Agregar `onSettled` para invalidar queries siempre (como ya tiene doctorMutations)
- `src/hooks/useProductMutations.ts` - Agregar `onSettled`
- `src/hooks/useEventMutations.ts` - Agregar `onSettled`
- `src/hooks/useServiceMutations.ts` - Agregar `onSettled`
- `src/pages/AdminPanel.tsx`:
  - Agregar `onError` callbacks a todas las llamadas `.mutate()` para cerrar modales incluso cuando hay error
  - Agregar timeout de seguridad: si una mutacion tarda mas de 15 segundos, mostrar error y desbloquear la UI
  - Mejorar `handleSaveSettings` con try/catch robusto
- `src/hooks/useAuth.ts` - Agregar manejo de errores de red en `signOut` para evitar que se quede colgado

---

### Detalles tecnicos

**Correccion de CardContent (card.tsx):**
```typescript
// Antes
className={cn("p-6 pt-0 border-secondary bg-secondary", className)}
// Despues
className={cn("p-6 pt-0", className)}
```

**Servicios dinamicos en AppointmentSection:**
```typescript
import { useServices } from "@/hooks/useServices";
// ...
const { data: servicesFromDB = [] } = useServices();
const services = servicesFromDB.map(s => ({ value: s.name, label: s.name }));
```

**usePastCourseMutations.ts (nuevo):**
- `useCreatePastCourse` - INSERT en `past_courses` con mapeo de campos camelCase a snake_case
- `useUpdatePastCourse` - UPDATE en `past_courses`
- `useDeletePastCourse` - DELETE de `past_courses`
- Todos con `onSettled` para invalidar `["past-courses"]`

**Patron de error robusto en mutaciones:**
```typescript
// En cada handleSave del AdminPanel:
const handleSaveCourse = () => {
  if (!editingCourse) return;
  const closeModal = () => {
    setIsCourseModalOpen(false);
    setEditingCourse(null);
  };
  if (editingCourse.id) {
    updateCourse.mutate(editingCourse, {
      onSuccess: closeModal,
      onError: () => {} // Error ya manejado en hook
    });
  } else {
    const { id, ...data } = editingCourse;
    createCourse.mutate(data, {
      onSuccess: closeModal,
      onError: () => {}
    });
  }
};
```

**Archivos nuevos:**
```
src/hooks/usePastCourseMutations.ts
```

**Archivos a modificar:**
```
src/components/ui/card.tsx
src/components/ServicesSection.tsx
src/components/ProductsSection.tsx
src/components/EventsSection.tsx
src/components/AppointmentSection.tsx
src/components/HelpSection.tsx
src/components/AboutSection.tsx
src/components/CoursesSection.tsx
src/hooks/useCourseMutations.ts
src/hooks/useProductMutations.ts
src/hooks/useEventMutations.ts
src/hooks/useServiceMutations.ts
src/pages/AdminPanel.tsx
```

