import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useSessionMonitor = () => {
  const [sessionExpired, setSessionExpired] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleExpired = useCallback(() => {
    setSessionExpired(true);
    // Clear all cached data
    queryClient.clear();
    localStorage.clear();
    sessionStorage.clear();
    // Redirect after 2 seconds
    setTimeout(() => {
      setSessionExpired(false);
      navigate("/auth", { replace: true });
    }, 2000);
  }, [navigate, queryClient]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === "SIGNED_OUT" || event === "TOKEN_REFRESHED") {
          // TOKEN_REFRESHED is fine, only handle errors
          return;
        }
      }
    );

    // Periodically check session validity
    const interval = setInterval(async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error || !session) {
          handleExpired();
        }
      } catch {
        handleExpired();
      }
    }, 60000); // Check every 60 seconds

    return () => {
      subscription.unsubscribe();
      clearInterval(interval);
    };
  }, [handleExpired]);

  return { sessionExpired };
};
