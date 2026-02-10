export interface Appointment {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  service: string;
  notes: string;
  googleEventId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppointmentData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  service: string;
  notes: string;
}
