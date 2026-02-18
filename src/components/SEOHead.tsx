import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface SEOConfig {
  title: string;
  description: string;
  keywords: string;
  canonical: string;
  ogImage?: string;
}

const seoConfig: Record<string, SEOConfig> = {
  "/": {
    title: "Habana Salud Center, HASACE - Centro de Rehabilitación Física Integral en Querétaro | Fisioterapia, Rehabilitación Profesional",
    description: "Centro especializado en Medicina Deportiva y Rehabilitación Física en Querétaro, México. Recupera tu bienestar con tecnología avanzada y enfoque humano.",
    keywords: "rehabilitación física, medicina deportiva, fisioterapia, Querétaro, terapia física, rehabilitación pediátrica, HASACE",
    canonical: "https://hasace.mx/",
  },
  "/nosotros": {
    title: "Nosotros - Habana Salud Center, HASACE Centro de Rehabilitación | Misión y Visión",
    description: "Conoce la misión, visión y equipo médico de Habana Salud Center HASACE. Rehabilitación física integral en Querétaro con profesionales certificados.",
    keywords: "equipo médico, misión, visión, rehabilitación Querétaro, fisioterapeutas certificados, HASACE",
    canonical: "https://hasace.mx/nosotros",
  },
  "/servicios": {
    title: "Servicios de Rehabilitación Física | Habana Salud Center, HASACE Querétaro",
    description: "Consulta médica, rehabilitación, masaje, electroterapia, ultrasonido, nutrición, psicología y más. Servicios integrales en Querétaro.",
    keywords: "servicios rehabilitación, consulta médica, electroterapia, ultrasonido, nutrición, psicología, Querétaro, HASACE",
    canonical: "https://hasace.mx/servicios",
  },
  "/cursos": {
    title: "Cursos y Capacitaciones en Rehabilitación | Habana Salud Center, HASACE",
    description: "Cursos especializados en rehabilitación física y medicina deportiva. Capacitaciones presenciales, online e híbridas en Querétaro.",
    keywords: "cursos rehabilitación, capacitaciones medicina deportiva, formación fisioterapia, Querétaro, HASACE",
    canonical: "https://hasace.mx/cursos",
  },
  "/productos": {
    title: "Productos de Rehabilitación y Ortopedia | Habana Salud Center, HASACE",
    description: "Productos y equipamiento de rehabilitación de alta calidad. Ortopedia, equipos terapéuticos y accesorios de recuperación.",
    keywords: "productos rehabilitación, ortopedia, equipos terapéuticos, Querétaro, HASACE",
    canonical: "https://hasace.mx/productos",
  },
  "/galeria": {
    title: "Galería de Eventos y Actividades | Habana Salud Center, HASACE",
    description: "Galería de fotos y videos de eventos, actividades y momentos en Habana Salud Center HASACE Querétaro.",
    keywords: "galería eventos, actividades rehabilitación, fotos clínica, Querétaro, HASACE",
    canonical: "https://hasace.mx/galeria",
  },
  "/cita": {
    title: "Agenda tu Cita de Rehabilitación | Habana Salud Center, HASACE Querétaro",
    description: "Agenda tu cita de rehabilitación física en línea. Consulta médica, fisioterapia y más servicios disponibles en Querétaro.",
    keywords: "agendar cita, consulta rehabilitación, cita fisioterapia, Querétaro, HASACE",
    canonical: "https://hasace.mx/cita",
  },
  "/contact": {
    title: "Contáctanos | Habana Salud Center, HASACE Querétaro",
    description: "Contáctanos para agendar tu cita o resolver tus dudas. Centro de Rehabilitación Física en Querétaro, México.",
    keywords: "contacto HASACE, contacto rehabilitación Querétaro, fisioterapia contacto",
    canonical: "https://hasace.mx/contact",
  },
};

const SEOHead = () => {
  const location = useLocation();
  const config = seoConfig[location.pathname] || seoConfig["/"];

  useEffect(() => {
    // Title
    document.title = config.title;

    // Helper to set/create meta tags
    const setMeta = (attr: string, attrValue: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${attrValue}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, attrValue);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("name", "description", config.description);
    setMeta("name", "keywords", config.keywords);

    // Open Graph
    setMeta("property", "og:title", config.title);
    setMeta("property", "og:description", config.description);
    setMeta("property", "og:url", config.canonical);
    setMeta("property", "og:type", "website");
    setMeta("property", "og:site_name", "Habana Salud Center, HASACE");
    setMeta("property", "og:locale", "es_MX");
    setMeta("property", "og:image", config.ogImage || "https://hasace.mx/og-image.png");

    // Twitter
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", config.title);
    setMeta("name", "twitter:description", config.description);
    setMeta("name", "twitter:image", config.ogImage || "https://hasace.mx/og-image.png");

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", config.canonical);
  }, [config]);

  return null;
};

export default SEOHead;
