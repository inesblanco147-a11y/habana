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

    console.log(`
═══════════════════════════════════════════════════════
📅 INICIANDO CONSULTA
═══════════════════════════════════════════════════════
Fecha solicitada: ${date}
Día de la semana: ${["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"][dayOfWeek]}
Horario de negocio: ${startHour}:00 - ${endHour}:00
Slots totales generados: ${allSlots.length}
Slots: ${allSlots.join(", ")}
    `);

    // Construir URLs para Google Calendar API
    const timeMin = `${date}T00:00:00Z`;
    const timeMax = `${date}T23:59:59Z`;

    const calendarUrl =
      `${GOOGLE_CALENDAR_API}/calendars/${encodeURIComponent(CALENDAR_ID)}/events?` +
      `timeMin=${encodeURIComponent(timeMin)}&` +
      `timeMax=${encodeURIComponent(timeMax)}&` +
      `singleEvents=true&` +
      `orderBy=startTime&` +
      `maxResults=50`;

    console.log(`🔗 URL de consulta: ${calendarUrl}`);

    const response = await fetch(calendarUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Error ${response.status} de Google Calendar:`, errorText);
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

    console.log(`
═══════════════════════════════════════════════════════
📋 EVENTOS ENCONTRADOS: ${events.length}
═══════════════════════════════════════════════════════
    `);

    // Log completo de cada evento
    events.forEach((event: any, index: number) => {
      console.log(`
─────────────────────────────────────────────────────
EVENTO #${index + 1}
─────────────────────────────────────────────────────
Título: ${event.summary || "Sin título"}
Status: ${event.status}
ID: ${event.id}
Inicio (dateTime): ${event.start?.dateTime || "N/A"}
Inicio (date): ${event.start?.date || "N/A"}
Fin (dateTime): ${event.end?.dateTime || "N/A"}
Fin (date): ${event.end?.date || "N/A"}
Creador: ${event.creator?.email || "N/A"}
      `);
    });

    // Extraer horarios ocupados
    const occupiedSlots = new Set<string>();
    const debugInfo: any[] = [];

    events.forEach((event: any) => {
      // Ignorar eventos cancelados
      if (event.status === "cancelled") {
        console.log(`⏭️  IGNORADO (cancelado): ${event.summary}`);
        return;
      }

      if (event.start?.dateTime) {
        // Evento con hora específica
        const startTimeRaw = event.start.dateTime;
        const startTime = new Date(startTimeRaw);

        // Obtener hora local
        const hour = startTime.getUTCHours();
        const minute = startTime.getUTCMinutes();
        const localHour = startTime.getHours();
        const localMinute = startTime.getMinutes();

        const slot = `${localHour.toString().padStart(2, "0")}:00`;

        occupiedSlots.add(slot);

        const eventDebug = {
          title: event.summary,
          rawStart: startTimeRaw,
          utcHour: hour,
          utcMinute: minute,
          localHour: localHour,
          localMinute: localMinute,
          blockedSlot: slot,
        };

        debugInfo.push(eventDebug);

        console.log(`
🚫 BLOQUEANDO SLOT
   Título: ${event.summary}
   Hora raw: ${startTimeRaw}
   UTC: ${hour}:${minute.toString().padStart(2, "0")}
   Local: ${localHour}:${localMinute.toString().padStart(2, "0")}
   Slot bloqueado: ${slot}
        `);
      } else if (event.start?.date) {
        // Evento de todo el día
        console.log(`📅 EVENTO TODO EL DÍA: ${event.summary} - Bloqueando TODOS los horarios`);
        allSlots.forEach((slot) => occupiedSlots.add(slot));
      }
    });

    // Filtrar disponibles
    const availableSlots = allSlots.filter((slot) => !occupiedSlots.has(slot));

    console.log(`
═══════════════════════════════════════════════════════
📊 RESULTADO FINAL
═══════════════════════════════════════════════════════
Slots totales: ${allSlots.length}
Slots ocupados: ${occupiedSlots.size}
Slots disponibles: ${availableSlots.length}

🚫 Ocupados: ${Array.from(occupiedSlots).sort().join(", ") || "ninguno"}
✅ Disponibles: ${availableSlots.sort().join(", ")}
═══════════════════════════════════════════════════════
    `);

    return new Response(
      JSON.stringify({
        slots: availableSlots,
        occupied: Array.from(occupiedSlots).sort(),
        total: allSlots.length,
        eventsDebug: debugInfo,
        debug: {
          date,
          eventsFound: events.length,
          businessHours: `${startHour}:00 - ${endHour}:00`,
          dayOfWeek: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"][dayOfWeek],
          timeRange: `${timeMin} → ${timeMax}`,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("💥 ERROR CRÍTICO:", error);
    console.error("Stack:", error.stack);
    return new Response(JSON.stringify({ error: error.message, slots: [] }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
