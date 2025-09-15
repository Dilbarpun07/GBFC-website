"use client";

import React from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";

const Login: React.FC = () => {
  console.log("Login component rendered. Supabase client:", supabase);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          Welcome to SportEasy
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400">
          Sign in or create an account to manage your teams.
        </p>
        <Auth
          supabaseClient={supabase}
          providers={[]}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: "hsl(var(--primary))",
                  brandAccent: "hsl(var(--primary-foreground))",
                },
              },
            },
          }}
          theme="light"
          // Removed redirectTo prop to allow client-side navigation to handle redirects
          view="sign_in"
        />
      </div>
    </div>
  );
};

export default Login;