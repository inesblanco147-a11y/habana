import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Doctor } from "@/types/doctor";
import { useToast } from "@/hooks/use-toast";

export const useCreateDoctor = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (doctor: Omit<Doctor, "id">) => {
      const { data, error } = await supabase
        .from("doctors")
        .insert({
          name: doctor.name,
          title: doctor.title,
          specialty: doctor.specialty,
          summary: doctor.summary,
          experience: doctor.experience,
          education: doctor.education || [],
          certifications: doctor.certifications || [],
          image: doctor.image || ""
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      toast({ title: "Doctor creado", description: "El nuevo doctor se ha agregado correctamente." });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Error", 
        description: error.message, 
        variant: "destructive" 
      });
    }
  });
};

export const useUpdateDoctor = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (doctor: Doctor) => {
      const { data, error } = await supabase
        .from("doctors")
        .update({
          name: doctor.name,
          title: doctor.title,
          specialty: doctor.specialty,
          summary: doctor.summary,
          experience: doctor.experience,
          education: doctor.education || [],
          certifications: doctor.certifications || [],
          image: doctor.image || ""
        })
        .eq("id", doctor.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      toast({ title: "Doctor actualizado", description: "Los cambios se han guardado correctamente." });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Error", 
        description: error.message, 
        variant: "destructive" 
      });
    }
  });
};

export const useDeleteDoctor = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("doctors")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      toast({ title: "Doctor eliminado", description: "El doctor se ha eliminado correctamente." });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Error", 
        description: error.message, 
        variant: "destructive" 
      });
    }
  });
};
