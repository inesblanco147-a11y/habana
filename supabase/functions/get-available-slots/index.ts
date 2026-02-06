// Edge function to get available appointment slots with Google Calendar OAuth
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const GOOGLE_CALENDAR_API = 'https://www.googleapis.com/calendar/v3';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';

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

function isSlotOccupied(slotTime: string, events: CalendarEvent[]): boolean {
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

async function getAccessToken(): Promise<string | null> {
  const clientId = Deno.env.get('GOOGLE_CALENDAR_CLIENT_ID');
  const clientSecret = Deno.env.get('GOOGLE_CALENDAR_CLIENT_SECRET');
  const refreshToken = Deno.env.get('GOOGLE_CALENDAR_REFRESH_TOKEN');

  if (!clientId || !clientSecret || !refreshToken) {
    console.log('Missing Google Calendar OAuth credentials');
    return null;
  }

  try {
    const response = await fetch(GOOGLE_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to refresh access token:', errorText);
      return null;
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    return null;
  }
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

    // Validate that it's a real date
    const parsedDate = new Date(dateParam + 'T00:00:00Z');
    if (isNaN(parsedDate.getTime()) || parsedDate.toISOString().split('T')[0] !== dateParam) {
      return new Response(
        JSON.stringify({ error: 'Invalid date value' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Prevent queries for dates too far in past/future
    const now = new Date();
    const daysDiff = (parsedDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    if (daysDiff < -30 || daysDiff > 365) {
      return new Response(
        JSON.stringify({ error: 'Date must be within 30 days past to 1 year future' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let events: CalendarEvent[] = [];
    let calendarConnected = false;

    // Try to get access token and fetch calendar events
    const accessToken = await getAccessToken();

    if (accessToken) {
      try {
        // Query Google Calendar for events on this date
        const timeMin = `${dateParam}T00:00:00Z`;
        const timeMax = `${dateParam}T23:59:59Z`;
        
        const calendarResponse = await fetch(
          `${GOOGLE_CALENDAR_API}/calendars/primary/events?timeMin=${encodeURIComponent(timeMin)}&timeMax=${encodeURIComponent(timeMax)}&singleEvents=true&orderBy=startTime`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
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
          const errorText = await calendarResponse.text();
          console.error(`Calendar API error [${calendarResponse.status}]:`, errorText);
        }
      } catch (error) {
        console.error('Error fetching calendar events:', error);
      }
    } else {
      console.log('Google Calendar not configured, returning all slots');
    }

    // Calculate available slots
    const availableSlots = BASE_SLOTS.filter(
      slot => !isSlotOccupied(slot, events)
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
