import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Service } from "@/types/service";

export const useServices = () => {
  return useQuery({
    queryKey: ["services"],
    queryFn: async (): Promise<Service[]> => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      return data.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        image: item.image || "",
        price: Number(item.price),
        discount: Number(item.discount) || 0,
        offerActive: item.offer_active || false,
        offerDescription: item.offer_description || "",
        category: item.category,
        showPrice: (item as any).show_price ?? true,
      }));
    },
  });
};
