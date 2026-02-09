import { useState, useEffect } from "react";
import { Calendar, Clock, MessageCircle, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSiteSetting } from "@/hooks/useSiteSettings";
import { useServices } from "@/hooks/useServices";
import { supabase } from "@/integrations/supabase/client";

const AppointmentSection = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);

  const googleCalendarUrl = useSiteSetting("google_calendar_url");
  const whatsappNumber = useSiteSetting("whatsapp_number");

  const { data: servicesFromDB = [] } = useServices();
  const services = servicesFromDB.map((s) => ({ value: s.name, label: s.name }));

  // Fetch available slots when date changes
  useEffect(() => {
    if (!selectedDate) {
      setAvailableSlots([]);
      setSelectedTime("");
      return;
    }

    const fetchSlots = async () => {
      setIsLoadingSlots(true);
      setSlotsError(null);
      setSelectedTime("");

      try {
        const dateStr = selectedDate.toISOString().split("T")[0];
        const { data, error } = await supabase.functions.invoke("get-available-slots", {
          body: null,
          method: "GET",
          headers: {},
        });

        // Use fetch directly since we need query params
        const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/get-available-slots?date=${dateStr}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (!response.ok) {
          throw new Error("Error al obtener horarios");
        }

        const result = await response.json();
        setAvailableSlots(result.slots || []);
      } catch (error) {
        console.error("Error fetching slots:", error);
        setSlotsError("No se pudieron cargar los horarios");
        // Fallback to default slots
        setAvailableSlots([
          "09:00",
          "10:00",
          "11:00",
          "12:00",
          "13:00",
          "14:00",
          "15:00",
          "16:00",
          "17:00",
          "18:00",
          "19:00",
        ]);
      } finally {
        setIsLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [selectedDate]);

  const handleGoogleCalendar = () => {
    if (googleCalendarUrl) {
      const link = document.createElement("a");
      link.href = googleCalendarUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleWhatsApp = () => {
    const dateStr = selectedDate ? selectedDate.toLocaleDateString("es-MX") : "";
    const serviceLabel = services.find((s) => s.value === selectedService)?.label || "";
    const message = encodeURIComponent(
      `Hola, me gustaría agendar una cita:\n\n` +
        `📅 Fecha: ${dateStr}\n` +
        `🕐 Hora: ${selectedTime}\n` +
        `📋 Servicio: ${serviceLabel}\n\n` +
        `¿Tienen disponibilidad?`,
    );
    const number = whatsappNumber || "524421234567";
    const link = document.createElement("a");
    link.href = `https://wa.me/${number}?text=${message}`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isFormComplete = selectedDate && selectedTime && selectedService;

  return (
    <section id="cita" className="py-16 lg:py-24 bg-muted/10">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl mb-4 font-bold uppercase tracking-wide text-destructive">
            Agenda tu Cita
          </h2>
          <div className="w-24 h-1 bg-hasace-red mx-auto rounded-full mb-4" />
          <p className="max-w-2xl mx-auto text-muted-foreground">
            Selecciona la fecha, hora y servicio que necesitas. Puedes agendar directamente a través de Google Calendar
            o contactarnos por WhatsApp.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Calendar Card */}
            <Card className="bg-card shadow-xl border-b-4 border-hasace-red">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-hasace-red" />
                  Selecciona una fecha
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date() || date.getDay() === 0}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            {/* Time & Service Card */}
            <Card className="bg-card shadow-xl border-b-4 border-hasace-red">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-hasace-red" />
                  Hora y Servicio
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Service Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tipo de servicio</label>
                  <Select value={selectedService} onValueChange={setSelectedService}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un servicio" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border shadow-lg z-50">
                      {services.map((service) => (
                        <SelectItem key={service.value} value={service.value}>
                          {service.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Time Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Horario disponible</label>

                  {!selectedDate ? (
                    <p className="text-sm text-muted-foreground py-4 text-center">
                      Selecciona una fecha para ver los horarios disponibles
                    </p>
                  ) : isLoadingSlots ? (
                    <div className="flex items-center justify-center py-8 gap-2">
                      <Loader2 className="h-5 w-5 animate-spin text-hasace-red" />
                      <span className="text-sm text-muted-foreground">Cargando horarios...</span>
                    </div>
                  ) : availableSlots.length === 0 ? (
                    <p className="text-sm text-destructive py-4 text-center">
                      No hay horarios disponibles para esta fecha
                    </p>
                  ) : (
                    <div className="grid grid-cols-4 gap-2">
                      {availableSlots.map((time) => (
                        <Button
                          key={time}
                          variant={selectedTime === time ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedTime(time)}
                          className={`text-xs ${selectedTime === time ? "bg-hasace-red hover:bg-hasace-red/90" : ""}`}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  )}

                  {slotsError && (
                    <p className="text-xs text-amber-600 text-center mt-2">
                      {slotsError} - Mostrando horarios predeterminados
                    </p>
                  )}
                </div>

                {/* Summary */}
                {isFormComplete && (
                  <div className="p-4 bg-muted rounded-lg space-y-2">
                    <h4 className="font-medium">Resumen de tu cita:</h4>
                    <p className="text-sm text-muted-foreground">
                      📅{" "}
                      {selectedDate?.toLocaleDateString("es-MX", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-sm text-muted-foreground">🕐 {selectedTime} hrs</p>
                    <p className="text-sm text-muted-foreground">
                      📋 {services.find((s) => s.value === selectedService)?.label}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3">
                  {/* <Button 
                    onClick={handleGoogleCalendar} 
                    className="w-full gap-2 bg-hasace-red hover:bg-hasace-red/90 font-bold"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Agendar con Google Calendar
                  </Button> */}

                  <Button
                    onClick={handleWhatsApp}
                    disabled={!isFormComplete}
                    className="w-full gap-2 text-white bg-green-500 hover:bg-green-600 font-bold shadow-lg"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Agendar por WhatsApp
                  </Button>
                </div>

                <p className="text-xs text-center text-muted-foreground">
                  Horario de atención: Lunes a Viernes, 9:00 - 18:00 <br />
                  Sabado
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppointmentSection;
