// Edge function to get available appointment slots
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const GATEWAY_URL = 'https://gateway.lovable.dev/google_calendar/calendar/v3';

// Base time slots from 09:00 to 18:00 (30 min intervals)
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

function isSlotOccupied(slotTime: string, events: CalendarEvent[], dateStr: string): boolean {
  const slotMinutes = timeToMinutes(slotTime);
  const slotEnd = slotMinutes + 30; // 30 min duration

  for (const event of events) {
    let eventStart: number;
    let eventEnd: number;

    if (event.start.dateTime) {
      // Timed event
      const startDate = new Date(event.start.dateTime);
      const endDate = new Date(event.end.dateTime || event.start.dateTime);
      eventStart = startDate.getHours() * 60 + startDate.getMinutes();
      eventEnd = endDate.getHours() * 60 + endDate.getMinutes();
    } else if (event.start.date) {
      // All-day event - blocks entire day
      return true;
    } else {
      continue;
    }

    // Check if slot overlaps with event
    if (slotMinutes < eventEnd && slotEnd > eventStart) {
      return true;
    }
  }

  return false;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const dateParam = url.searchParams.get('date');

    if (!dateParam) {
      return new Response(
        JSON.stringify({ error: 'Date parameter is required (YYYY-MM-DD)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateParam)) {
      return new Response(
        JSON.stringify({ error: 'Invalid date format. Use YYYY-MM-DD' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if Google Calendar connector is available
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const GOOGLE_CALENDAR_API_KEY = Deno.env.get('GOOGLE_CALENDAR_API_KEY');

    let events: CalendarEvent[] = [];
    let calendarConnected = false;

    if (LOVABLE_API_KEY && GOOGLE_CALENDAR_API_KEY) {
      try {
        // Query Google Calendar for events on this date
        const timeMin = `${dateParam}T00:00:00Z`;
        const timeMax = `${dateParam}T23:59:59Z`;
        
        const calendarResponse = await fetch(
          `${GATEWAY_URL}/calendars/primary/events?timeMin=${encodeURIComponent(timeMin)}&timeMax=${encodeURIComponent(timeMax)}&singleEvents=true`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${LOVABLE_API_KEY}`,
              'X-Connection-Api-Key': GOOGLE_CALENDAR_API_KEY,
              'Content-Type': 'application/json',
            },
          }
        );

        if (calendarResponse.ok) {
          const data = await calendarResponse.json();
          events = data.items || [];
          calendarConnected = true;
          console.log(`Found ${events.length} events for ${dateParam}`);
        } else {
          console.error(`Calendar API error: ${calendarResponse.status}`);
        }
      } catch (error) {
        console.error('Error fetching calendar events:', error);
      }
    } else {
      console.log('Google Calendar not configured, returning all slots');
    }

    // Calculate available slots
    const availableSlots = BASE_SLOTS.filter(
      slot => !isSlotOccupied(slot, events, dateParam)
    );

    return new Response(
      JSON.stringify({
        date: dateParam,
        slots: availableSlots,
        calendarConnected,
        totalSlots: BASE_SLOTS.length,
        availableCount: availableSlots.length,
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in get-available-slots:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        slots: BASE_SLOTS // Fallback to all slots
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
