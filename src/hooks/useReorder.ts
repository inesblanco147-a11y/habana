import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type ReorderableTable = "services" | "products" | "courses" | "gallery" | "doctors";

const queryKeyMap: Record<ReorderableTable, string[]> = {
  services: ["services"],
  products: ["products"],
  courses: ["courses"],
  gallery: ["gallery"],
  doctors: ["doctors"],
};

export const useReorder = (table: ReorderableTable) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, newOrder }: { id: string; newOrder: number }) => {
      const { error } = await supabase
        .from(table)
        .update({ display_order: newOrder } as any)
        .eq("id", id);

      if (error) throw error;
    },
    onError: (error: Error) => {
      toast({ variant: "destructive", title: "Error", description: error.message });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeyMap[table] });
    },
  });
};

export const useSwapOrder = (table: ReorderableTable) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ items, indexA, indexB }: { items: { id: string; displayOrder: number }[]; indexA: number; indexB: number }) => {
      const itemA = items[indexA];
      const itemB = items[indexB];

      const [{ error: errorA }, { error: errorB }] = await Promise.all([
        supabase.from(table).update({ display_order: itemB.displayOrder } as any).eq("id", itemA.id),
        supabase.from(table).update({ display_order: itemA.displayOrder } as any).eq("id", itemB.id),
      ]);

      if (errorA) throw errorA;
      if (errorB) throw errorB;
    },
    onError: (error: Error) => {
      toast({ variant: "destructive", title: "Error", description: error.message });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeyMap[table] });
    },
  });
};
