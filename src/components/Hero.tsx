import { Calendar, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import heroImage from "@/assets/hero-rehabilitation.jpg";

const Hero = () => {
  const { theme } = useTheme();

  const getOverlayStyles = () => {
    switch (theme) {
      case "corporate":
        return "bg-gradient-to-r from-primary/90 via-primary/80 to-primary/70";
      case "modern":
        return "bg-gradient-to-br from-slate-900/95 via-primary/85 to-slate-900/90";
      case "warm":
        return "bg-gradient-to-r from-primary/70 via-primary/50 to-transparent";
      default:
        return "bg-gradient-to-r from-primary/90 via-primary/80 to-primary/70";
    }
  };

  const getTitleStyles = () => {
    switch (theme) {
      case "corporate":
        return "font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight";
      case "modern":
        return "font-sans text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-wider";
      case "warm":
        return "font-sans text-4xl md:text-5xl lg:text-6xl font-semibold tracking-normal";
      default:
        return "font-serif text-4xl md:text-5xl lg:text-6xl font-bold";
    }
  };

  const getSubtitleStyles = () => {
    switch (theme) {
      case "corporate":
        return "text-lg md:text-xl text-white/90 max-w-2xl";
      case "modern":
        return "text-xl md:text-2xl text-white/95 max-w-3xl font-medium";
      case "warm":
        return "text-lg md:text-xl text-white/85 max-w-2xl leading-relaxed";
      default:
        return "text-lg md:text-xl text-white/90 max-w-2xl";
    }
  };

  const getCtaButtonStyles = () => {
    switch (theme) {
      case "corporate":
        return "bg-destructive hover:bg-destructive/90 text-white px-8 py-6 text-lg";
      case "modern":
        return "bg-hasace-red hover:bg-hasace-red/90 text-white px-10 py-7 text-xl font-bold shadow-2xl hover:scale-105 transition-transform";
      case "warm":
        return "bg-hasace-green hover:bg-hasace-green/90 text-white px-8 py-6 text-lg rounded-full";
      default:
        return "bg-destructive hover:bg-destructive/90 text-white px-8 py-6 text-lg";
    }
  };

  const getSecondaryButtonStyles = () => {
    switch (theme) {
      case "corporate":
        return "border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-6 text-lg";
      case "modern":
        return "border-2 border-white text-white hover:bg-white hover:text-slate-900 px-10 py-7 text-xl font-bold";
      case "warm":
        return "border-2 border-white/70 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-full";
      default:
        return "border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-6 text-lg";
    }
  };

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
      <div className={`absolute inset-0 ${getOverlayStyles()}`} />

      {/* Content */}
      <div className="relative container mx-auto px-4 py-20">
        <div className={`max-w-4xl ${theme === "warm" ? "mx-0" : "mx-auto text-center"}`}>
          <h1 className={`text-white mb-6 animate-fade-in ${getTitleStyles()}`}>
            Recupera tu Bienestar.
            <br />
            <span className={theme === "modern" ? "text-hasace-red" : ""}>
              Vive sin Límites
            </span>
          </h1>

          <p className={`mb-10 animate-fade-in-up ${getSubtitleStyles()}`} style={{ animationDelay: "0.2s" }}>
            Somos la clínica de rehabilitación física integral para adultos y niños 
            que combina la tecnología médica avanzada con un enfoque humano y holístico 
            para tu recuperación
          </p>

          <div
            className={`flex flex-col sm:flex-row gap-4 animate-fade-in-up ${
              theme === "warm" ? "" : "justify-center"
            }`}
            style={{ animationDelay: "0.4s" }}
          >
            <Button
              onClick={handleAppointmentClick}
              className={getCtaButtonStyles()}
            >
              <Calendar className="mr-2 h-5 w-5" />
              Agendar Cita
            </Button>
            <Button
              variant="outline"
              className={getSecondaryButtonStyles()}
            >
              Conoce Más
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative Elements for Modern Theme */}
      {theme === "modern" && (
        <>
          <div className="absolute bottom-0 left-0 w-full h-2 bg-hasace-red" />
          <div className="absolute top-20 right-10 w-32 h-32 border-4 border-white/20 rotate-45 hidden lg:block" />
        </>
      )}

      {/* Decorative Elements for Warm Theme */}
      {theme === "warm" && (
        <div className="absolute bottom-10 right-10 hidden lg:flex flex-col gap-2 items-end">
          <div className="w-20 h-1 bg-hasace-green/60" />
          <div className="w-16 h-1 bg-hasace-green/40" />
          <div className="w-12 h-1 bg-hasace-green/20" />
        </div>
      )}
    </section>
  );
};

export default Hero;
