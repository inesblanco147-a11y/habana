import { useState } from "react";
import { Send, Phone, Mail, User, MessageSquare, HelpCircle } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const HelpSection = () => {
  const { theme } = useTheme();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: ""
  });

  const getSectionStyles = () => {
    switch (theme) {
      case "corporate":
        return "bg-muted/50";
      case "modern":
        return "bg-background";
      case "warm":
        return "bg-muted/30";
      default:
        return "bg-muted/50";
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
        return "bg-card shadow-md rounded-lg";
      case "modern":
        return "bg-card shadow-xl border-t-4 border-hasace-red";
      case "warm":
        return "bg-card/80 shadow-lg rounded-2xl";
      default:
        return "bg-card shadow-md rounded-lg";
    }
  };

  const getInputStyles = () => {
    switch (theme) {
      case "corporate":
        return "";
      case "modern":
        return "border-2 focus:border-hasace-red";
      case "warm":
        return "rounded-xl border-hasace-green/30 focus:border-hasace-green";
      default:
        return "";
    }
  };

  const getButtonStyles = () => {
    switch (theme) {
      case "corporate":
        return "bg-primary hover:bg-primary/90";
      case "modern":
        return "bg-hasace-red hover:bg-hasace-red/90 font-bold";
      case "warm":
        return "bg-hasace-green hover:bg-hasace-green/90";
      default:
        return "bg-primary hover:bg-primary/90";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: "Mensaje enviado",
      description: "Nos pondremos en contacto contigo pronto.",
    });

    setFormData({
      name: "",
      phone: "",
      email: "",
      subject: "",
      message: ""
    });
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const helpTopics = [
    { value: "info-servicios", label: "Información de servicios" },
    { value: "agendar-cita", label: "Agendar una cita" },
    { value: "cursos", label: "Cursos y capacitaciones" },
    { value: "productos", label: "Productos y equipamiento" },
    { value: "facturacion", label: "Facturación" },
    { value: "otro", label: "Otro tema" }
  ];

  return (
    <section id="help" className={`py-16 lg:py-24 ${getSectionStyles()}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <HelpCircle className="h-8 w-8 text-primary" />
            </div>
            <h2 className={`text-3xl lg:text-4xl mb-4 ${getTitleStyles()}`}>
              ¿Cómo podemos ayudarte?
            </h2>
            <p className="text-muted-foreground">
              Completa el formulario y nos pondremos en contacto contigo lo antes posible
            </p>
          </div>

          {/* Form Card */}
          <div className={`p-6 lg:p-8 ${getCardStyles()}`}>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name & Phone Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Nombre completo
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Tu nombre"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={getInputStyles()}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Teléfono
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+52 442 123 4567"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className={getInputStyles()}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Correo electrónico
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={getInputStyles()}
                />
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <Label htmlFor="subject" className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4" />
                  ¿En qué podemos ayudarte?
                </Label>
                <Select
                  value={formData.subject}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, subject: value }))}
                >
                  <SelectTrigger className={getInputStyles()}>
                    <SelectValue placeholder="Selecciona un tema" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border shadow-lg z-50">
                    {helpTopics.map(topic => (
                      <SelectItem key={topic.value} value={topic.value}>
                        {topic.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label htmlFor="message" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Mensaje
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Cuéntanos más sobre tu consulta..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className={getInputStyles()}
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className={`w-full gap-2 ${getButtonStyles()}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "Enviando..."
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Enviar mensaje
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="mt-8 text-center">
            <p className="text-muted-foreground mb-4">
              ¿Prefieres contactarnos directamente?
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="tel:+524421234567"
                className="inline-flex items-center justify-center gap-2 text-primary hover:underline"
              >
                <Phone className="h-4 w-4" />
                +52 442 123 4567
              </a>
              <a
                href="mailto:contacto@hasace.mx"
                className="inline-flex items-center justify-center gap-2 text-primary hover:underline"
              >
                <Mail className="h-4 w-4" />
                contacto@hasace.mx
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HelpSection;
