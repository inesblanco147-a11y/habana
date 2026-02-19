import { useLocation, Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

const routeLabels: Record<string, string> = {
  "/": "Inicio",
  "/nosotros": "Sobre Nosotros",
  "/servicios": "Servicios",
  "/cursos": "Cursos",
  "/productos": "Productos",
  "/productos/catalogo": "Catálogo",
  "/galeria": "Galería",
  "/cita": "Agenda tu Cita",
  "/contact": "Contáctanos",
};

const routeParents: Record<string, { href: string; label: string }> = {
  "/productos/catalogo": { href: "/productos", label: "Productos" },
};

const Breadcrumbs = () => {
  const location = useLocation();

  if (location.pathname === "/") return null;

  const label = routeLabels[location.pathname];
  if (!label) return null;

  const parent = routeParents[location.pathname];

  return (
    <nav aria-label="Breadcrumb" className="bg-muted/50 border-b">
      <div className="container mx-auto px-4 py-3">
        <ol className="flex items-center gap-2 text-sm text-muted-foreground" itemScope itemType="https://schema.org/BreadcrumbList">
          <li className="flex items-center gap-1" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <Link to="/" className="hover:text-foreground transition-colors flex items-center gap-1" itemProp="item">
              <Home className="h-3.5 w-3.5" />
              <span itemProp="name">Inicio</span>
            </Link>
            <meta itemProp="position" content="1" />
          </li>
          {parent && (
            <>
              <ChevronRight className="h-3.5 w-3.5" />
              <li className="flex items-center gap-1" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <Link to={parent.href} className="hover:text-foreground transition-colors" itemProp="item">
                  <span itemProp="name">{parent.label}</span>
                </Link>
                <meta itemProp="position" content="2" />
              </li>
            </>
          )}
          <ChevronRight className="h-3.5 w-3.5" />
          <li className="text-foreground font-medium" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <span itemProp="name">{label}</span>
            <meta itemProp="position" content={parent ? "3" : "2"} />
          </li>
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumbs;
