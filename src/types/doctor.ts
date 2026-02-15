export interface Doctor {
  id: string;
  name: string;
  title: string;
  specialty: string;
  summary: string;
  experience: string;
  education: string[];
  certifications: string[];
  image: string;
  displayOrder: number;
}
