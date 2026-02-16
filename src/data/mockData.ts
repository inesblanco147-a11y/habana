import { Course, PastCourse } from "@/types/course";
import { Product } from "@/types/product";
import { Doctor } from "@/types/doctor";

export const doctors: Doctor[] = [
  {
    id: "doc1",
    name: "Dr. Carlos Mendoza",
    title: "Director Médico",
    specialty: "Medicina Deportiva",
    summary: "Especialista en medicina deportiva con más de 15 años de experiencia en rehabilitación de atletas de alto rendimiento.",
    experience: "15 años de experiencia tratando atletas profesionales de fútbol, básquetbol y atletismo. Ha sido médico de equipos de primera división.",
    education: [
      "Médico Cirujano - UNAM",
      "Especialidad en Medicina del Deporte - Instituto Nacional de Rehabilitación",
      "Maestría en Ciencias del Deporte - Universidad de Barcelona"
    ],
    certifications: [
      "Certificación en Medicina Deportiva - CONADE",
      "Fellow American College of Sports Medicine",
      "Certificación en Terapia de Ondas de Choque"
    ],
    image: "",
    displayOrder: 0
  },
  {
    id: "doc2",
    name: "Dra. María González",
    title: "Especialista en Rehabilitación",
    specialty: "Rehabilitación Neurológica",
    summary: "Experta en neurorehabilitación con enfoque en pacientes con lesiones cerebrales y medulares.",
    experience: "12 años especializándose en rehabilitación de pacientes con daño neurológico, incluyendo EVC, lesiones medulares y Parkinson.",
    education: [
      "Médico Cirujano - UAQ",
      "Especialidad en Medicina de Rehabilitación - Hospital Español",
      "Subespecialidad en Neurorehabilitación - Hospital ABC"
    ],
    certifications: [
      "Certificación en Terapia Bobath",
      "Certificación en Facilitación Neuromuscular Propioceptiva",
      "Diplomado en Neuroplasticidad"
    ],
    image: "",
    displayOrder: 1
  },
  {
    id: "doc3",
    name: "Lic. Ana Martínez",
    title: "Fisioterapeuta Senior",
    specialty: "Rehabilitación Pediátrica",
    summary: "Fisioterapeuta especializada en el desarrollo motor infantil y tratamiento de niños con necesidades especiales.",
    experience: "10 años trabajando con niños con parálisis cerebral, síndrome de Down, autismo y retrasos del desarrollo motor.",
    education: [
      "Licenciatura en Fisioterapia - UNAM",
      "Especialidad en Fisioterapia Pediátrica - Hospital Infantil de México",
      "Diplomado en Estimulación Temprana"
    ],
    certifications: [
      "Certificación en Método Vojta",
      "Certificación en Integración Sensorial",
      "Especialista en Hidroterapia Pediátrica"
    ],
    image: "",
    displayOrder: 2
  }
];

export const upcomingCourses: Course[] = [
  {
    id: "1",
    title: "Técnicas Avanzadas de Rehabilitación Neurológica",
    description: "Aprende las últimas técnicas en neurorehabilitación para pacientes con lesiones cerebrales y medulares.",
    image: "",
    modality: "presencial",
    availability: "disponible",
    date: "2025-03-15",
    duration: "24 horas",
    location: "HASACE, Querétaro",
    price: 4500,
    instructor: "Dr. Carlos Mendoza",
    objectives: ["Dominar técnicas de facilitación neuromuscular", "Aplicar protocolos de neuroplasticidad", "Evaluar y tratar pacientes neurológicos", "Diseñar programas de rehabilitación personalizados"],
    includes: ["Material didáctico digital", "Certificado con validez oficial", "Coffee breaks", "Práctica supervisada"],
    maxParticipants: 25,
    currentParticipants: 18,
    showDate: true, showDuration: true, showParticipants: true, showObjectives: true, showIncludes: true, showPrice: true, showLocation: true, displayOrder: 0
  },
  {
    id: "2",
    title: "Rehabilitación Deportiva: De la Lesión al Alto Rendimiento",
    description: "Curso integral sobre prevención, tratamiento y recuperación de lesiones deportivas.",
    image: "",
    modality: "híbrido",
    availability: "ultimos-lugares",
    date: "2025-04-20",
    duration: "40 horas",
    location: "HASACE + Online",
    price: 6800,
    instructor: "Dra. María González",
    objectives: ["Evaluar lesiones deportivas comunes", "Aplicar técnicas de vendaje funcional", "Diseñar programas de retorno al deporte", "Implementar estrategias de prevención"],
    includes: ["Kit de vendaje profesional", "Acceso a plataforma online por 6 meses", "Certificado internacional", "Mentoría post-curso"],
    maxParticipants: 20,
    currentParticipants: 19,
    showDate: true, showDuration: true, showParticipants: true, showObjectives: true, showIncludes: true, showPrice: true, showLocation: true, displayOrder: 1
  },
  {
    id: "3",
    title: "Introducción a la Terapia Manual",
    description: "Fundamentos de la terapia manual y técnicas básicas de movilización articular.",
    image: "",
    modality: "online",
    availability: "disponible",
    date: "2025-05-10",
    duration: "16 horas",
    location: "Plataforma Virtual",
    price: 2500,
    instructor: "Lic. Roberto Sánchez",
    objectives: ["Conocer los principios de la terapia manual", "Realizar evaluación articular básica", "Aplicar técnicas de movilización grado I-II"],
    includes: ["Videos grabados de técnicas", "Manual en PDF", "Certificado digital", "Sesión de dudas en vivo"],
    maxParticipants: 50,
    currentParticipants: 32,
    showDate: true, showDuration: true, showParticipants: true, showObjectives: true, showIncludes: true, showPrice: true, showLocation: true, displayOrder: 2
  },
  {
    id: "4",
    title: "Rehabilitación Pediátrica Integral",
    description: "Abordaje terapéutico especializado para niños con alteraciones del desarrollo.",
    image: "",
    modality: "presencial",
    availability: "agotado",
    date: "2025-06-01",
    duration: "32 horas",
    location: "HASACE, Querétaro",
    price: 5500,
    instructor: "Dra. Ana Martínez",
    objectives: ["Evaluar el desarrollo psicomotor", "Aplicar técnicas de estimulación temprana", "Tratar alteraciones del tono muscular", "Involucrar a la familia en el tratamiento"],
    includes: ["Material de evaluación pediátrica", "Certificado avalado por SEP", "Comidas incluidas", "Acceso a casos clínicos"],
    maxParticipants: 15,
    currentParticipants: 15,
    showDate: true, showDuration: true, showParticipants: true, showObjectives: true, showIncludes: true, showPrice: true, showLocation: true, displayOrder: 3
  }
];

