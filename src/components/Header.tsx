import { useState } from "react";
import { Menu, X, ShoppingCart, User, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme, DesignTheme } from "@/contexts/ThemeContext";
import hasaceLogo from "@/assets/hasace-logo.jpg";

const menuItems = [
  { label: "Inicio", href: "#" },
  { label: "Sobre nosotros", href: "#about" },
  { label: "Cursos", href: "#courses" },
  { label: "Ayuda", href: "#help" },
  { label: "Cita", href: "#appointment" },
  { label: "Tienda", href: "#store" },
  { label: "Contáctanos", href: "#contact" },
  { label: "Eventos", href: "#events" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme } = useTheme();

  const getHeaderStyles = () => {
    switch (theme) {
      case "corporate":
        return "bg-primary text-primary-foreground";
      case "modern":
        return "bg-background text-foreground shadow-lg border-b-2 border-hasace-red";
      case "warm":
        return "bg-background text-foreground shadow-md";
      default:
        return "bg-primary text-primary-foreground";
    }
  };

  const getNavLinkStyles = () => {
    switch (theme) {
      case "corporate":
        return "text-primary-foreground/80 hover:text-primary-foreground transition-colors";
      case "modern":
        return "text-foreground hover:text-hasace-red font-semibold transition-colors";
      case "warm":
        return "text-muted-foreground hover:text-hasace-green transition-colors";
      default:
        return "text-primary-foreground/80 hover:text-primary-foreground";
    }
  };

  const getCtaButtonStyles = () => {
    switch (theme) {
      case "corporate":
        return "bg-destructive hover:bg-destructive/90 text-destructive-foreground";
      case "modern":
        return "bg-hasace-red hover:bg-hasace-red/90 text-white font-bold shadow-lg";
      case "warm":
        return "bg-hasace-green hover:bg-hasace-green/90 text-white";
      default:
        return "bg-destructive hover:bg-destructive/90 text-destructive-foreground";
    }
  };

  const getLogoStyles = () => {
    switch (theme) {
      case "corporate":
        return "brightness-0 invert";
      case "modern":
      case "warm":
        return "";
      default:
        return "";
    }
  };

  const handleAppointmentClick = () => {
    // Placeholder for Google Calendar integration
    const calendarUrl = "https://calendar.google.com/calendar/appointments/schedules/";
    window.open(calendarUrl, "_blank");
  };

  return (
    <header className={`sticky top-0 z-50 w-full ${getHeaderStyles()}`}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between lg:h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2">
            <img
              src={hasaceLogo}
              alt="HASACE - Clínica de Rehabilitación"
              className={`h-10 w-auto lg:h-14 rounded ${getLogoStyles()}`}
            />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {menuItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`text-sm ${getNavLinkStyles()}`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <Button
              onClick={handleAppointmentClick}
              className={`gap-2 ${getCtaButtonStyles()}`}
            >
              <Calendar className="h-4 w-4" />
              Agendar Cita
            </Button>
            <button className={`p-2 ${getNavLinkStyles()}`}>
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Carrito (0)</span>
            </button>
            <button className={`p-2 ${getNavLinkStyles()}`}>
              <User className="h-5 w-5" />
              <span className="sr-only">Login</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-background border-b shadow-lg animate-fade-in">
          <nav className="container mx-auto px-4 py-4">
            <div className="flex flex-col gap-2">
              {menuItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="px-4 py-3 text-foreground hover:bg-muted rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <hr className="my-2" />
              <Button
                onClick={handleAppointmentClick}
                className={`w-full gap-2 ${getCtaButtonStyles()}`}
              >
                <Calendar className="h-4 w-4" />
                Agendar Cita
              </Button>
              <div className="flex gap-4 px-4 py-2">
                <button className="flex items-center gap-2 text-muted-foreground">
                  <ShoppingCart className="h-5 w-5" />
                  Carrito (0)
                </button>
                <button className="flex items-center gap-2 text-muted-foreground">
                  <User className="h-5 w-5" />
                  Login
                </button>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
