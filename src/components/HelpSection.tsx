import { useState } from "react";
import { Send, Phone, Mail, User, MessageSquare, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useSiteSetting } from "@/hooks/useSiteSettings";

const HelpSection = () => {
  const { toast } = useToast();
  const whatsappNumber = useSiteSetting("whatsapp_number");
  const contactPhone = useSiteSetting("contact_phone");
  const contactEmail = useSiteSetting("contact_email");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });

  const helpTopics = [
    { value: "info-servicios", label: "Información de servicios" },
    { value: "agendar-cita", label: "Agendar una cita" },
    { value: "cursos", label: "Cursos y capacitaciones" },
    { value: "productos", label: "Productos" },
    { value: "facturacion", label: "Facturación" },
    { value: "otro", label: "Otro tema" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const topicLabel = helpTopics.find((t) => t.value === formData.subject)?.label || formData.subject;
    const messageLines = [
      `*Nuevo mensaje de contacto*`,
      `*Nombre:* ${formData.name}`,
      `*Teléfono:* ${formData.phone}`,
      `*Email:* ${formData.email}`,
      `*Tema:* ${topicLabel}`,
      `*Mensaje:* ${formData.message}`,
    ];
    const whatsappMessage = encodeURIComponent(messageLines.join("\n"));
    const number = whatsappNumber || "524422137365";
    window.open(`https://wa.me/${number}?text=${whatsappMessage}`, "_blank");

    toast({ title: "Redirigiendo a WhatsApp", description: "Se abrirá WhatsApp con tu mensaje." });
    setFormData({ name: "", phone: "", email: "", subject: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section id="contact" className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl mb-4 font-bold uppercase tracking-wide text-destructive">
              ¿Cómo podemos ayudarte?
            </h2>
            <div className="w-24 h-1 bg-hasace-red mx-auto rounded-full mb-4" />
            <p className="text-muted-foreground">
              Completa el formulario y nos pondremos en contacto contigo lo antes posible
            </p>
          </div>

          <div className="p-6 lg:p-8 bg-card shadow-xl border-t-4 border-hasace-red">
            <form onSubmit={handleSubmit} className="space-y-6">
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
                    className="border-2 focus:border-hasace-red"
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
                    className="border-2 focus:border-hasace-red"
                  />
                </div>
              </div>

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
                  className="border-2 focus:border-hasace-red"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject" className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4" />
                  ¿En qué podemos ayudarte?
                </Label>
                <Select
                  value={formData.subject}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, subject: value }))}
                >
                  <SelectTrigger className="border-2 focus:border-hasace-red">
                    <SelectValue placeholder="Selecciona un tema" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border shadow-lg z-50">
                    {helpTopics.map((topic) => (
                      <SelectItem key={topic.value} value={topic.value}>
                        {topic.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

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
                  className="border-2 focus:border-hasace-red"
                />
              </div>

              <Button type="submit" className="w-full gap-2 bg-hasace-red hover:bg-hasace-red/90 font-bold">
                <Send className="h-4 w-4" />
                Enviar por WhatsApp
              </Button>
            </form>
          </div>

          <div className="mt-8 text-center">
            <p className="text-muted-foreground mb-4">¿Prefieres contactarnos directamente?</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href={`tel:${contactPhone || "+524422137365"}`}
                className="inline-flex items-center justify-center gap-2 text-hasace-red hover:underline"
              >
                <Phone className="h-4 w-4" />
                {contactPhone || "+52 4422137365"}
              </a>
              <a
                href={`mailto:${contactEmail || "contacto@gm.mx"}`}
                className="inline-flex items-center justify-center gap-2 text-hasace-red hover:underline"
              >
                <Mail className="h-4 w-4" />
                {contactEmail || "contacto@gm.mx"}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HelpSection;
