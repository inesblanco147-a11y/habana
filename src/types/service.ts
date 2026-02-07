export interface Service {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  discount: number;
  offerActive: boolean;
  offerDescription: string;
  category: string;
  showPrice: boolean;
}
