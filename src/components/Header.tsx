import { useState } from "react";
import { Menu, X, ShoppingCart, User, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import hasaceLogo from "@/assets/hasace-logo.jpg";
const menuItems = [{
  label: "Inicio",
  href: "#"
}, {
  label: "Sobre nosotros",
  href: "#about"
}, {
  label: "Cursos",
  href: "#courses"
}, {
  label: "Tienda",
  href: "#store"
}, {
  label: "Servicios",
  href: "#services"
}, {
  label: "Galeria",
  href: "#events"
}, {
  label: "Cita",
  href: "#cita"
}, {
  label: "Contáctanos",
  href: "#contact"
}];
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleAppointmentClick = () => {
    const calendarUrl = "https://calendar.google.com/calendar/appointments/schedules/";
    window.open(calendarUrl, "_blank");
  };
  return <header className="sticky top-0 z-50 w-full shadow-lg border-b-2 border-hasace-red bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 text-primary">
        <div className="flex h-16 items-center justify-between lg:h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2">
            <img src={hasaceLogo} alt="HASACE - Clínica de Rehabilitación" className="h-10 w-auto lg:h-14 rounded" />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {menuItems.map(item => <a key={item.label} href={item.href} className="text-sm font-semibold transition-colors text-secondary">
                {item.label}
              </a>)}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <Button onClick={handleAppointmentClick} className="gap-2 bg-hasace-red hover:bg-hasace-red/90 text-white font-bold shadow-lg">
              <Calendar className="h-4 w-4" />
              Agendar Cita
            </Button>
            
            
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2" aria-label="Toggle menu">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && <div className="lg:hidden absolute top-full left-0 right-0 bg-background border-b shadow-lg animate-fade-in">
          <nav className="container mx-auto px-4 py-4">
            <div className="flex flex-col gap-2">
              {menuItems.map(item => <a key={item.label} href={item.href} className="px-4 py-3 text-foreground hover:bg-muted rounded-md transition-colors" onClick={() => setIsMenuOpen(false)}>
                  {item.label}
                </a>)}
              <hr className="my-2" />
              <Button onClick={handleAppointmentClick} className="w-full gap-2 bg-hasace-red hover:bg-hasace-red/90 text-white font-bold shadow-lg">
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
        </div>}
    </header>;
};
export default Header;