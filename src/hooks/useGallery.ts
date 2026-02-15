import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { GalleryItem } from "@/types/gallery";

export const useGallery = () => {
  return useQuery({
    queryKey: ["gallery"],
    queryFn: async (): Promise<GalleryItem[]> => {
      const { data, error } = await supabase
        .from("gallery")
        .select("*")
        .order("display_order", { ascending: true })
        .order("title", { ascending: true });

      if (error) throw error;

      return data.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        images: item.images || [],
        displayOrder: (item as any).display_order ?? 0,
      }));
    },
  });
};
