import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Event } from "@/types/event";

// Import fallback images
import event1 from "@/assets/event-1.jpg";
import event2 from "@/assets/event-2.jpg";
import event3 from "@/assets/event-3.jpg";
import event4 from "@/assets/event-4.jpg";
import event5 from "@/assets/event-5.jpg";
import event6 from "@/assets/event-6.jpg";

const fallbackImages = [event1, event2, event3, event4, event5, event6];

export const useEvents = () => {
  return useQuery({
    queryKey: ["events"],
    queryFn: async (): Promise<Event[]> => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("date", { ascending: false });

      if (error) throw error;
      
      return data.map((event, index) => ({
        id: event.id,
        title: event.title,
        description: event.description,
        date: event.date,
        location: event.location,
        images: event.images && event.images.length > 0 
          ? event.images 
          : [
              fallbackImages[index % fallbackImages.length],
              fallbackImages[(index + 2) % fallbackImages.length],
              fallbackImages[(index + 4) % fallbackImages.length]
            ],
        featured: event.featured || false
      }));
    }
  });
};
