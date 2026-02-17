import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Doctor } from "@/types/doctor";
import { useToast } from "@/hooks/use-toast";
import { withTimeout } from "@/lib/mutationWithTimeout";

export const useCreateDoctor = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (doctor: Omit<Doctor, "id">) => {
      return withTimeout(async () => {
        const { data, error } = await supabase
          .from("doctors")
          .insert({
            name: doctor.name, title: doctor.title, specialty: doctor.specialty,
            summary: doctor.summary, experience: doctor.experience,
            education: doctor.education || [], certifications: doctor.certifications || [],
            image: doctor.image || "", display_order: doctor.displayOrder ?? 0,
          })
          .select().single();
        if (error) throw error;
        return data;
      });
    },
    onSuccess: () => { toast({ title: "Doctor creado", description: "El nuevo doctor se ha agregado correctamente." }); },
    onError: (error: Error) => { toast({ title: "Error al crear", description: error.message || "No se pudo crear el doctor. Intenta de nuevo.", variant: "destructive" }); },
    onSettled: () => { queryClient.invalidateQueries({ queryKey: ["doctors"] }); }
  });
};

export const useUpdateDoctor = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (doctor: Doctor) => {
      return withTimeout(async () => {
        const { data, error } = await supabase
          .from("doctors")
          .update({
            name: doctor.name, title: doctor.title, specialty: doctor.specialty,
            summary: doctor.summary, experience: doctor.experience,
            education: doctor.education || [], certifications: doctor.certifications || [],
            image: doctor.image || "", display_order: doctor.displayOrder ?? 0,
          })
          .eq("id", doctor.id).select().single();
        if (error) throw error;
        return data;
      });
    },
    onMutate: async (updatedDoctor) => {
      await queryClient.cancelQueries({ queryKey: ["doctors"] });
      const previousDoctors = queryClient.getQueryData<Doctor[]>(["doctors"]);
      queryClient.setQueryData<Doctor[]>(["doctors"], (old) =>
        old?.map(doctor => doctor.id === updatedDoctor.id ? updatedDoctor : doctor) ?? []
      );
      return { previousDoctors };
    },
    onError: (error: Error, _updatedDoctor, context) => {
      if (context?.previousDoctors) {
        queryClient.setQueryData(["doctors"], context.previousDoctors);
      }
      toast({ title: "Error al actualizar", description: error.message || "No se pudo guardar. Intenta de nuevo.", variant: "destructive" });
    },
    onSuccess: () => { toast({ title: "Doctor actualizado", description: "Los cambios se han guardado correctamente." }); },
    onSettled: () => { queryClient.invalidateQueries({ queryKey: ["doctors"] }); }
  });
};

export const useDeleteDoctor = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      return withTimeout(async () => {
        const { error } = await supabase.from("doctors").delete().eq("id", id);
        if (error) throw error;
      });
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["doctors"] }); toast({ title: "Doctor eliminado", description: "El doctor se ha eliminado correctamente." }); },
    onError: (error: Error) => { toast({ title: "Error", description: error.message, variant: "destructive" }); }
  });
};
