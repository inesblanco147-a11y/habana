import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const GOOGLE_CALENDAR_API = "https://www.googleapis.com/calendar/v3";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";

function generateSlots(dateParam: string): string[] {
  const date = new Date(dateParam + "T12:00:00Z"); // Usar mediodía UTC para evitar problemas de zona horaria
  const dayOfWeek = date.getUTCDay(); // 0=Domingo, 1=Lunes, ..., 6=Sábado

  const slots: string[] = [];
  let startHour = 9;
  let endHour = 18;

  // Ajustar horarios según el día de la semana
  if (dayOfWeek === 7) {
    // Sábado: 9:00 - 17:00
    endHour = 17;
  } else if (dayOfWeek === 0) {
    // Domingo: 10:00 - 17:00
    startHour = 10;
    endHour = 17;
  }
  // Lunes a Viernes: 9:00 - 18:00 (valores por defecto)

  // Generar slots cada hora
  for (let hour = startHour; hour < endHour; hour++) {
    slots.push(`${hour.toString().padStart(2, "0")}:00`);
  }

  return slots;
}

// const BASE_SLOTS = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

interface CalendarEvent {
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
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
  const clientId = Deno.env.get("GOOGLE_CALENDAR_CLIENT_ID");
  const clientSecret = Deno.env.get("GOOGLE_CALENDAR_CLIENT_SECRET");
  const refreshToken = Deno.env.get("GOOGLE_CALENDAR_REFRESH_TOKEN");

  if (!clientId || !clientSecret || !refreshToken) return null;

  try {
    const response = await fetch(GOOGLE_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
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
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const dateParam = url.searchParams.get("date");

    if (!dateParam || !/^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
      return new Response(JSON.stringify({ error: "Date parameter is required (YYYY-MM-DD)" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const parsedDate = new Date(dateParam + "T00:00:00Z");
    if (isNaN(parsedDate.getTime())) {
      return new Response(JSON.stringify({ error: "Invalid date" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get booked slots from DB
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: dbAppointments } = await supabase
      .from("appointments")
      .select("time")
      .eq("date", dateParam)
      .eq("status", "confirmed");

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
            headers: { Authorization: `Bearer ${accessToken}` },
          },
        );

        if (calResponse.ok) {
          const data = await calResponse.json();
          calendarEvents = data.items || [];
          calendarConnected = true;
        }
      } catch (error) {
        console.error("Calendar API error:", error);
      }
    }

    // Generar slots dinámicamente según el día
    const baseSlots = generateSlots(dateParam);

    // Filtrar slots ocupados (de DB y Google Calendar)
    const availableSlots = baseSlots.filter(
      (slot) => !dbBookedTimes.has(slot) && !isSlotOccupied(slot, calendarEvents),
    );

    return new Response(
      JSON.stringify({
        date: dateParam,
        slots: availableSlots,
        calendarConnected,
        totalSlots: baseSlots.length,
        availableCount: availableSlots.length,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Error:", error);

    // En caso de error, generar slots por defecto (asumiendo día laboral)
    const fallbackSlots = [];
    for (let hour = 9; hour < 18; hour++) {
      fallbackSlots.push(`${hour.toString().padStart(2, "0")}:00`);
    }

    return new Response(JSON.stringify({ error: "Internal server error", slots: fallbackSlots }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
