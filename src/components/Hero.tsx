import { Calendar, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-rehabilitation.jpg";

const Hero = () => {
  const handleAppointmentClick = () => {
    const calendarUrl = "https://calendar.google.com/calendar/appointments/schedules/";
    window.open(calendarUrl, "_blank");
  };

  return (
    <section className="relative min-h-[90vh] flex items-center">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-primary/85 to-slate-900/90" />

      {/* Content */}
      <div className="relative container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-white mb-6 animate-fade-in font-sans text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-wider">
            Recupera tu Bienestar.
            <br />
            <span className="text-hasace-red">
              Vive sin Límites
            </span>
          </h1>

          <p className="mb-10 animate-fade-in text-xl md:text-2xl text-white/95 max-w-3xl font-medium mx-auto" style={{ animationDelay: "0.2s" }}>
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
              className="bg-hasace-red hover:bg-hasace-red/90 text-white px-10 py-7 text-xl font-bold shadow-2xl hover:scale-105 transition-transform"
            >
              <Calendar className="mr-2 h-5 w-5" />
              Agendar Cita
            </Button>
            <Button
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-slate-900 px-10 py-7 text-xl font-bold"
            >
              Conoce Más
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-2 bg-hasace-red" />
      <div className="absolute top-20 right-10 w-32 h-32 border-4 border-white/20 rotate-45 hidden lg:block" />
    </section>
  );
};

export default Hero;
