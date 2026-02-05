import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteSetting } from "@/hooks/useSiteSettings";
import heroImage from "@/assets/hero-rehabilitation.jpg";

const Hero = () => {
  const googleCalendarUrl = useSiteSetting("google_calendar_url");
  
  const handleAppointmentClick = () => {
    if (googleCalendarUrl) {
      const link = document.createElement('a');
      link.href = googleCalendarUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/85 via-white/75 to-white/80" />

      {/* Content */}
      <div className="relative container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-primary mb-6 animate-fade-in font-sans text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-wider drop-shadow-sm">
            Recupera tu Bienestar.
            <br />
            <span className="text-hasace-red drop-shadow-sm">
              Vive sin Límites
            </span>
          </h1>

          <p className="mb-10 animate-fade-in text-xl md:text-2xl text-primary/90 max-w-3xl font-medium mx-auto" style={{ animationDelay: "0.2s" }}>
            Somos la clínica de rehabilitación física integral para adultos y niños 
            que combina la tecnología médica avanzada con un enfoque humano y holístico 
            para tu recuperación
          </p>

          <div
            className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            <Button
              onClick={handleAppointmentClick}
              className="bg-hasace-red hover:bg-hasace-red/90 text-white px-10 py-7 text-xl font-bold shadow-2xl hover:scale-105 transition-transform border-2 border-hasace-red"
            >
              <Calendar className="mr-2 h-5 w-5" />
              Agendar Cita
            </Button>

          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-2 bg-hasace-red" />
      <div className="absolute top-20 right-10 w-32 h-32 border-4 border-primary/20 rotate-45 hidden lg:block" />
    </section>
  );
};

export default Hero;
