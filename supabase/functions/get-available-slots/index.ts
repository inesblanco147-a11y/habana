import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const GOOGLE_CALENDAR_API = 'https://www.googleapis.com/calendar/v3';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';

const BASE_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00"
];

interface CalendarEvent {
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function isSlotOccupied(slotTime: string, events: CalendarEvent[]): boolean {
  const slotMinutes = timeToMinutes(slotTime);
  const slotEnd = slotMinutes + 30;

  for (const event of events) {
    if (event.start.date) return true; // all-day event

    if (event.start.dateTime) {
      const startDate = new Date(event.start.dateTime);
      const endDate = new Date(event.end.dateTime || event.start.dateTime);
      const eventStart = startDate.getHours() * 60 + startDate.getMinutes();
      const eventEnd = endDate.getHours() * 60 + endDate.getMinutes();

      if (slotMinutes < eventEnd && slotEnd > eventStart) return true;
    }
  }
  return false;
}

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

    if (!response.ok) return null;
    const data = await response.json();
    return data.access_token;
  } catch {
    return null;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const dateParam = url.searchParams.get('date');

    if (!dateParam || !/^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
      return new Response(
        JSON.stringify({ error: 'Date parameter is required (YYYY-MM-DD)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const parsedDate = new Date(dateParam + 'T00:00:00Z');
    if (isNaN(parsedDate.getTime())) {
      return new Response(
        JSON.stringify({ error: 'Invalid date' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get booked slots from DB
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: dbAppointments } = await supabase
      .from('appointments')
      .select('time')
      .eq('date', dateParam)
      .eq('status', 'confirmed');

    const dbBookedTimes = new Set((dbAppointments || []).map((a: any) => a.time));

    // Get Google Calendar events
    let calendarEvents: CalendarEvent[] = [];
    let calendarConnected = false;
    const accessToken = await getAccessToken();

    if (accessToken) {
      try {
        const timeMin = `${dateParam}T00:00:00Z`;
        const timeMax = `${dateParam}T23:59:59Z`;

        const calResponse = await fetch(
          `${GOOGLE_CALENDAR_API}/calendars/primary/events?timeMin=${encodeURIComponent(timeMin)}&timeMax=${encodeURIComponent(timeMax)}&singleEvents=true&orderBy=startTime`,
          {
            headers: { 'Authorization': `Bearer ${accessToken}` },
          }
        );

        if (calResponse.ok) {
          const data = await calResponse.json();
          calendarEvents = data.items || [];
          calendarConnected = true;
        }
      } catch (error) {
        console.error('Calendar API error:', error);
      }
    }

    // Combine both sources
    const availableSlots = BASE_SLOTS.filter(
      slot => !dbBookedTimes.has(slot) && !isSlotOccupied(slot, calendarEvents)
    );

    return new Response(
      JSON.stringify({
        date: dateParam,
        slots: availableSlots,
        calendarConnected,
        totalSlots: BASE_SLOTS.length,
        availableCount: availableSlots.length,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', slots: BASE_SLOTS }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
