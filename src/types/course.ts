export type CourseModality = "presencial" | "online" | "híbrido";
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
  showDate: boolean;
  showDuration: boolean;
  showParticipants: boolean;
  showObjectives: boolean;
  showIncludes: boolean;
  showPrice: boolean;
  showLocation: boolean;
  displayOrder: number;
}

export interface PastCourse {
  id: string;
  title: string;
  description: string;
  image: string;
  modality: CourseModality;
  date: string;
  participants: number;
  instructor: string;
  galleryImages?: string[];
  displayOrder: number;
}
