const isDevelopment = import.meta.env.DEV;
const isDebugEnabled = import.meta.env.VITE_DEBUG === 'true';

interface LogLevel {
  error: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  info: (...args: any[]) => void;
  debug: (...args: any[]) => void;
}

export const logger: LogLevel = {
  error: (...args: any[]) => {
    console.error(...args);
  },
  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },
  info: (...args: any[]) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },
  debug: (...args: any[]) => {
    if (isDevelopment && isDebugEnabled) {
      console.log(...args);
    }
  }
};

// Sanitize sensitive data before logging
export const sanitizeForLogging = (data: any): any => {
  if (!data) return data;

  const sensitive = ['password', 'token', 'key', 'secret', 'authorization'];

  if (typeof data === 'object') {
    const sanitized = { ...data };
    for (const key in sanitized) {
      if (sensitive.some(s => key.toLowerCase().includes(s))) {
        sanitized[key] = '[REDACTED]';
      }
    }
    return sanitized;
  }

  return data;
};