import { useState } from "react";
import { Send, Phone, Mail, User, MessageSquare, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
const HelpSection = () => {
  const {
    toast
  } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: ""
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: "Mensaje enviado",
      description: "Nos pondremos en contacto contigo pronto."
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
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const helpTopics = [{
    value: "info-servicios",
    label: "Información de servicios"
  }, {
    value: "agendar-cita",
    label: "Agendar una cita"
  }, {
    value: "cursos",
    label: "Cursos y capacitaciones"
  }, {
    value: "productos",
    label: "Productos y equipamiento"
  }, {
    value: "facturacion",
    label: "Facturación"
  }, {
    value: "otro",
    label: "Otro tema"
  }];
  return <section id="contact" className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl mb-4 font-bold uppercase tracking-wide text-destructive">
              ¿Cómo podemos ayudarte?
            </h2>
            <div className="w-24 h-1 bg-hasace-red mx-auto rounded-full mb-4" />
            <p className="text-muted-foreground">
              Completa el formulario y nos pondremos en contacto contigo lo antes posible
            </p>
          </div>

          {/* Form Card */}
          <div className="p-6 lg:p-8 bg-card shadow-xl border-t-4 border-hasace-red">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name & Phone Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Nombre completo
                  </Label>
                  <Input id="name" name="name" placeholder="Tu nombre" value={formData.name} onChange={handleChange} required className="border-2 focus:border-hasace-red" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Teléfono
                  </Label>
                  <Input id="phone" name="phone" type="tel" placeholder="+52 442 123 4567" value={formData.phone} onChange={handleChange} required className="border-2 focus:border-hasace-red" />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Correo electrónico
                </Label>
                <Input id="email" name="email" type="email" placeholder="tu@email.com" value={formData.email} onChange={handleChange} required className="border-2 focus:border-hasace-red" />
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <Label htmlFor="subject" className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4" />
                  ¿En qué podemos ayudarte?
                </Label>
                <Select value={formData.subject} onValueChange={value => setFormData(prev => ({
                ...prev,
                subject: value
              }))}>
                  <SelectTrigger className="border-2 focus:border-hasace-red">
                    <SelectValue placeholder="Selecciona un tema" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border shadow-lg z-50">
                    {helpTopics.map(topic => <SelectItem key={topic.value} value={topic.value}>
                        {topic.label}
                      </SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label htmlFor="message" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Mensaje
                </Label>
                <Textarea id="message" name="message" placeholder="Cuéntanos más sobre tu consulta..." value={formData.message} onChange={handleChange} required rows={5} className="border-2 focus:border-hasace-red" />
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full gap-2 bg-hasace-red hover:bg-hasace-red/90 font-bold" disabled={isSubmitting}>
                {isSubmitting ? "Enviando..." : <>
                    <Send className="h-4 w-4" />
                    Enviar mensaje
                  </>}
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="mt-8 text-center">
            <p className="text-muted-foreground mb-4">
              ¿Prefieres contactarnos directamente?
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href="tel:+524421234567" className="inline-flex items-center justify-center gap-2 text-hasace-red hover:underline">
                <Phone className="h-4 w-4" />
                +52 442 123 4567
              </a>
              <a href="mailto:contacto@hasace.mx" className="inline-flex items-center justify-center gap-2 text-hasace-red hover:underline">
                <Mail className="h-4 w-4" />
                contacto@hasace.mx
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default HelpSection;
