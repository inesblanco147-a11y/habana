

## Plan: Actualizar WhatsApp y agregar notificaciones por email

### Cambio 1: AppointmentSection.tsx - Flujo de WhatsApp y confirmacion

**En `handleSubmit`:**
- Remover el parametro `?text=...` del link de WhatsApp, dejando solo `https://wa.me/[NUMERO]`
- Guardar los detalles de la cita en un nuevo estado para mostrarlos en la pantalla de confirmacion

**En la pantalla de confirmacion (`showConfirmation`):**
- Agregar un boton "Copiar detalles" que copie al portapapeles un mensaje con:
  - Nombre completo del paciente
  - Fecha en formato largo en espanol (ej: "jueves, 20 de febrero de 2026")
  - Hora de la cita
  - Servicio (si fue seleccionado)
- Importar el icono `Copy` de lucide-react
- Usar `navigator.clipboard.writeText()` para copiar
- Mostrar feedback visual al copiar (texto del boton cambia temporalmente a "Copiado")
- Actualizar el texto descriptivo para indicar que pueden pegar los detalles en WhatsApp

### Cambio 2: create-appointment Edge Function - Notificaciones por email

**En la creacion del evento de Google Calendar:**
- Cambiar duracion de 30 minutos a 1 hora
- Cambiar titulo de `"Cita: ..."` a `"Cita - ..."`
- Agregar `attendees: [{ email: "hasace1964@gmail.com" }]` al evento
- Agregar `reminders: { useDefault: false, overrides: [{ method: 'email', minutes: 1440 }] }`
- Agregar `?sendNotifications=true` como query parameter en la URL del POST a Google Calendar API

Esto hara que Google Calendar envie automaticamente un email de notificacion a hasace1964@gmail.com cada vez que se cree una cita, y ademas un recordatorio por email 24 horas antes.

### Seccion tecnica

**Archivos a modificar:**
1. `src/components/AppointmentSection.tsx` - lineas 146-186 (handleSubmit) y 204-241 (confirmacion)
2. `supabase/functions/create-appointment/index.ts` - lineas 134-159 (creacion de evento)

**Estado nuevo en AppointmentSection:**
- `copiedToClipboard: boolean` para feedback del boton copiar

**Google Calendar API:**
- El parametro `sendNotifications=true` en la URL del endpoint hace que Google envie emails a los attendees
- Los reminders con `method: 'email'` y `minutes: 1440` envian recordatorio 24hrs antes

