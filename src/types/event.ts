export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  images: string[];
  featured?: boolean;
  showDate?: boolean;
  showLocation?: boolean;
}
