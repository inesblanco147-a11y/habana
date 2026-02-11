import { useState, useEffect } from "react";
import { Calendar, Clock, MessageCircle, Loader2, CheckCircle2, User, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useSiteSetting } from "@/hooks/useSiteSettings";
import { useServices } from "@/hooks/useServices";
import { useCreateAppointment } from "@/hooks/useAppointmentMutations";

const AppointmentSection = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const whatsappNumber = useSiteSetting("whatsapp_number");
  const { data: servicesFromDB = [] } = useServices();
  const services = servicesFromDB.map((s) => ({ value: s.name, label: s.name }));
  const createAppointment = useCreateAppointment();

  useEffect(() => {
    if (!selectedDate) {
      setAvailableSlots([]);
      setSelectedTime("");
      return;
    }

    const generateBusinessHourSlots = (date: Date): string[] => {
      const dayOfWeek = date.getDay();
      const slots: string[] = [];

      let startHour = 9;
      let endHour = 18;

      if (dayOfWeek === 6) {
        endHour = 17;
      } else if (dayOfWeek === 0) {
        startHour = 10;
        endHour = 17;
      }

      // Generar TODOS los slots
      for (let hour = startHour; hour < endHour; hour++) {
        slots.push(`${hour.toString().padStart(2, "0")}:00`);
      }

      return slots;
    };

    setIsLoadingSlots(true);
    setSlotsError(null);
    setSelectedTime("");

    // Generar slots localmente
    const businessSlots = generateBusinessHourSlots(selectedDate);

    console.log("📅 Fecha seleccionada:", selectedDate);
    console.log("🕐 Slots generados:", businessSlots);

    // FORZAR el uso de slots locales (sin llamar a Google Calendar)
    setAvailableSlots(businessSlots);
    setIsLoadingSlots(false);
  }, [selectedDate]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!firstName.trim()) errors.firstName = "Nombre requerido";
    if (!lastName.trim()) errors.lastName = "Apellidos requeridos";

    const phoneClean = phone.replace(/[\s\-\(\)]/g, "");
    const phoneRegex = /^(\+?52)?[1-9]\d{9}$/;
    if (!phoneRegex.test(phoneClean)) errors.phone = "Formato: +52 seguido de 10 dígitos";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) errors.email = "Email inválido";

    if (!selectedDate) errors.date = "Selecciona una fecha";
    if (!selectedTime) errors.time = "Selecciona un horario";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !selectedDate) return;

    const dateStr = selectedDate.toISOString().split("T")[0];

    try {
      await createAppointment.mutateAsync({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.replace(/[\s\-\(\)]/g, ""),
        email: email.trim(),
        date: dateStr,
        time: selectedTime,
        service: selectedService,
        notes: notes.trim(),
      });

      setShowConfirmation(true);

      // Open WhatsApp with pre-filled message
      const dateDisplay = selectedDate.toLocaleDateString("es-MX", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const serviceLabel = services.find((s) => s.value === selectedService)?.label || "";
      const message = encodeURIComponent(
        `¡Hola! He agendado una cita:\n\n` +
          `👤 ${firstName.trim()} ${lastName.trim()}\n` +
          `📅 ${dateDisplay}\n` +
          `🕐 ${selectedTime} hrs\n` +
          (serviceLabel ? `📋 ${serviceLabel}\n` : "") +
          `\n¡Gracias!`,
      );
      const number = whatsappNumber || "524421234567";
      window.open(`https://wa.me/${number}?text=${message}`, "_blank", "noopener,noreferrer");
    } catch {
      // Error handled by mutation hook
    }
  };

  const resetForm = () => {
    setSelectedDate(undefined);
    setSelectedTime("");
    setSelectedService("");
    setFirstName("");
    setLastName("");
    setPhone("");
    setEmail("");
    setNotes("");
    setShowConfirmation(false);
    setFormErrors({});
  };

  const isFormComplete =
    selectedDate && selectedTime && firstName.trim() && lastName.trim() && phone.trim() && email.trim();

  if (showConfirmation) {
    return (
      <section id="cita" className="py-16 lg:py-24 bg-muted/10">
        <div className="container mx-auto px-4">
          <Card className="max-w-lg mx-auto shadow-xl border-b-4 border-hasace-green">
            <CardContent className="pt-8 text-center space-y-4">
              <CheckCircle2 className="h-16 w-16 text-hasace-green mx-auto" />
              <h3 className="text-2xl font-bold">¡Cita Agendada!</h3>
              <p className="text-muted-foreground">
                Tu cita ha sido registrada exitosamente. Te hemos redirigido a WhatsApp para confirmar.
              </p>
              <div className="p-4 bg-muted rounded-lg text-left space-y-1">
                <p className="text-sm">
                  👤 {firstName} {lastName}
                </p>
                <p className="text-sm">
                  📅{" "}
                  {selectedDate?.toLocaleDateString("es-MX", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-sm">🕐 {selectedTime} hrs</p>
                {selectedService && (
                  <p className="text-sm">📋 {services.find((s) => s.value === selectedService)?.label}</p>
                )}
              </div>
              <Button onClick={resetForm} className="bg-primary hover:bg-primary/90">
                Agendar otra cita
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section id="cita" className="py-16 lg:py-24 bg-muted/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl mb-4 font-bold uppercase tracking-wide text-destructive">
            Agenda tu Cita
          </h2>
          <div className="w-24 h-1 bg-hasace-red mx-auto rounded-full mb-4" />
          <p className="max-w-2xl mx-auto text-muted-foreground">
            Selecciona la fecha, hora y llena tus datos para agendar. Recibirás confirmación por WhatsApp.
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

            {/* Form Card */}
            <Card className="bg-card shadow-xl border-b-4 border-hasace-red">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-hasace-red" />
                  Detalles de la Cita
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Service */}
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Tipo de servicio</Label>
                  <Select value={selectedService} onValueChange={setSelectedService}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un servicio (opcional)" />
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

                {/* Time Slots */}
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Horario disponible</Label>
                  {!selectedDate ? (
                    <p className="text-sm text-muted-foreground py-3 text-center">
                      Selecciona una fecha para ver horarios
                    </p>
                  ) : isLoadingSlots ? (
                    <div className="flex items-center justify-center py-6 gap-2">
                      <Loader2 className="h-5 w-5 animate-spin text-hasace-red" />
                      <span className="text-sm text-muted-foreground">Cargando...</span>
                    </div>
                  ) : availableSlots.length === 0 ? (
                    <p className="text-sm text-destructive py-3 text-center">No hay horarios disponibles</p>
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
                  {formErrors.time && <p className="text-xs text-destructive">{formErrors.time}</p>}
                  {slotsError && <p className="text-xs text-amber-600 text-center">{slotsError}</p>}
                </div>

                {/* Patient Data */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium flex items-center gap-1">
                      <User className="h-3 w-3" /> Nombre *
                    </Label>
                    <Input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Nombre"
                      maxLength={100}
                    />
                    {formErrors.firstName && <p className="text-xs text-destructive">{formErrors.firstName}</p>}
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Apellidos *</Label>
                    <Input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Apellidos"
                      maxLength={100}
                    />
                    {formErrors.lastName && <p className="text-xs text-destructive">{formErrors.lastName}</p>}
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-sm font-medium flex items-center gap-1">
                    <Phone className="h-3 w-3" /> Teléfono *
                  </Label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+52 442 123 4567"
                    maxLength={20}
                  />
                  {formErrors.phone && <p className="text-xs text-destructive">{formErrors.phone}</p>}
                </div>

                <div className="space-y-1">
                  <Label className="text-sm font-medium flex items-center gap-1">
                    <Mail className="h-3 w-3" /> Correo electrónico *
                  </Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="correo@ejemplo.com"
                    maxLength={255}
                  />
                  {formErrors.email && <p className="text-xs text-destructive">{formErrors.email}</p>}
                </div>

                <div className="space-y-1">
                  <Label className="text-sm font-medium">Notas adicionales</Label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Información adicional (opcional)"
                    maxLength={500}
                    rows={2}
                  />
                </div>

                {/* Summary */}
                {isFormComplete && (
                  <div className="p-3 bg-muted rounded-lg space-y-1">
                    <h4 className="font-medium text-sm">Resumen:</h4>
                    <p className="text-xs text-muted-foreground">
                      👤 {firstName} {lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      📅{" "}
                      {selectedDate?.toLocaleDateString("es-MX", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-xs text-muted-foreground">🕐 {selectedTime} hrs</p>
                    {selectedService && (
                      <p className="text-xs text-muted-foreground">
                        📋 {services.find((s) => s.value === selectedService)?.label}
                      </p>
                    )}
                  </div>
                )}

                <Button
                  onClick={handleSubmit}
                  disabled={!isFormComplete || createAppointment.isPending}
                  className="w-full gap-2 text-white bg-green-500 hover:bg-green-600 font-bold shadow-lg"
                >
                  {createAppointment.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Agendando...
                    </>
                  ) : (
                    <>
                      <MessageCircle className="h-4 w-4" /> Confirmar y Agendar por WhatsApp
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Horario de atención: Lunes a Viernes, 9:00 - 18:00 <br />
                  Sábado 9:00 - 17:00 · Domingo 10:00 - 17:00
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
