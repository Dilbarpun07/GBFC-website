import { createClient } from '@supabase/supabase-js';

// Enhanced Supabase client with security configurations
export const createSecureSupabaseClient = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase configuration');
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storage: {
        getItem: (key: string) => {
          // Add encryption layer here if needed
          return window.localStorage.getItem(key);
        },
        setItem: (key: string, value: string) => {
          // Add encryption layer here if needed
          window.localStorage.setItem(key, value);
        },
        removeItem: (key: string) => {
          window.localStorage.removeItem(key);
        }
      },
      flowType: 'pkce' // Use PKCE flow for better security
    },
    global: {
      headers: {
        'X-Client-Info': 'gbfc-website'
      }
    },
    db: {
      schema: 'public'
    },
    realtime: {
      params: {
        eventsPerSecond: 10 // Rate limiting for realtime
      }
    }
  });
};

// Session timeout handler
export const setupSessionTimeout = (supabase: any) => {
  let timeoutId: NodeJS.Timeout;
  const TIMEOUT_DURATION = 30 * 60 * 1000; // 30 minutes

  const resetTimeout = () => {
    if (timeoutId) clearTimeout(timeoutId);

    timeoutId = setTimeout(async () => {
      await supabase.auth.signOut();
      window.location.href = '/login?reason=timeout';
    }, TIMEOUT_DURATION);
  };

  // Reset timeout on user activity
  ['mousedown', 'keydown', 'scroll', 'touchstart'].forEach(event => {
    document.addEventListener(event, resetTimeout, { passive: true });
  });

  resetTimeout();
};