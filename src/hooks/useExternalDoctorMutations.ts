import { useMutation, useQueryClient } from "@tanstack/react-query";
import { post_doctor, update_doctor, delete_doctor } from "@/api/doctors";
import { ExternalDoctor } from "@/types/externalDoctor";
import { useToast } from "@/hooks/use-toast";

export const useCreateExternalDoctor = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: Omit<ExternalDoctor, "id">) => post_doctor(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["external_doctors"] });
      toast({ title: "Doctor creado", description: "El doctor externo se ha agregado correctamente." });
    },
    onError: (error: Error) => {
      toast({ title: "Error al crear", description: error.message, variant: "destructive" });
    },
  });
};

export const useUpdateExternalDoctor = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (doctor: ExternalDoctor) => update_doctor(doctor.id, doctor),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["external_doctors"] });
      toast({ title: "Doctor actualizado", description: "Los cambios se han guardado correctamente." });
    },
    onError: (error: Error) => {
      toast({ title: "Error al actualizar", description: error.message, variant: "destructive" });
    },
  });
};

export const useDeleteExternalDoctor = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: number) => delete_doctor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["external_doctors"] });
      toast({ title: "Doctor eliminado", description: "El doctor externo se ha eliminado correctamente." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
};
