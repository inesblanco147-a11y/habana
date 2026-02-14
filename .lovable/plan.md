

## Plan: Enviar notificaciones por email usando Gmail API

### Problema

Google Calendar no envia emails de invitacion al organizador del calendario (la misma cuenta que crea el evento). Por eso hasace1964@gmail.com nunca recibe notificacion aunque `sendUpdates=all` este configurado correctamente.

### Solucion

Agregar envio directo de email usando la Gmail API con las mismas credenciales OAuth que ya existen. Despues de crear el evento en Google Calendar, la funcion enviara un email a hasace1964@gmail.com con los detalles de la cita.

### Requisito previo importante

El refresh token actual probablemente solo tiene permiso para Google Calendar. Para usar Gmail API, necesitas re-autorizar la aplicacion agregando el scope `https://www.googleapis.com/auth/gmail.send`. Esto se hace una sola vez:

1. Ir a la consola de Google Cloud (console.cloud.google.com)
2. En APIs & Services, habilitar la Gmail API
3. Generar un nuevo refresh token que incluya ambos scopes: `calendar` y `gmail.send`
4. Actualizar el secret `GOOGLE_CALENDAR_REFRESH_TOKEN` con el nuevo token

### Cambios tecnicos

**Archivo**: `supabase/functions/create-appointment/index.ts`

1. Agregar constante `GMAIL_API = 'https://gmail.googleapis.com/gmail/v1'`

2. Crear funcion `sendEmailNotification()` que:
   - Construya un email en formato MIME con los detalles de la cita (nombre, fecha, hora, servicio, telefono, notas)
   - Codifique el email en base64url
   - Envie via `POST https://gmail.googleapis.com/gmail/v1/users/me/messages/send` usando el mismo access token
   - El email sera enviado desde y hacia hasace1964@gmail.com (auto-envio)

3. Llamar `sendEmailNotification()` despues de crear el evento en Google Calendar, sin bloquear la respuesta al usuario (si falla el email, la cita se guarda igual)

4. El email incluira:
   - Asunto: "Nueva Cita - [Nombre del paciente]"
   - Cuerpo: Fecha, hora, servicio, telefono, email y notas del paciente

### Estructura del email MIME

```
From: hasace1964@gmail.com
To: hasace1964@gmail.com
Subject: Nueva Cita - [Nombre]
Content-Type: text/html; charset=utf-8

[HTML con detalles de la cita]
```

### Notas

- Se mantiene `sendUpdates=all` en Google Calendar por si en el futuro se agregan attendees externos
- El envio de email es independiente del evento de Google Calendar: si uno falla, el otro funciona
- No se necesitan nuevos secrets, se reutilizan los mismos OAuth credentials
