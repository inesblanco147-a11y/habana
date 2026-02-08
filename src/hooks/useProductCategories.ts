import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ProductCategory {
  id: string;
  name: string;
}

export const useProductCategories = () => {
  return useQuery({
    queryKey: ["product_categories"],
    queryFn: async (): Promise<ProductCategory[]> => {
      const { data, error } = await supabase
        .from("product_categories")
        .select("id, name")
        .order("name");
      if (error) throw error;
      return data || [];
    },
  });
};
