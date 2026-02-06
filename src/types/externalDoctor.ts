export interface ExternalDoctor {
  id: number;
  nombre: string;
  title: string;
  specialty: string;
  especialidad: string;
  especialidad2: string;
  formacionAcademica: string;
  description: string;
  imagen: string | null;
}

export interface ExternalDoctorsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ExternalDoctor[];
}
