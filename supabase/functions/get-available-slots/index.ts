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
      return new Response(JSON.stringify({ error: "Fecha requerida" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const accessToken = Deno.env.get("GOOGLE_CALENDAR_ACCESS_TOKEN");

    if (!accessToken) {
      console.error("❌ No hay token configurado");
      return new Response(JSON.stringify({ error: "Token no configurado", slots: [] }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Generar slots de negocio
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

    console.log(`📅 Fecha solicitada: ${date}`);
    console.log(`🕐 Slots de negocio:`, allSlots);

    // Construir URLs para Google Calendar API (SIN zona horaria específica)
    const timeMin = `${date}T00:00:00`;
    const timeMax = `${date}T23:59:59`;

    const calendarUrl =
      `${GOOGLE_CALENDAR_API}/calendars/${encodeURIComponent(CALENDAR_ID)}/events?` +
      `timeMin=${encodeURIComponent(timeMin)}&` +
      `timeMax=${encodeURIComponent(timeMax)}&` +
      `singleEvents=true&` +
      `orderBy=startTime&` +
      `maxResults=50`;

    console.log(`🔗 Consultando Google Calendar...`);

    const response = await fetch(calendarUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Error de Google Calendar:", response.status, errorText);
      return new Response(
        JSON.stringify({
          error: "Error al consultar calendario",
          slots: allSlots,
          warning: "No se pudo verificar disponibilidad",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const data = await response.json();
    const events = data.items || [];

    console.log(`📋 Total de eventos encontrados: ${events.length}`);

    // Extraer horarios ocupados SOLO de eventos confirmados
    const occupiedSlots = new Set<string>();

    events.forEach((event: any) => {
      // Ignorar eventos cancelados o rechazados
      if (event.status === "cancelled") {
        console.log(`⏭️  Ignorando evento cancelado: ${event.summary || "Sin título"}`);
        return;
      }

      console.log(`📌 Procesando evento: ${event.summary || "Sin título"}`);
      console.log(`   Status: ${event.status}`);

      if (event.start?.dateTime) {
        // Evento con hora específica
        const startTime = new Date(event.start.dateTime);
        const hour = startTime.getHours();
        const minute = startTime.getMinutes();

        // Crear slot en formato HH:00
        const slot = `${hour.toString().padStart(2, "0")}:00`;

        occupiedSlots.add(slot);
        console.log(`   🚫 Bloquea slot: ${slot} (hora exacta: ${hour}:${minute.toString().padStart(2, "0")})`);
      } else if (event.start?.date) {
        // Evento de todo el día - bloquear todos los slots
        console.log(`   📅 Evento de todo el día - bloqueando todos los horarios`);
        allSlots.forEach((slot) => occupiedSlots.add(slot));
      }
    });

    // Filtrar disponibles
    const availableSlots = allSlots.filter((slot) => !occupiedSlots.has(slot));

    console.log(`🚫 Slots ocupados (${occupiedSlots.size}):`, Array.from(occupiedSlots).sort());
    console.log(`✅ Slots disponibles (${availableSlots.length}):`, availableSlots.sort());

    return new Response(
      JSON.stringify({
        slots: availableSlots,
        occupied: Array.from(occupiedSlots).sort(),
        total: allSlots.length,
        debug: {
          date,
          eventsFound: events.length,
          businessHours: `${startHour}:00 - ${endHour}:00`,
          dayOfWeek: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"][dayOfWeek],
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("💥 Error crítico:", error);
    return new Response(JSON.stringify({ error: error.message, slots: [] }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
