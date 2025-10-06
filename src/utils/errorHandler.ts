import { toast } from 'sonner';
import { logger } from './logger';

interface ErrorContext {
  operation?: string;
  userId?: string;
  [key: string]: any;
}

export class AppError extends Error {
  constructor(
    public message: string,
    public code?: string,
    public context?: ErrorContext
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleDatabaseError = (error: any, operation: string): void => {
  // Log detailed error for debugging (only in dev)
  logger.error(`Database operation failed: ${operation}`, {
    error: import.meta.env.DEV ? error : { message: error.message }
  });

  // User-friendly error messages
  let userMessage = 'An error occurred. Please try again.';

  if (error.code === '23505') {
    userMessage = 'This item already exists.';
  } else if (error.code === '23503') {
    userMessage = 'Cannot complete operation due to related data.';
  } else if (error.code === '42501') {
    userMessage = 'You do not have permission to perform this action.';
  } else if (error.message?.includes('JWT')) {
    userMessage = 'Your session has expired. Please sign in again.';
  }

  toast.error(userMessage);
};

export const handleAuthError = (error: any): void => {
  logger.error('Authentication error', {
    message: error.message,
    code: error.code
  });

  let userMessage = 'Authentication failed. Please try again.';

  if (error.message?.includes('Invalid login')) {
    userMessage = 'Invalid email or password.';
  } else if (error.message?.includes('Email not confirmed')) {
    userMessage = 'Please verify your email before signing in.';
  }

  toast.error(userMessage);
};