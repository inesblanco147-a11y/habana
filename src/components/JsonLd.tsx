import { useLocation } from "react-router-dom";

const businessJsonLd = {
  "@context": "https://schema.org",
  "@type": ["MedicalBusiness", "LocalBusiness"],
  "name": "Habana Salud Center, HASACE",
  "description": "Centro especializado en Rehabilitación Física Integral en Querétaro, México",
  "url": "https://hasace.mx",
  "telephone": ["+52-442-106-3235", "+52-442-213-7365"],
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Avenida Paseo de la Constitución # 290 local 8",
    "addressLocality": "Querétaro",
    "addressRegion": "Querétaro",
    "postalCode": "76125",
    "addressCountry": "MX"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "20.5888",
    "longitude": "-100.3899"
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "20:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Saturday",
      "opens": "09:00",
      "closes": "18:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Sunday",
      "opens": "10:00",
      "closes": "16:00"
    }
  ],
  "priceRange": "$$",
  "medicalSpecialty": ["SportsOrthopedic", "PhysicalMedicine"],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Servicios de Rehabilitación",
    "itemListElement": [
      { "@type": "Offer", "itemOffered": { "@type": "MedicalProcedure", "name": "Consulta médica con Especialista" } },
      { "@type": "Offer", "itemOffered": { "@type": "MedicalProcedure", "name": "Rehabilitación" } },
      { "@type": "Offer", "itemOffered": { "@type": "MedicalProcedure", "name": "Masaje" } },
      { "@type": "Offer", "itemOffered": { "@type": "MedicalProcedure", "name": "Visitas al hogar" } },
      { "@type": "Offer", "itemOffered": { "@type": "MedicalProcedure", "name": "Electroterapia" } },
      { "@type": "Offer", "itemOffered": { "@type": "MedicalProcedure", "name": "Ultrasonido diagnóstico musculoesquelético" } },
      { "@type": "Offer", "itemOffered": { "@type": "MedicalProcedure", "name": "Electrocardiograma" } },
      { "@type": "Offer", "itemOffered": { "@type": "MedicalProcedure", "name": "Laboratorio Clínico" } },
      { "@type": "Offer", "itemOffered": { "@type": "MedicalProcedure", "name": "Nutrición" } },
      { "@type": "Offer", "itemOffered": { "@type": "MedicalProcedure", "name": "Psicología" } },
      { "@type": "Offer", "itemOffered": { "@type": "MedicalProcedure", "name": "Consulta de seguimiento" } },
      { "@type": "Offer", "itemOffered": { "@type": "MedicalProcedure", "name": "Asistencia de enfermería" } }
    ]
  }
};

const JsonLd = () => {
  const location = useLocation();

  const schemas: object[] = [businessJsonLd];

  // Add page-specific schemas
  if (location.pathname === "/servicios") {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Service",
      "provider": { "@type": "MedicalBusiness", "name": "Habana Salud Center, HASACE" },
      "serviceType": "Rehabilitación Física Integral",
      "areaServed": { "@type": "City", "name": "Querétaro" }
    });
  }

  if (location.pathname === "/galeria") {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Event",
      "organizer": { "@type": "Organization", "name": "Habana Salud Center, HASACE" },
      "location": {
        "@type": "Place",
        "name": "Habana Salud Center, HASACE",
        "address": "Avenida Paseo de la Constitución # 290 local 8, Querétaro, Mexico"
      }
    });
  }

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
};

export default JsonLd;
