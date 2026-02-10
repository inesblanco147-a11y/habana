import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Appointment } from "@/types/appointment";

export const useAppointments = () => {
  return useQuery({
    queryKey: ["appointments"],
    queryFn: async (): Promise<Appointment[]> => {
      const { data, error } = await supabase
        .from("appointments" as any)
        .select("*")
        .order("date", { ascending: false });

      if (error) throw error;

      return (data as any[]).map((item) => ({
        id: item.id,
        firstName: item.first_name,
        lastName: item.last_name,
        phone: item.phone,
        email: item.email,
        date: item.date,
        time: item.time,
        service: item.service || "",
        notes: item.notes || "",
        googleEventId: item.google_event_id || "",
        status: item.status,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      }));
    },
  });
};
