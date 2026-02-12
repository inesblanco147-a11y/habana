import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GOOGLE_CALENDAR_API = "https://www.googleapis.com/calendar/v3";
const CALENDAR_ID = "primary"; // o tu calendar ID específico

serve(async (req) => {
  // CORS headers
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

    // Token de acceso de Google Calendar (deberías guardarlo en Supabase Vault)
    const accessToken = Deno.env.get("GOOGLE_CALENDAR_ACCESS_TOKEN");

    if (!accessToken) {
      console.error("No hay token de Google Calendar configurado");
      return new Response(JSON.stringify({ error: "Configuración incompleta", slots: [] }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Definir horarios de negocio
    const dayOfWeek = new Date(date).getDay();
    let startHour = 9;
    let endHour = 18;

    if (dayOfWeek === 6) {
      endHour = 17; // Sábado
    } else if (dayOfWeek === 0) {
      startHour = 10; // Domingo
      endHour = 17;
    }

    // Generar todos los slots posibles
    const allSlots: string[] = [];
    for (let hour = startHour; hour < endHour; hour++) {
      allSlots.push(`${hour.toString().padStart(2, "0")}:00`);
    }

    // Consultar eventos de Google Calendar
    const timeMin = `${date}T00:00:00Z`;
    const timeMax = `${date}T23:59:59Z`;

    const calendarUrl =
      `${GOOGLE_CALENDAR_API}/calendars/${CALENDAR_ID}/events?` +
      `timeMin=${encodeURIComponent(timeMin)}&` +
      `timeMax=${encodeURIComponent(timeMax)}&` +
      `singleEvents=true&` +
      `orderBy=startTime`;

    const response = await fetch(calendarUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      console.error("Error de Google Calendar:", await response.text());
      return new Response(JSON.stringify({ slots: allSlots, warning: "No se pudo verificar calendario" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const events = data.items || [];

    console.log(`📅 Eventos encontrados para ${date}:`, events.length);

    // Obtener horas ocupadas
    const occupiedSlots = new Set<string>();

    events.forEach((event: any) => {
      if (event.start?.dateTime) {
        const startTime = new Date(event.start.dateTime);
        const hour = startTime.getHours();
        const slot = `${hour.toString().padStart(2, "0")}:00`;
        occupiedSlots.add(slot);
        console.log(`🚫 Slot ocupado: ${slot} - ${event.summary}`);
      }
    });

    // Filtrar slots disponibles
    const availableSlots = allSlots.filter((slot) => !occupiedSlots.has(slot));

    console.log(`✅ Slots disponibles: ${availableSlots.length}/${allSlots.length}`);

    return new Response(JSON.stringify({ slots: availableSlots, total: allSlots.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message, slots: [] }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
