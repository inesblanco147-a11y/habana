import { Facebook, Instagram, Linkedin, Phone, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import hasaceLogo from "@/assets/hasace-logo.jpg";

const Footer = () => {
  const quickLinks = [
    { label: "Inicio", href: "/" },
    { label: "Sobre Nosotros", href: "/nosotros" },
    { label: "Servicios", href: "/servicios" },
    { label: "Cursos", href: "/cursos" },
    { label: "Productos", href: "/productos" },
    { label: "Galería", href: "/galeria" },
    { label: "Agenda tu Cita", href: "/cita" },
  ];

  return (
    <footer className="bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Column 1: Logo & Description */}
          <div>
            <Link to="/">
              <img src={hasaceLogo} alt="HASACE - Clínica de Rehabilitación" className="h-10 w-auto lg:h-14 rounded" />
            </Link>
            <p className="text-sm text-white/70 leading-relaxed mt-4">
              Clínica especializada en Medicina Deportiva y Rehabilitación Física en Querétaro, México. Combinamos
              tecnología avanzada con un enfoque humano y holístico.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-lg mb-4 text-white font-bold uppercase tracking-wide">Enlaces Rápidos</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sm text-white/70 hover:text-hasace-red transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h4 className="text-lg mb-4 text-white font-bold uppercase tracking-wide">Contacto</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="tel:4421063235"
                  className="flex items-center gap-2 text-sm text-white/70 hover:text-hasace-red transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  442 106 3235
                </a>
                <a
                  href="tel:4422137365"
                  className="flex items-center gap-2 text-sm text-white/70 hover:text-hasace-red transition-colors mt-1"
                >
                  <Phone className="h-4 w-4" />
                  442 213 7365
                </a>
              </li>
              <li>
                <a
                  href="mailto:habanasaludcenter@hotmail.com"
                  className="flex items-center gap-2 text-sm text-white/70 hover:text-hasace-red transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  habanasaludcenter@hotmail.com
                </a>
              </li>
              <li>
                <div className="flex items-start gap-2 text-sm text-white/70">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>
                    Avenida Paseo de la Constitución # 290 local 8,
                    <br />
                    Querétaro, Mexico.
                    <br />
                    C.P. 76125
                  </span>
                </div>
              </li>
            </ul>

            {/* Social Links */}
            <div className="flex gap-3 mt-6">
              <a
                href="https://www.facebook.com/share/19SW2eWfYF/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-hasace-red/20 rounded-lg hover:bg-hasace-red transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/habana_salud_center?igsh=cDk3ZGM3MjhnZDh1"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-hasace-red/20 rounded-lg hover:bg-hasace-red transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>

              <a
                href="https://wa.me/524422137365"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-hasace-red/20 rounded-lg hover:bg-hasace-red transition-colors"
                aria-label="WhatsApp"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-white/70">
              © 2026 HASACE - Clínica de Rehabilitación Física. Todos los derechos reservados.
            </p>
            <div className="flex gap-6">
              <Link to="/politica-de-privacidad" className="text-sm text-white/70 hover:text-hasace-red transition-colors">
                Política de Privacidad
              </Link>
              <Link to="/terminos-de-servicio" className="text-sm text-white/70 hover:text-hasace-red transition-colors">
                Términos de Servicio
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
