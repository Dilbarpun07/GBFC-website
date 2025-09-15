"use client";

import React from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { Session } from "@supabase/supabase-js";

interface AuthWrapperProps {
  session: Session | null;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ session }) => {
  const navigate = useNavigate();

  React.useEffect(() => {
    console.log("AuthWrapper useEffect triggered.");
    console.log("Current session in AuthWrapper:", session);
    console.log("Current pathname in AuthWrapper:", window.location.pathname);

    if (!session) {
      console.log("No session found, navigating to /login.");
      navigate('/login');
    } else {
      console.log("Session found.");
      if (window.location.pathname === '/login') {
        console.log("Currently on /login with a session, navigating to /.");
        navigate('/');
      } else {
        console.log("Session found, not on /login, staying on current page.");
      }
    }
  }, [session, navigate]);

  if (!session) {
    return null; // Render nothing if no session, AuthWrapper will redirect to login
  }

  return <Outlet />;
};

export default AuthWrapper;