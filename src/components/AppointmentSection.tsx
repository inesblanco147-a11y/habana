import { useState } from "react";
import { Calendar, Clock, MessageCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSiteSetting } from "@/hooks/useSiteSettings";

const AppointmentSection = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedService, setSelectedService] = useState("");
  
  const googleCalendarUrl = useSiteSetting("google_calendar_url");
  const whatsappNumber = useSiteSetting("whatsapp_number");
  
  const timeSlots = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"];
  const services = [{
    value: "rehabilitacion",
    label: "Rehabilitación Física"
  }, {
    value: "medicina-deportiva",
    label: "Medicina Deportiva"
  }, {
    value: "terapia-fisica",
    label: "Terapia Física"
  }, {
    value: "rehabilitacion-pediatrica",
    label: "Rehabilitación Pediátrica"
  }, {
    value: "evaluacion",
    label: "Evaluación Inicial"
  }, {
    value: "seguimiento",
    label: "Consulta de Seguimiento"
  }];
  
  const handleGoogleCalendar = () => {
    if (googleCalendarUrl) {
      // Use anchor element to avoid COOP issues in Firefox
      const link = document.createElement('a');
      link.href = googleCalendarUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  
  const handleWhatsApp = () => {
    const dateStr = selectedDate ? selectedDate.toLocaleDateString("es-MX") : "";
    const serviceLabel = services.find(s => s.value === selectedService)?.label || "";
    const message = encodeURIComponent(`Hola, me gustaría agendar una cita:\n\n` + `📅 Fecha: ${dateStr}\n` + `🕐 Hora: ${selectedTime}\n` + `📋 Servicio: ${serviceLabel}\n\n` + `¿Tienen disponibilidad?`);
    const number = whatsappNumber || "524421234567";
    // Use anchor element to avoid COOP issues in Firefox
    const link = document.createElement('a');
    link.href = `https://wa.me/${number}?text=${message}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const isFormComplete = selectedDate && selectedTime && selectedService;
  return <section id="cita" className="py-16 lg:py-24 bg-muted/10">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-hasace-red/10 mb-4">
            <Calendar className="h-8 w-8 text-hasace-red" />
          </div>
          <h2 className="text-3xl lg:text-4xl mb-4 font-bold text-destructive">
            Agenda tu Cita
          </h2>
          <p className="max-w-2xl mx-auto text-primary">
            Selecciona la fecha, hora y servicio que necesitas. Puedes agendar directamente 
            a través de Google Calendar o contactarnos por WhatsApp.
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
                <CalendarComponent mode="single" selected={selectedDate} onSelect={setSelectedDate} disabled={date => date < new Date() || date.getDay() === 0} className="rounded-md border" />
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
                      {services.map(service => <SelectItem key={service.value} value={service.value}>
                          {service.label}
                        </SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                {/* Time Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Horario disponible</label>
                  <div className="grid grid-cols-4 gap-2">
                    {timeSlots.map(time => <Button key={time} variant={selectedTime === time ? "default" : "outline"} size="sm" onClick={() => setSelectedTime(time)} className={`text-xs ${selectedTime === time ? "bg-hasace-red hover:bg-hasace-red/90" : ""}`}>
                        {time}
                      </Button>)}
                  </div>
                </div>

                {/* Summary */}
                {isFormComplete && <div className="p-4 bg-muted rounded-lg space-y-2">
                    <h4 className="font-medium">Resumen de tu cita:</h4>
                    <p className="text-sm text-muted-foreground">
                      📅 {selectedDate?.toLocaleDateString("es-MX", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  })}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      🕐 {selectedTime} hrs
                    </p>
                    <p className="text-sm text-muted-foreground">
                      📋 {services.find(s => s.value === selectedService)?.label}
                    </p>
                  </div>}

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button onClick={handleGoogleCalendar} className="w-full gap-2 bg-hasace-red hover:bg-hasace-red/90 font-bold">
                    <ExternalLink className="h-4 w-4" />
                    Agendar con Google Calendar
                  </Button>

                  <Button onClick={handleWhatsApp} disabled={!isFormComplete} className="w-full gap-2 text-white bg-green-500 hover:bg-green-600 font-bold shadow-lg">
                    <MessageCircle className="h-4 w-4" />
                    Agendar por WhatsApp
                  </Button>
                </div>

                <p className="text-xs text-center text-muted-foreground">
                  Horario de atención: Lunes a Sábado, 9:00 - 18:00
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>;
};
export default AppointmentSection;
