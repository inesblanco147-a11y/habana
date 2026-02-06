export interface ExternalDoctor {
  id: number;
  name: string;
  nombre: string;
  title: string;
  specialty: string;
  especialidad: string;
  especialidad2: string;
  summary: string;
  experience: string;
  education: string[] | string;
  certifications: string[] | string;
  formacionAcademica: string;
  description: string;
  image: string | null;
  imagen: string | null;
}

export interface ExternalDoctorsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ExternalDoctor[];
}
