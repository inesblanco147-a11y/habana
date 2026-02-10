

# Plan: Integrar Google Calendar con Sistema de Citas

## Resumen

Se mejorara el sistema de citas existente para que:
- El formulario de citas recoja datos del paciente (nombre, telefono, email)
- Al agendar, se cree un evento en Google Calendar automaticamente
- La disponibilidad se lea en tiempo real desde Google Calendar (ya existe parcialmente)
- Se abra WhatsApp con un mensaje de confirmacion pre-llenado
- El panel admin tenga una pestana para ver las citas agendadas
- Se guarden las citas en la base de datos local

Antes de implementar, se actualizaran las credenciales de Google Calendar.

---

## Paso 1: Actualizar Credenciales de Google Calendar

Se te pedira ingresar los nuevos valores para:
- `GOOGLE_CALENDAR_CLIENT_ID`
- `GOOGLE_CALENDAR_CLIENT_SECRET`
- `GOOGLE_CALENDAR_REFRESH_TOKEN`

**Nota importante**: Si tu proyecto de Google Cloud esta en modo "Testing", el Refresh Token expira cada 7 dias. Para que sea permanente, debes publicar la app en Google Cloud Console.

---

## Paso 2: Crear tabla `appointments` en la base de datos

Nueva tabla para almacenar las citas agendadas:

| Campo | Tipo | Descripcion |
|-------|------|-------------|
| id | uuid | Identificador unico |
| first_name | text | Nombre del paciente |
| last_name | text | Apellidos del paciente |
| phone | text | Telefono formato +52... |
| email | text | Correo electronico |
| date | date | Fecha de la cita |
| time | text | Hora (ej. "10:00") |
| service | text | Tipo de servicio |
| notes | text | Notas adicionales (opcional) |
| google_event_id | text | ID del evento en Google Calendar |
| status | text | "confirmed", "cancelled" |
| created_at | timestamptz | Fecha de creacion |

Politicas RLS: lectura publica solo de disponibilidad, insercion publica (para que visitantes agenden), edicion/eliminacion solo admin.

---

## Paso 3: Nueva Edge Function `create-appointment`

Funcion backend que:
1. Valida los datos del formulario (nombre, telefono, email, fecha, hora)
2. Verifica que el horario siga disponible consultando Google Calendar
3. Crea un evento en Google Calendar con los datos del paciente
4. Guarda la cita en la tabla `appointments`
5. Retorna confirmacion con el ID del evento

---

## Paso 4: Mejorar Edge Function `get-available-slots`

- Ademas de leer eventos de Google Calendar, tambien consultar la tabla `appointments` local para combinar ambas fuentes de ocupacion
- Corregir el bug actual donde se hace doble llamada (supabase.functions.invoke + fetch directo)

---

## Paso 5: Redisenar `AppointmentSection.tsx`

El formulario actual se expandira para incluir:

**Lado izquierdo** (calendario - se mantiene igual):
- Selector de fecha con calendario visual
- Los dias sin disponibilidad se muestran deshabilitados

**Lado derecho** (formulario mejorado):
- Selector de servicio (del listado actual de servicios)
- Grid de horarios disponibles
- Campos de paciente:
  - Nombre (obligatorio)
  - Apellidos (obligatorio)
  - Telefono con formato MX (obligatorio, validacion +52)
  - Email (obligatorio, validacion formato)
  - Notas adicionales (opcional)
- Resumen de la cita
- Boton "Confirmar Cita" que:
  1. Llama a `create-appointment` (crea en Google Calendar + DB)
  2. Muestra confirmacion visual
  3. Abre WhatsApp con mensaje pre-llenado incluyendo los datos de la cita

---

## Paso 6: Panel Admin - Pestana "Citas"

Nueva pestana en el panel de administracion para:
- Ver listado de todas las citas (nombre, fecha, hora, servicio, telefono, email, estado)
- Cambiar estado de citas (confirmar / cancelar)
- Al cancelar, eliminar el evento de Google Calendar
- Filtrar por fecha o estado

---

## Detalles Tecnicos

### Archivos a crear:
- `supabase/functions/create-appointment/index.ts` - Edge function para crear citas
- `src/hooks/useAppointments.ts` - Hook para consultar citas
- `src/hooks/useAppointmentMutations.ts` - Hook para crear/cancelar citas
- `src/types/appointment.ts` - Tipos TypeScript

### Archivos a modificar:
- `supabase/functions/get-available-slots/index.ts` - Combinar Google Calendar + DB local
- `src/components/AppointmentSection.tsx` - Formulario completo con datos de paciente
- `src/pages/AdminPanel.tsx` - Agregar pestana de citas
- `supabase/config.toml` - Registrar nueva edge function

### Validaciones de seguridad:
- Validacion de email con regex en frontend y backend
- Validacion de telefono mexicano (+52, 10 digitos) en ambos lados
- Sanitizacion de inputs con zod en la edge function
- Rate limiting basico (maximo de citas por IP por hora no es posible sin infraestructura adicional, pero se valida doble reserva del mismo horario)
- Verificacion de disponibilidad atomica en el backend antes de crear

