import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useCreateProductCategory = () => {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (name: string) => {
      const { error } = await supabase.from("product_categories").insert({ name });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["product_categories"] });
      toast({ title: "Categoría creada" });
    },
    onError: () => toast({ variant: "destructive", title: "Error al crear categoría" }),
  });
};

export const useUpdateProductCategory = () => {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const { error } = await supabase.from("product_categories").update({ name }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["product_categories"] });
      toast({ title: "Categoría actualizada" });
    },
    onError: () => toast({ variant: "destructive", title: "Error al actualizar categoría" }),
  });
};

export const useDeleteProductCategory = () => {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("product_categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["product_categories"] });
      toast({ title: "Categoría eliminada" });
    },
    onError: () => toast({ variant: "destructive", title: "Error al eliminar categoría" }),
  });
};
