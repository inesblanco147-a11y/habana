import { useState } from "react";
import { Calendar, Clock, MessageCircle, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AppointmentSection = () => {
  const { theme } = useTheme();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedService, setSelectedService] = useState("");

  const getSectionStyles = () => {
    switch (theme) {
      case "corporate":
        return "bg-secondary";
      case "modern":
        return "bg-muted/10";
      case "warm":
        return "bg-background";
      default:
        return "bg-secondary";
    }
  };

  const getTitleStyles = () => {
    switch (theme) {
      case "corporate":
        return "text-primary font-serif";
      case "modern":
        return "text-foreground font-bold";
      case "warm":
        return "text-hasace-green font-semibold";
      default:
        return "text-primary font-serif";
    }
  };

  const getCardStyles = () => {
    switch (theme) {
      case "corporate":
        return "bg-card shadow-md";
      case "modern":
        return "bg-card shadow-xl border-b-4 border-hasace-red";
      case "warm":
        return "bg-card/90 shadow-lg rounded-2xl";
      default:
        return "bg-card shadow-md";
    }
  };

  const getButtonStyles = () => {
    switch (theme) {
      case "corporate":
        return "bg-destructive hover:bg-destructive/90";
      case "modern":
        return "bg-hasace-red hover:bg-hasace-red/90 font-bold";
      case "warm":
        return "bg-hasace-green hover:bg-hasace-green/90";
      default:
        return "bg-destructive hover:bg-destructive/90";
    }
  };

  const getWhatsAppStyles = () => {
    switch (theme) {
      case "corporate":
        return "bg-green-600 hover:bg-green-700";
      case "modern":
        return "bg-green-500 hover:bg-green-600 font-bold shadow-lg";
      case "warm":
        return "bg-green-600 hover:bg-green-700";
      default:
        return "bg-green-600 hover:bg-green-700";
    }
  };

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30", "18:00"
  ];

  const services = [
    { value: "rehabilitacion", label: "Rehabilitación Física" },
    { value: "medicina-deportiva", label: "Medicina Deportiva" },
    { value: "terapia-fisica", label: "Terapia Física" },
    { value: "rehabilitacion-pediatrica", label: "Rehabilitación Pediátrica" },
    { value: "evaluacion", label: "Evaluación Inicial" },
    { value: "seguimiento", label: "Consulta de Seguimiento" }
  ];

  const handleGoogleCalendar = () => {
    // Placeholder for Google Calendar integration
    const calendarUrl = "https://calendar.google.com/calendar/appointments/schedules/";
    window.open(calendarUrl, "_blank");
  };

  const handleWhatsApp = () => {
    const dateStr = selectedDate ? selectedDate.toLocaleDateString("es-MX") : "";
    const serviceLabel = services.find(s => s.value === selectedService)?.label || "";
    const message = encodeURIComponent(
      `Hola, me gustaría agendar una cita:\n\n` +
      `📅 Fecha: ${dateStr}\n` +
      `🕐 Hora: ${selectedTime}\n` +
      `📋 Servicio: ${serviceLabel}\n\n` +
      `¿Tienen disponibilidad?`
    );
    window.open(`https://wa.me/524421234567?text=${message}`, "_blank");
  };

  const isFormComplete = selectedDate && selectedTime && selectedService;

  return (
    <section id="appointment" className={`py-16 lg:py-24 ${getSectionStyles()}`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Calendar className="h-8 w-8 text-primary" />
          </div>
          <h2 className={`text-3xl lg:text-4xl mb-4 ${getTitleStyles()}`}>
            Agenda tu Cita
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Selecciona la fecha, hora y servicio que necesitas. Puedes agendar directamente 
            a través de Google Calendar o contactarnos por WhatsApp.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Calendar Card */}
            <Card className={getCardStyles()}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Selecciona una fecha
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => 
                    date < new Date() || 
                    date.getDay() === 0 // Disable Sundays
                  }
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            {/* Time & Service Card */}
            <Card className={getCardStyles()}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
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
                      {services.map(service => (
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
                  <div className="grid grid-cols-4 gap-2">
                    {timeSlots.map(time => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedTime(time)}
                        className="text-xs"
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                {isFormComplete && (
                  <div className="p-4 bg-muted rounded-lg space-y-2">
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
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={handleGoogleCalendar}
                    className={`w-full gap-2 ${getButtonStyles()}`}
                  >
                    <ExternalLink className="h-4 w-4" />
                    Agendar con Google Calendar
                  </Button>

                  <Button
                    onClick={handleWhatsApp}
                    disabled={!isFormComplete}
                    className={`w-full gap-2 text-white ${getWhatsAppStyles()}`}
                  >
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
    </section>
  );
};

export default AppointmentSection;
