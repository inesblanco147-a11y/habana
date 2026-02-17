import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [wasOffline, setWasOffline] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (wasOffline) {
        // Refetch all active queries after regaining connection
        queryClient.invalidateQueries();
        setWasOffline(false);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [wasOffline, queryClient]);

  return { isOnline };
};
