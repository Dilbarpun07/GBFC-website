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

  console.log("AuthHandler component rendered.");

  React.useEffect(() => {
    console.log("AuthHandler useEffect: Initializing auth state check.");

    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        console.log("AuthHandler: getSession resolved. Session:", session);
        setSession(session);
        setLoadingAuth(false);
        console.log("AuthHandler: setLoadingAuth(false) after getSession.");
      })
      .catch((error) => {
        console.error("AuthHandler: Error getting session:", error);
        setLoadingAuth(false); // Ensure loading state is cleared even on error
        console.log("AuthHandler: setLoadingAuth(false) after getSession error.");
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("AuthHandler: onAuthStateChange event:", _event, "Session:", session);
      setSession(session);
      setLoadingAuth(false);
      console.log("AuthHandler: setLoadingAuth(false) after onAuthStateChange.");
      // Explicitly navigate after successful sign-in if on the login page
      if (session && window.location.pathname === '/login') {
        console.log("AuthHandler: Navigating to / after successful login.");
        navigate('/');
      }
    });

    return () => {
      console.log("AuthHandler useEffect cleanup: Unsubscribing from auth state changes.");
      subscription.unsubscribe();
    };
  }, [setSession, setLoadingAuth, navigate]);

  return null;
};

export default AuthHandler;