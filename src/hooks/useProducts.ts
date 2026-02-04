import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async (): Promise<Product[]> => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;
      
      return data.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: Number(product.price),
        image: product.image || "",
        category: product.category,
        inStock: product.in_stock,
        featured: product.featured || false
      }));
    }
  });
};
