import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Doctor {
  id: string;
  name: string;
  title: string;
  specialty: string;
  summary: string;
  experience: string;
  education: string[];
  certifications: string[];
  image: string;
}

export const useDoctors = () => {
  return useQuery({
    queryKey: ["doctors"],
    queryFn: async (): Promise<Doctor[]> => {
      const { data, error } = await supabase
        .from("doctors")
        .select("*")
        .order("created_at", { ascending: true });

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
        image: doc.image || ""
      }));
    }
  });
};
