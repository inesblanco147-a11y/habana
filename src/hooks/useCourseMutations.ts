import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Course } from "@/types/course";
import { useToast } from "@/hooks/use-toast";

export const useCreateCourse = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (course: Omit<Course, "id">) => {
      const { data, error } = await supabase
        .from("courses")
        .insert({
          title: course.title,
          description: course.description,
          image: course.image || "",
          modality: course.modality,
          availability: course.availability,
          date: course.date,
          duration: course.duration,
          location: course.location,
          price: course.price,
          instructor: course.instructor,
          objectives: course.objectives,
          includes: course.includes,
          max_participants: course.maxParticipants,
          current_participants: course.currentParticipants,
          show_date: course.showDate,
          show_duration: course.showDuration,
          show_participants: course.showParticipants,
          show_objectives: course.showObjectives,
          show_includes: course.showIncludes,
          show_price: course.showPrice,
          show_location: (course as any).showLocation ?? true,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({ title: "Curso creado", description: "El nuevo curso se ha agregado correctamente." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    }
  });
};

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (course: Course) => {
      const { data, error } = await supabase
        .from("courses")
        .update({
          title: course.title,
          description: course.description,
          image: course.image || "",
          modality: course.modality,
          availability: course.availability,
          date: course.date,
          duration: course.duration,
          location: course.location,
          price: course.price,
          instructor: course.instructor,
          objectives: course.objectives,
          includes: course.includes,
          max_participants: course.maxParticipants,
          current_participants: course.currentParticipants,
          show_date: course.showDate,
          show_duration: course.showDuration,
          show_participants: course.showParticipants,
          show_objectives: course.showObjectives,
          show_includes: course.showIncludes,
          show_price: course.showPrice,
          show_location: (course as any).showLocation ?? true,
        })
        .eq("id", course.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({ title: "Curso actualizado", description: "Los cambios se han guardado correctamente." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    }
  });
};

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("courses")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Curso eliminado", description: "El curso se ha eliminado correctamente." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    }
  });
};
