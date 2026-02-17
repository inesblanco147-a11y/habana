import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  isLoading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    isAdmin: false,
    isLoading: true,
  });

  useEffect(() => {
    // Set up auth state listener BEFORE checking session
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const user = session?.user ?? null;
        
        if (user) {
          // Check if user has admin role
          const { data: roleData } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", user.id)
            .eq("role", "admin")
            .maybeSingle();

          setAuthState({
            user,
            session,
            isAdmin: !!roleData,
            isLoading: false,
          });
        } else {
          setAuthState({
            user: null,
            session: null,
            isAdmin: false,
            isLoading: false,
          });
        }
      }
    );

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const user = session?.user ?? null;
      
      if (user) {
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .eq("role", "admin")
          .maybeSingle();

        setAuthState({
          user,
          session,
          isAdmin: !!roleData,
          isLoading: false,
        });
      } else {
        setAuthState({
          user: null,
          session: null,
          isAdmin: false,
          isLoading: false,
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signOut = async () => {
    try {
      // Race with a 5 second timeout
      const logoutPromise = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      };
      const timeoutPromise = new Promise<void>((_, reject) =>
        setTimeout(() => reject(new Error("Logout timeout")), 5000)
      );

      try {
        await Promise.race([logoutPromise(), timeoutPromise]);
      } catch {
        // Even if timeout, proceed with cleanup
      }

      // Always clear state and storage
      setAuthState({
        user: null,
        session: null,
        isAdmin: false,
        isLoading: false,
      });
      localStorage.clear();
      sessionStorage.clear();
      return { error: null };
    } catch (error) {
      console.error("Sign out error:", error);
      // Force clear state even on error
      setAuthState({
        user: null,
        session: null,
        isAdmin: false,
        isLoading: false,
      });
      localStorage.clear();
      sessionStorage.clear();
      return { error: error as Error };
    }
  };

  return {
    ...authState,
    signIn,
    signOut,
  };
};
