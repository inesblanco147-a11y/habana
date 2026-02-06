export interface ExternalDoctor {
  id: number;
  name: string;
  title: string;
  specialty: string;
  summary: string;
  experience: string;
  education: string[];
  certifications: string[];
  image: string | null;
}

export interface ExternalDoctorsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ExternalDoctor[];
}
