export interface ProductSize {
  name: string;
  inStock: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  images: string[];
  mainImageIndex: number;
  category: string;
  inStock: boolean;
  featured?: boolean;
  showPrice: boolean;
  hasSizes: boolean;
  sizes: ProductSize[];
  displayOrder: number;
  specifications: Record<string, string>;
}
