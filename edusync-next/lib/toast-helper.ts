import { toast } from 'sonner';

/**
 * Centralized toast notification service
 * Use this instead of calling toast directly
 */
export const notify = {
  /**
   * Show success notification
   */
  success: (message: string, options = {}) => {
    toast.success(message, { duration: 4000, ...options });
  },

  /**
   * Show error notification
   */
  error: (message: string, options = {}) => {
    toast.error(message, { duration: 4000, ...options });
  },

  /**
   * Show info notification
   */
  info: (message: string, options = {}) => {
    toast.info(message, { duration: 4000, ...options });
  },

  /**
   * Show warning notification
   */
  warning: (message: string, options = {}) => {
    toast.warning(message, { duration: 4000, ...options });
  },

  /**
   * Show loading notification
   */
  loading: (message: string, options = {}) => {
    return toast.loading(message, options);
  },

  /**
   * Show promise-based notification
   */
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    },
    options = {}
  ) => {
    return toast.promise(promise, messages, options);
  },

  /**
   * Dismiss a specific toast
   */
  dismiss: (toastId: string | number) => {
    toast.dismiss(toastId);
  },
};
