
# Plan: Agregar Servicios al Header y Sincronizar Horarios

## Resumen

Este plan implementa tres cambios principales:
1. Agregar enlace "Servicios" en el menú de navegación
2. Verificar que ServicesSection muestre correctamente los datos de la base de datos
3. Crear Edge Function para sincronizar horarios disponibles con Google Calendar

---

## 1. Actualizar Header con Enlace a Servicios

### Archivo: `src/components/Header.tsx`

**Cambio:** Agregar "Servicios" entre "Tienda" y "Galería" en el array `menuItems`

```text
Orden actual:
- Inicio
- Sobre nosotros
- Cursos
- Tienda
- Galeria
- Cita
- Contáctanos

Nuevo orden:
- Inicio
- Sobre nosotros
- Cursos
- Tienda
- Servicios  <-- NUEVO
- Galeria
- Cita
- Contáctanos
```

---

## 2. ServicesSection (Ya Implementado)

El componente `ServicesSection.tsx` ya existe y está correctamente conectado a la base de datos:

- Usa el hook `useServices()` para obtener datos de la tabla `services`
- Muestra cards con imagen, nombre, descripción, categoría, precio
- Incluye badges de "Oferta del Mes" y descuentos
- Está ubicado correctamente en Index.tsx entre ProductsSection y EventsSection

**No requiere cambios adicionales.**

---

## 3. Sincronización de Horarios con Google Calendar

### 3.1 Crear Edge Function

**Archivo:** `supabase/functions/get-available-slots/index.ts`

Esta función consultará los eventos del calendario y calculará los horarios libres.

**Lógica:**
1. Recibe la fecha seleccionada como parámetro
2. Consulta eventos de Google Calendar para esa fecha
3. Define slots base (09:00 - 18:00, intervalos de 30 min)
4. Filtra los slots que coinciden con eventos existentes
5. Retorna solo los slots disponibles

**Nota sobre Google Calendar:** La integración usará la API de Google Calendar a través del gateway. Si el conector no está vinculado, la función retornará todos los slots disponibles como fallback.

### 3.2 Configurar Edge Function

**Archivo:** `supabase/config.toml`

```toml
[functions.get-available-slots]
verify_jwt = false
```

### 3.3 Actualizar AppointmentSection

**Archivo:** `src/components/AppointmentSection.tsx`

**Cambios:**
- Agregar estado para horarios disponibles (`availableSlots`)
- Agregar estado de carga (`isLoadingSlots`)
- Llamar a la edge function cuando se seleccione una fecha
- Mostrar indicador de carga mientras consulta
- Renderizar solo los horarios disponibles
- Mostrar mensaje cuando no hay disponibilidad

**Flujo de usuario:**
```text
1. Usuario abre sección de citas
   → Horarios ocultos hasta seleccionar fecha

2. Usuario selecciona fecha en calendario
   → Muestra "Cargando horarios..."
   → Llama a edge function

3. Edge function consulta Google Calendar
   → Calcula slots libres
   → Retorna horarios disponibles

4. UI actualiza con slots disponibles
   → Solo muestra horarios libres
   → O mensaje "Sin disponibilidad"
```

---

## Archivos a Crear

| Archivo | Descripción |
|---------|-------------|
| `supabase/functions/get-available-slots/index.ts` | Edge function para consultar disponibilidad |

## Archivos a Modificar

| Archivo | Cambios |
|---------|---------|
| `src/components/Header.tsx` | Agregar "Servicios" al menú |
| `src/components/AppointmentSection.tsx` | Carga dinámica de horarios |
| `supabase/config.toml` | Configuración de la nueva función |

---

## Consideraciones Técnicas

### Edge Function - Fallback sin Google Calendar
Si el conector de Google Calendar no está configurado, la función retornará todos los slots del horario base (09:00-18:00) para que la aplicación siga funcionando.

### CORS Headers
La edge function incluirá headers CORS apropiados para permitir llamadas desde el frontend.

### Manejo de Errores
- Si falla la consulta a Google Calendar: retorna slots por defecto
- Si la fecha es inválida: retorna error 400
- Logs de errores para debugging
