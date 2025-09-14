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
    if (!session) {
      navigate('/login');
    } else {
      if (window.location.pathname === '/login') {
        navigate('/');
      }
    }
  }, [session, navigate]);

  if (!session) {
    return null;
  }

  return <Outlet />;
};

export default AuthWrapper;