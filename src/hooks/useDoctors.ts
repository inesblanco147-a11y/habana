import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Doctor } from "@/types/doctor";

export const useDoctors = () => {
  return useQuery({
    queryKey: ["doctors"],
    queryFn: async (): Promise<Doctor[]> => {
      const { data, error } = await supabase
        .from("doctors")
        .select("*")
        .order("display_order", { ascending: true })
        .order("name", { ascending: true });

      if (error) throw error;
      
      return data.map(doc => ({
        id: doc.id,
        name: doc.name,
        title: doc.title,
        specialty: doc.specialty,
        summary: doc.summary,
        experience: doc.experience,
        education: doc.education || [],
        certifications: doc.certifications || [],
        image: doc.image || "",
        displayOrder: (doc as any).display_order ?? 0,
      }));
    }
  });
};
