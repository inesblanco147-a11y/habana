import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Event } from "@/types/event";

export const useEvents = () => {
  return useQuery({
    queryKey: ["events"],
    queryFn: async (): Promise<Event[]> => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("date", { ascending: false });

      if (error) throw error;
      
      return data.map((event) => ({
        id: event.id,
        title: event.title,
        description: event.description,
        date: event.date,
        location: event.location,
        images: event.images && event.images.length > 0 
          ? event.images 
          : ["/placeholder.svg"],
        featured: event.featured || false,
        showDate: (event as any).show_date ?? true,
        showLocation: (event as any).show_location ?? true,
      }));
    }
  });
};
