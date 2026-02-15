import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const GOOGLE_CALENDAR_API = 'https://www.googleapis.com/calendar/v3';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GMAIL_API = 'https://gmail.googleapis.com/gmail/v1';
const ADMIN_EMAIL = 'hasace1964@gmail.com';

async function getAccessToken(): Promise<string | null> {
  const clientId = Deno.env.get('GOOGLE_CALENDAR_CLIENT_ID');
  const clientSecret = Deno.env.get('GOOGLE_CALENDAR_CLIENT_SECRET');
  const refreshToken = Deno.env.get('GOOGLE_CALENDAR_REFRESH_TOKEN');

  if (!clientId || !clientSecret || !refreshToken) return null;

  try {
    const response = await fetch(GOOGLE_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      console.error('Token refresh failed:', await response.text());
      return null;
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
}

function base64url(str: string): string {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  let binary = '';
  for (const byte of data) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function sendEmailNotification(
  accessToken: string,
  data: { firstName: string; lastName: string; phone: string; email: string; date: string; time: string; service: string; notes: string }
): Promise<void> {
  const { firstName, lastName, phone, email, date, time, service, notes } = data;

  const subject = `Nueva Cita - ${firstName} ${lastName}`;
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Nueva Cita Agendada</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Paciente</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${firstName} ${lastName}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Fecha</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${date}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Hora</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${time}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Servicio</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${service || 'No especificado'}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Teléfono</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${phone}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Email</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${email}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold;">Notas</td><td style="padding: 8px;">${notes || 'Sin notas'}</td></tr>
      </table>
    </div>
  `;

  const mimeMessage = [
    `From: ${ADMIN_EMAIL}`,
    `To: ${ADMIN_EMAIL}`,
    `Subject: ${subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=utf-8',
    '',
    htmlBody,
  ].join('\r\n');

  const encodedMessage = base64url(mimeMessage);

  const response = await fetch(`${GMAIL_API}/users/me/messages/send`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw: encodedMessage }),
  });

  if (response.ok) {
    console.log('Email notification sent successfully');
  } else {
    console.error('Failed to send email:', await response.text());
  }
}

function validateInput(body: Record<string, unknown>): { valid: boolean; error?: string; data?: Record<string, string> } {
  const firstName = String(body.firstName || '').trim();
  const lastName = String(body.lastName || '').trim();
  const phone = String(body.phone || '').trim();
  const email = String(body.email || '').trim();
  const date = String(body.date || '').trim();
  const time = String(body.time || '').trim();
  const service = String(body.service || '').trim();
  const notes = String(body.notes || '').trim().slice(0, 500);

  if (!firstName || firstName.length > 100) return { valid: false, error: 'Nombre inválido' };
  if (!lastName || lastName.length > 100) return { valid: false, error: 'Apellidos inválidos' };

  // Phone: Mexican format, digits only after optional +52
  const phoneClean = phone.replace(/[\s\-\(\)]/g, '');
  const phoneRegex = /^(\+?52)?[1-9]\d{9}$/;
  if (!phoneRegex.test(phoneClean)) return { valid: false, error: 'Teléfono inválido. Formato: +52XXXXXXXXXX' };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email) || email.length > 255) return { valid: false, error: 'Email inválido' };

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) return { valid: false, error: 'Fecha inválida' };

  const timeRegex = /^\d{2}:\d{2}$/;
  if (!timeRegex.test(time)) return { valid: false, error: 'Hora inválida' };

  // Validate date is not in the past
  const appointmentDate = new Date(date + 'T00:00:00Z');
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  if (appointmentDate < now) return { valid: false, error: 'No se puede agendar en fechas pasadas' };

  return {
    valid: true,
    data: { firstName, lastName, phone: phoneClean, email, date, time, service, notes }
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();
    const validation = validateInput(body);

    if (!validation.valid) {
      return new Response(
        JSON.stringify({ error: validation.error }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { firstName, lastName, phone, email, date, time, service, notes } = validation.data!;

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if slot is already taken in DB
    const { data: existing } = await supabase
      .from('appointments')
      .select('id')
      .eq('date', date)
      .eq('time', time)
      .eq('status', 'confirmed')
      .maybeSingle();

    if (existing) {
      return new Response(
        JSON.stringify({ error: 'Este horario ya no está disponible' }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Google Calendar event
    let googleEventId = '';
    const accessToken = await getAccessToken();

    if (accessToken) {
      try {
        const startDateTime = `${date}T${time}:00`;
        const [hours, minutes] = time.split(':').map(Number);
        const endHours = hours + 1;
        const endTime = `${String(endHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
        const endDateTime = `${date}T${endTime}:00`;

        const calendarEvent = {
          summary: `Cita - ${firstName} ${lastName}`,
          description: `Paciente: ${firstName} ${lastName}\nTeléfono: ${phone}\nEmail: ${email}\nServicio: ${service || 'No especificado'}\nNotas: ${notes || 'Sin notas'}`,
          start: { dateTime: startDateTime, timeZone: 'America/Mexico_City' },
          end: { dateTime: endDateTime, timeZone: 'America/Mexico_City' },
          attendees: [{ email: 'hasace1964@gmail.com' }],
          reminders: { useDefault: false, overrides: [{ method: 'email', minutes: 1440 }] },
        };

        const calResponse = await fetch(
          `${GOOGLE_CALENDAR_API}/calendars/primary/events?sendUpdates=all`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(calendarEvent),
          }
        );

        if (calResponse.ok) {
          const calData = await calResponse.json();
          googleEventId = calData.id || '';
          console.log('Google Calendar event created:', googleEventId);
        } else {
          console.error('Failed to create calendar event:', await calResponse.text());
        }
      } catch (error) {
        console.error('Error creating calendar event:', error);
      }
    }

    // Send email notification (non-blocking)
    if (accessToken) {
      try {
        await sendEmailNotification(accessToken, { firstName, lastName, phone, email, date, time, service, notes });
      } catch (error) {
        console.error('Error sending email notification:', error);
      }
    }

    // Save to database
    const { data: appointment, error: dbError } = await supabase
      .from('appointments')
      .insert({
        first_name: firstName,
        last_name: lastName,
        phone,
        email,
        date,
        time,
        service,
        notes,
        google_event_id: googleEventId,
        status: 'confirmed',
      })
      .select()
      .single();

    if (dbError) {
      // If unique constraint violation, slot was taken
      if (dbError.code === '23505') {
        return new Response(
          JSON.stringify({ error: 'Este horario ya no está disponible' }),
          { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      console.error('DB error:', dbError);
      return new Response(
        JSON.stringify({ error: 'Error al guardar la cita' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        appointment: {
          id: appointment.id,
          date,
          time,
          service,
          googleEventId,
        },
      }),
      { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in create-appointment:', error);
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
