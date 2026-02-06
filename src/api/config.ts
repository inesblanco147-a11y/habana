import axios from "axios";
import { supabase } from "@/integrations/supabase/client";

export const API_BASE_URL = "http://127.0.0.1:8000/";

export const authAxios = axios.create({
  baseURL: API_BASE_URL,
});

authAxios.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});
