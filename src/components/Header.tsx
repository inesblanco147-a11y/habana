import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import hasaceLogo from "@/assets/hasace-logo.jpg";
import { useSiteSetting } from "@/hooks/useSiteSettings";

const menuItems = [
  { label: "Inicio", href: "/" },
  { label: "Sobre nosotros", href: "/nosotros" },
  { label: "Cursos", href: "/cursos" },
  { label: "Productos", href: "/productos" },
  { label: "Servicios", href: "/servicios" },
  { label: "Galería", href: "/galeria" },
  { label: "Cita", href: "/cita" },
  { label: "Contáctanos", href: "/contact" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const contactPhone = useSiteSetting("contact_phone") || "4421063235";
  const phoneCleaned = contactPhone.replace(/[\s\-\(\)\+]/g, "");
  const telHref = `tel:${phoneCleaned.startsWith("52") ? "+" : "+52"}${phoneCleaned}`;

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    if (href.startsWith("/#")) return location.pathname === "/" && location.hash === href.replace("/", "");
    return location.pathname === href || location.pathname.startsWith(href + "/");
  };

  const handleClick = (href: string) => {
    setIsMenuOpen(false);
    if (href === "/#contact" && location.pathname === "/") {
      const el = document.getElementById("contact");
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const renderLink = (item: { label: string; href: string }, className: string) => {
    if (item.href.startsWith("/#")) {
      if (location.pathname === "/") {
        return (
          <a
            key={item.label}
            href={item.href.replace("/", "")}
            className={className}
            onClick={() => handleClick(item.href)}
          >
            {item.label}
          </a>
        );
      }
      return (
        <Link key={item.label} to={item.href} className={className} onClick={() => setIsMenuOpen(false)}>
          {item.label}
        </Link>
      );
    }
    return (
      <Link key={item.label} to={item.href} className={className} onClick={() => setIsMenuOpen(false)}>
        {item.label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full shadow-lg border-b-2 border-hasace-red bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 text-primary">
        <div className="flex h-16 items-center justify-between lg:h-20">
          <Link to="/" className="flex items-center gap-2">
            <img src={hasaceLogo} alt="HASACE - Clínica de Rehabilitación" className="h-10 w-auto lg:h-14 rounded" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {menuItems.map((item) =>
              renderLink(
                item,
                `text-sm font-semibold transition-colors ${isActive(item.href) ? "text-hasace-red" : "text-secondary hover:text-hasace-red"}`,
              ),
            )}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <a
              href={telHref}
              aria-label="Llamar"
              className="flex items-center gap-2 bg-hasace-red text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-hasace-red/90 active:scale-95 transition-all shadow"
            >
              <Phone className="h-4 w-4 flex-shrink-0" />
              <span>{contactPhone}</span>
            </a>
          </div>

          {/* Mobile: teléfono + botón hamburguesa */}
          <div className="flex items-center gap-2 lg:hidden">
            <a
              href={telHref}
              aria-label="Llamar"
              className="flex items-center justify-center w-9 h-9 rounded-full bg-hasace-red text-white hover:bg-hasace-red/90 active:scale-95 transition-all"
            >
              <Phone className="h-4 w-4" />
            </a>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white p-2"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:absolute top-full left-0 right-0 bg-background border-b shadow-lg animate-fade-in">
          <nav className="container mx-auto px-4 py-4">
            <div className="flex flex-col gap-2">
              {menuItems.map((item) =>
                renderLink(
                  item,
                  `px-4 py-3 rounded-md transition-colors ${isActive(item.href) ? "bg-hasace-red/10 text-hasace-red font-bold" : "text-foreground hover:bg-muted"}`,
                ),
              )}
              <hr className="my-2" />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
