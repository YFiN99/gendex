import { toast, ToastOptions } from 'react-hot-toast';

const defaultOptions: ToastOptions = {
  duration: 4000,
  position: 'top-right',
};

export const showToast = {
  success: (message: string) => {
    toast.success(message, defaultOptions);
  },
  error: (message: string) => {
    toast.error(message, defaultOptions);
  },
  loading: (message: string) => {
    return toast.loading(message, defaultOptions);
  },
  promise: (promise: Promise<any>, messages: { loading: string; success: string; error: string }, options: any = {}) => {
    // Memperbaiki error "Expected 1-2 arguments, but got 3"
    return toast.promise(
      promise,
      {
        loading: messages.loading,
        success: messages.success,
        error: messages.error,
      },
      {
        ...defaultOptions,
        ...options,
      }
    );
  },
  dismiss: (toastId?: string) => {
    toast.dismiss(toastId);
  }
};
