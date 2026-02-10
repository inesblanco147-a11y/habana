import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CreateAppointmentData } from "@/types/appointment";
import { useToast } from "@/hooks/use-toast";

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateAppointmentData) => {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-appointment`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            email: data.email,
            date: data.date,
            time: data.time,
            service: data.service,
            notes: data.notes,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Error al crear la cita");
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast({ title: "Cita agendada", description: "Tu cita ha sido registrada exitosamente." });
    },
    onError: (error: Error) => {
      toast({ variant: "destructive", title: "Error", description: error.message });
    },
  });
};

export const useUpdateAppointmentStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("appointments" as any)
        .update({ status } as any)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast({ title: "Estado actualizado", description: "El estado de la cita ha sido actualizado." });
    },
    onError: () => {
      toast({ variant: "destructive", title: "Error", description: "No se pudo actualizar el estado." });
    },
  });
};
