import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Service } from "@/types/service";
import { useToast } from "@/hooks/use-toast";

export const useCreateService = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (service: Omit<Service, "id">) => {
      const { data, error } = await supabase
        .from("services")
        .insert({
          name: service.name,
          description: service.description,
          image: service.image,
          price: service.price,
          discount: service.discount,
          offer_active: service.offerActive,
          offer_description: service.offerDescription,
          category: service.category,
          show_price: service.showPrice,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({ title: "Servicio creado", description: "El servicio se ha creado correctamente." });
    },
    onError: (error: Error) => {
      toast({ variant: "destructive", title: "Error", description: error.message });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
};

export const useUpdateService = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (service: Service) => {
      const { data, error } = await supabase
        .from("services")
        .update({
          name: service.name,
          description: service.description,
          image: service.image,
          price: service.price,
          discount: service.discount,
          offer_active: service.offerActive,
          offer_description: service.offerDescription,
          category: service.category,
          show_price: service.showPrice,
        })
        .eq("id", service.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({ title: "Servicio actualizado", description: "Los cambios se han guardado correctamente." });
    },
    onError: (error: Error) => {
      toast({ variant: "destructive", title: "Error", description: error.message });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
};

export const useDeleteService = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("services")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Servicio eliminado", description: "El servicio se ha eliminado correctamente." });
    },
    onError: (error: Error) => {
      toast({ variant: "destructive", title: "Error", description: error.message });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
};
