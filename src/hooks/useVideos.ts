import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Video } from "@/types/video";

export const useVideos = () => {
  return useQuery({
    queryKey: ["videos"],
    queryFn: async (): Promise<Video[]> => {
      const { data, error } = await supabase
        .from("videos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      return data.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        thumbnail: item.thumbnail,
        videoUrl: item.video_url,
      }));
    },
  });
};
