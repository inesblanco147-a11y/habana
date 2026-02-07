import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Event } from "@/types/event";
import { useToast } from "@/hooks/use-toast";

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (event: Omit<Event, "id">) => {
      const { data, error } = await supabase
        .from("events")
        .insert({
          title: event.title,
          description: event.description,
          date: event.date,
          location: event.location,
          images: event.images || [],
          featured: event.featured || false,
          show_date: (event as any).showDate ?? true,
          show_location: (event as any).showLocation ?? true,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({ title: "Evento creado", description: "El nuevo evento se ha agregado correctamente." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    }
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (event: Event) => {
      const { data, error } = await supabase
        .from("events")
        .update({
          title: event.title,
          description: event.description,
          date: event.date,
          location: event.location,
          images: event.images || [],
          featured: event.featured || false,
          show_date: (event as any).showDate ?? true,
          show_location: (event as any).showLocation ?? true,
        })
        .eq("id", event.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({ title: "Evento actualizado", description: "Los cambios se han guardado correctamente." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    }
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Evento eliminado", description: "El evento se ha eliminado correctamente." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    }
  });
};