export const pastCourses: PastCourse[] = [
  {
    id: "p1",
    title: "Electroterapia Aplicada",
    description: "Uso de corrientes eléctricas en rehabilitación muscular y control del dolor.",
    image: "",
    modality: "presencial",
    date: "2024-11-15",
    participants: 22,
    instructor: "Dr. Eduardo Ramírez",
    displayOrder: 0
  },
  {
    id: "p2",
    title: "Kinesiotaping Nivel Avanzado",
    description: "Técnicas avanzadas de vendaje neuromuscular para diversas patologías.",
    image: "",
    modality: "híbrido",
    date: "2024-10-20",
    participants: 28,
    instructor: "Dra. Laura Vega",
    displayOrder: 0
  },
  {
    id: "p3",
    title: "Rehabilitación Respiratoria Post-COVID",
    description: "Estrategias de recuperación pulmonar para pacientes post-COVID.",
    image: "",
    modality: "online",
    date: "2024-09-08",
    participants: 45,
    instructor: "Dr. Miguel Ángel Torres",
    displayOrder: 0
  }
];

export const products: Product[] = [
  {
    id: "prod1", name: "Banda Elástica de Resistencia - Set Completo",
    description: "Set de 5 bandas elásticas con diferentes niveles de resistencia para rehabilitación y fortalecimiento muscular.",
    price: 450, image: "", category: "Equipamiento", inStock: true, featured: true,
    showPrice: true, hasSizes: false, sizes: [], displayOrder: 0
  },
  {
    id: "prod2", name: "Rodillera Ortopédica con Soporte Lateral",
    description: "Rodillera de neopreno con varillas laterales para estabilización de rodilla en lesiones ligamentarias.",
    price: 890, image: "", category: "Ortopedia", inStock: true, featured: true,
    showPrice: true, hasSizes: false, sizes: [], displayOrder: 1
  },
  {
    id: "prod3", name: "Pelota de Ejercicio 65cm",
    description: "Pelota de ejercicio anti-explosión ideal para rehabilitación, fortalecimiento y mejora del equilibrio.",
    price: 380, image: "", category: "Equipamiento", inStock: true,
    showPrice: true, hasSizes: false, sizes: [], displayOrder: 2
  },
  {
    id: "prod4", name: "Muñequera con Soporte de Pulgar",
    description: "Muñequera ajustable con férula de pulgar para lesiones de muñeca y síndrome del túnel carpiano.",
    price: 520, image: "", category: "Ortopedia", inStock: false,
    showPrice: true, hasSizes: false, sizes: [], displayOrder: 3
  },
  {
    id: "prod5", name: "Kit de Masaje Miofascial",
    description: "Kit completo con rodillo de espuma, bola de lacrosse y palo de masaje para liberación miofascial.",
    price: 680, image: "", category: "Terapia Manual", inStock: true, featured: true,
    showPrice: true, hasSizes: false, sizes: [], displayOrder: 4
  },
  {
    id: "prod6", name: "Electro Estimulador TENS Portátil",
    description: "Dispositivo TENS de uso doméstico para control del dolor con 8 programas preestablecidos.",
    price: 1250, image: "", category: "Electroterapia", inStock: true,
    showPrice: true, hasSizes: false, sizes: [], displayOrder: 5
  },
  {
    id: "prod7", name: "Tobillera Estabilizadora Premium",
    description: "Tobillera de alta gama con sistema de cordones y soporte en 8 para esguinces de tobillo.",
    price: 750, image: "", category: "Ortopedia", inStock: true,
    showPrice: true, hasSizes: false, sizes: [], displayOrder: 6
  },
  {
    id: "prod8", name: "Disco de Balance para Propiocepción",
    description: "Disco inflable para entrenamiento propioceptivo y rehabilitación de equilibrio.",
    price: 290, image: "", category: "Equipamiento", inStock: true,
    showPrice: true, hasSizes: false, sizes: [], displayOrder: 7
  }
];
