"use client";

import React from "react";
import { useNavigate } from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthHandlerProps {
  setSession: React.Dispatch<React.SetStateAction<Session | null>>;
  setLoadingAuth: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthHandler: React.FC<AuthHandlerProps> = ({ setSession, setLoadingAuth }) => {
  const navigate = useNavigate();

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoadingAuth(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoadingAuth(false);
      // Explicitly navigate after successful sign-in if on the login page
      if (session && window.location.pathname === '/login') {
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [setSession, setLoadingAuth, navigate]);

  return null; // This component doesn't render anything itself
};

export default AuthHandler;