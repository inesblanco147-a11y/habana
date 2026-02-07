import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PastCourse } from "@/types/course";
import { useToast } from "@/hooks/use-toast";

export const useCreatePastCourse = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (course: Omit<PastCourse, "id">) => {
      const { data, error } = await supabase
        .from("past_courses")
        .insert({
          title: course.title,
          description: course.description,
          image: course.image || "",
          modality: course.modality,
          date: course.date,
          participants: course.participants,
          instructor: course.instructor,
          gallery_images: course.galleryImages || [],
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({ title: "Curso pasado creado", description: "El registro se ha agregado correctamente." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["past-courses"] });
    },
  });
};

export const useUpdatePastCourse = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (course: PastCourse) => {
      const { data, error } = await supabase
        .from("past_courses")
        .update({
          title: course.title,
          description: course.description,
          image: course.image || "",
          modality: course.modality,
          date: course.date,
          participants: course.participants,
          instructor: course.instructor,
          gallery_images: course.galleryImages || [],
        })
        .eq("id", course.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({ title: "Curso pasado actualizado", description: "Los cambios se han guardado correctamente." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["past-courses"] });
    },
  });
};

export const useDeletePastCourse = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("past_courses")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Curso pasado eliminado", description: "El registro se ha eliminado correctamente." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["past-courses"] });
    },
  });
};
