import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product, ProductSize } from "@/types/product";

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async (): Promise<Product[]> => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("display_order", { ascending: true })
        .order("name", { ascending: true });

      if (error) throw error;
      
      return data.map(product => {
        const images = ((product as any).images as string[]) || [];
        const mainImageIndex = (product as any).main_image_index ?? 0;
        const mainImage = images.length > 0 
          ? (images[mainImageIndex] || images[0]) 
          : (product.image || "");

        return {
          id: product.id,
          name: product.name,
          description: product.description,
          price: Number(product.price),
          image: mainImage,
          images,
          mainImageIndex,
          category: product.category,
          inStock: product.in_stock,
          featured: product.featured || false,
          showPrice: (product as any).show_price ?? true,
          hasSizes: (product as any).has_sizes ?? false,
          sizes: ((product as any).sizes as ProductSize[]) || [],
          displayOrder: (product as any).display_order ?? 0,
          specifications: ((product as any).specifications as Record<string, string>) || {},
        };
      });
    }
  });
};
