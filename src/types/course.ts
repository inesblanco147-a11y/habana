export type CourseModality = "presencial" | "online" | "hibrido";
export type CourseAvailability = "disponible" | "ultimos-lugares" | "agotado";

export interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  modality: CourseModality;
  availability: CourseAvailability;
  date: string;
  duration: string;
  location: string;
  price: number;
  instructor: string;
  objectives: string[];
  includes: string[];
  maxParticipants: number;
  currentParticipants: number;
}

export interface PastCourse {
  id: string;
  title: string;
  description: string;
  image: string;
  modality: CourseModality;
  date: string;
  participants: number;
  rating: number;
  testimonial: string;
  testimonialAuthor: string;
  instructor: string;
  galleryImages?: string[];
}
