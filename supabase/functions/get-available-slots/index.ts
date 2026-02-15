import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GOOGLE_CALENDAR_API = "https://www.googleapis.com/calendar/v3";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const CALENDAR_ID = "primary";

async function getAccessToken(): Promise<string | null> {
  const clientId = Deno.env.get("GOOGLE_CALENDAR_CLIENT_ID");
  const clientSecret = Deno.env.get("GOOGLE_CALENDAR_CLIENT_SECRET");
  const refreshToken = Deno.env.get("GOOGLE_CALENDAR_REFRESH_TOKEN");

  if (!clientId || !clientSecret || !refreshToken) {
    console.error("❌ Faltan credenciales OAuth2");
    return null;
  }

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

    if (!response.ok) {
      console.error("❌ Token refresh failed:", await response.text());
      return null;
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("❌ Error refreshing token:", error);
    return null;
  }
}

serve(async (req) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const date = url.searchParams.get("date");

    if (!date) {
      return new Response(JSON.stringify({ error: "Fecha requerida" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const accessToken = await getAccessToken();

    if (!accessToken) {
      console.error("❌ No se pudo obtener access token");
      return new Response(JSON.stringify({ error: "Token no configurado", slots: [] }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Generar slots de negocio según el día
    const dateObj = new Date(date + "T12:00:00");
    const dayOfWeek = dateObj.getDay();
    let startHour = 9;
    let endHour = 20; // Último slot será 19:00

    if (dayOfWeek === 6) {
      endHour = 18; // Último slot será 17:00
    } else if (dayOfWeek === 0) {
      startHour = 10;
      endHour = 16; // Último slot será 15:00
    }

    const allSlots: string[] = [];
    for (let hour = startHour; hour < endHour; hour++) {
      // Mantén
      allSlots.push(`${hour.toString().padStart(2, "0")}:00`);
    }

    console.log(`📅 Fecha: ${date} | Día: ${dayOfWeek} | Slots generados: ${allSlots.length}`);

    // Consultar Google Calendar
    const timeMin = `${date}T00:00:00Z`;
    const timeMax = `${date}T23:59:59Z`;

    const calendarUrl =
      `${GOOGLE_CALENDAR_API}/calendars/${encodeURIComponent(CALENDAR_ID)}/events?` +
      `timeMin=${encodeURIComponent(timeMin)}&` +
      `timeMax=${encodeURIComponent(timeMax)}&` +
      `timeZone=${encodeURIComponent("America/Mexico_City")}&` +
      `singleEvents=true&` +
      `orderBy=startTime`;

    const response = await fetch(calendarUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      console.error(`❌ Error ${response.status} de Google Calendar`);
      return new Response(
        JSON.stringify({
          slots: allSlots,
          occupied: [],
          warning: "No se pudo verificar calendario",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const data = await response.json();
    const events = data.items || [];

    console.log(`📋 Eventos encontrados: ${events.length}`);

    // Extraer horarios ocupados
    const occupiedSlots = new Set<string>();

    events.forEach((event: any) => {
      if (event.status === "cancelled") {
        return;
      }

      if (event.start?.dateTime) {
        // Parse hour directly from the dateTime string to avoid UTC conversion
        // Format: "2026-02-20T10:00:00-06:00" → extract "10"
        const timeMatch = event.start.dateTime.match(/T(\d{2}):\d{2}/);
        const localHour = timeMatch ? parseInt(timeMatch[1], 10) : -1;
        if (localHour < 0) return;
        const slot = `${localHour.toString().padStart(2, "0")}:00`;

        occupiedSlots.add(slot);
        console.log(`🚫 Bloqueado: ${slot} - ${event.summary || "Sin título"}`);
      } else if (event.start?.date) {
        console.log(`📅 Evento todo el día - bloqueando todos`);
        allSlots.forEach((s) => occupiedSlots.add(s));
      }
    });

    // Filtrar disponibles
    const availableSlots = allSlots.filter((slot) => !occupiedSlots.has(slot));

    console.log(`✅ Disponibles: ${availableSlots.join(", ")}`);
    console.log(`🚫 Ocupados: ${Array.from(occupiedSlots).join(", ")}`);

    return new Response(
      JSON.stringify({
        slots: availableSlots,
        occupied: Array.from(occupiedSlots).sort(),
        total: allSlots.length,
        debug: {
          date,
          eventsFound: events.length,
          businessHours: `${startHour}:00 - ${endHour}:00`,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("💥 Error:", error);
    return new Response(JSON.stringify({ error: error.message, slots: [] }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
