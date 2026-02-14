

## Plan: Corregir horas desfasadas y notificaciones por email

### Problema 1: Horas incorrectas en get-available-slots

**Causa raiz**: La API de Google Calendar devuelve las horas en formato UTC (ej: `2026-02-14T16:00:00Z` para una cita a las 10:00 en Mexico). La regex extrae `16` en lugar de `10`.

**Solucion**: Agregar el parametro `timeZone=America/Mexico_City` a la consulta de Google Calendar API. Esto fuerza a la API a devolver los horarios en la zona horaria local, asi la regex extraera correctamente `10` de `2026-02-14T10:00:00-06:00`.

**Archivo**: `supabase/functions/get-available-slots/index.ts`
- Agregar `&timeZone=${encodeURIComponent('America/Mexico_City')}` a la URL de consulta del calendario (linea 97-101)

### Problema 2: No se envian notificaciones por email

**Causa raiz**: El parametro `sendNotifications=true` esta deprecado en Google Calendar API v3. El parametro correcto es `sendUpdates=all`.

**Solucion**: Cambiar el query parameter en la URL del POST al crear eventos.

**Archivo**: `supabase/functions/create-appointment/index.ts`
- Cambiar `?sendNotifications=true` por `?sendUpdates=all` en la URL del endpoint (linea 151)

### Seccion tecnica

**get-available-slots** - Linea 97-101, agregar timeZone al calendarUrl:
```
const calendarUrl = `...&timeZone=${encodeURIComponent('America/Mexico_City')}`;
```

**create-appointment** - Linea 151, cambiar parametro:
```
`${GOOGLE_CALENDAR_API}/calendars/primary/events?sendUpdates=all`
```

Ambos cambios requieren redespliegue de las edge functions.

