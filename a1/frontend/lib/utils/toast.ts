import { toast, ToastOptions } from 'react-hot-toast';

const defaultOptions: ToastOptions = {
  duration: 4000,
  position: 'top-right',
};

// Export langsung supaya AccountPanel.tsx tidak error
export const success = (message: string) => toast.success(message, defaultOptions);
export const error = (message: string) => toast.error(message, defaultOptions);
export const loading = (message: string) => toast.loading(message, defaultOptions);
export const dismiss = (toastId?: string) => toast.dismiss(toastId);
export const userRejected = () => toast.error("User rejected the request", defaultOptions);

// Export fungsi promise dengan perbaikan argumen TypeScript
export const promise = (
  p: Promise<any>, 
  messages: { loading: string; success: string; error: string },
  options: any = {}
) => {
  return toast.promise(
    p,
    {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
    },
    { ...defaultOptions, ...options }
  );
};

// Export sebagai objek juga untuk jaga-jaga file lain pakai cara ini
export const showToast = { success, error, loading, promise, dismiss, userRejected };
