import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GOOGLE_CALENDAR_API = "https://www.googleapis.com/calendar/v3";
const CALENDAR_ID = "primary";

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
      return new Response(
        JSON.stringify({ error: "Fecha requerida" }), 
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const accessToken = Deno.env.get("GOOGLE_CALENDAR_ACCESS_TOKEN");
    
    if (!accessToken) {
      console.error("❌ No hay token configurado");
      return new Response(
        JSON.stringify({ error: "Token no configurado", slots: [] }), 
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generar slots de negocio según el día
    const dateObj = new Date(date + "T12:00:00");
    const dayOfWeek = dateObj.getDay();
    let startHour = 9;
    let endHour = 18;

    if (dayOfWeek === 6) {
      endHour = 17;
    } else if (dayOfWeek === 0) {
      startHour = 10;
      endHour = 17;
    }

    const allSlots: string[] = [];
    for (let hour = startHour; hour < endHour; hour++) {
      allSlots.push(`${hour.toString().padStart(2, "0")}:00`);
    }

    console.log(`📅 Fecha: ${date} | Día: ${dayOfWeek} | Slots generados: ${allSlots.length}`);

    // Consultar Google Calendar
    const timeMin = `${date}T00:00:00Z`;
    const timeMax = `${date}T23:59:59Z`;
    
    const calendarUrl = `${GOOGLE_CALENDAR_API}/calendars/${encodeURIComponent(CALENDAR_ID)}/events?` +
      `timeMin=${encodeURIComponent(timeMin)}&` +
      `timeMax=${encodeURIComponent(timeMax)}&` +
      `singleEvents=true&` +
      `orderBy=startTime`;

    const response = await fetch(calendarUrl, {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      console.error(`❌ Error ${response.status} de Google Calendar`);
      return new Response(
        JSON.stringify({ 
          slots: allSlots,
          occupied: [],
          warning: "No se pudo verificar calendario"
        }), 
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
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
        const startTime = new Date(event.start.dateTime);
        const localHour = startTime.getHours();
        const slot = `${localHour.toString().padStart(2, "0")}:00`;
        
        occupiedSlots.add(slot);
        console.log(`🚫 Bloqueado: ${slot} - ${event.summary || 'Sin título'}`);
        
      } else if (event.start?.date) {
        console.log(`📅 Evento todo el día - bloqueando todos`);
        allSlots.forEach(s => occupiedSlots.add(s));
      }
    });

    // Filtrar disponibles
    const availableSlots = allSlots.filter(slot => !occupiedSlots.has(slot));

    console.log(`✅ Disponibles: ${availableSlots.join(', ')}`);
    console.log(`🚫 Ocupados: ${Array.from(occupiedSlots).join(', ')}`);

    return new Response(
      JSON.stringify({ 
        slots: availableSlots,
        occupied: Array.from(occupiedSlots).sort(),
        total: allSlots.length,
        debug: {
          date,
          eventsFound: events.length,
          businessHours: `${startHour}:00 - ${endHour}:00`,
        }
      }), 
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("💥 Error:", error);
    return new Response(
      JSON.stringify({ error: error.message, slots: [] }), 
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
