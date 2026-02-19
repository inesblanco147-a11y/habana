import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { useToast } from "@/hooks/use-toast";
import { withTimeout } from "@/lib/mutationWithTimeout";

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (product: Omit<Product, "id">) => {
      return withTimeout(async () => {
        const mainImage = product.images.length > 0
          ? (product.images[product.mainImageIndex] || product.images[0])
          : product.image;

        const { data, error } = await supabase
          .from("products")
          .insert({
            name: product.name, description: product.description, price: product.price,
            image: mainImage || "", category: product.category, in_stock: product.inStock,
            featured: product.featured || false, show_price: product.showPrice,
            has_sizes: product.hasSizes, sizes: product.sizes as any,
            display_order: product.displayOrder ?? 0,
            images: product.images,
            main_image_index: product.mainImageIndex ?? 0,
            specifications: product.specifications as any,
          } as any)
          .select().single();
        if (error) throw error;
        return data;
      });
    },
    onSuccess: () => { toast({ title: "Producto creado", description: "El nuevo producto se ha agregado correctamente." }); },
    onError: (error: Error) => { toast({ title: "Error", description: error.message, variant: "destructive" }); },
    onSettled: () => { queryClient.invalidateQueries({ queryKey: ["products"] }); }
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (product: Product) => {
      return withTimeout(async () => {
        const mainImage = product.images.length > 0
          ? (product.images[product.mainImageIndex] || product.images[0])
          : product.image;

        const { data, error } = await supabase
          .from("products")
          .update({
            name: product.name, description: product.description, price: product.price,
            image: mainImage || "", category: product.category, in_stock: product.inStock,
            featured: product.featured || false, show_price: product.showPrice,
            has_sizes: product.hasSizes, sizes: product.sizes as any,
            display_order: product.displayOrder ?? 0,
            images: product.images,
            main_image_index: product.mainImageIndex ?? 0,
            specifications: product.specifications as any,
          } as any)
          .eq("id", product.id).select().single();
        if (error) throw error;
        return data;
      });
    },
    onSuccess: () => { toast({ title: "Producto actualizado", description: "Los cambios se han guardado correctamente." }); },
    onError: (error: Error) => { toast({ title: "Error", description: error.message, variant: "destructive" }); },
    onSettled: () => { queryClient.invalidateQueries({ queryKey: ["products"] }); }
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      return withTimeout(async () => {
        const { error } = await supabase.from("products").delete().eq("id", id);
        if (error) throw error;
      });
    },
    onSuccess: () => { toast({ title: "Producto eliminado", description: "El producto se ha eliminado correctamente." }); },
    onError: (error: Error) => { toast({ title: "Error", description: error.message, variant: "destructive" }); },
    onSettled: () => { queryClient.invalidateQueries({ queryKey: ["products"] }); }
  });
};
