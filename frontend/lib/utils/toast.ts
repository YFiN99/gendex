import { toast as hotToast, ToastOptions } from 'react-hot-toast';

export const error = (message: string, options?: any) => {
  return hotToast.error(message);
};

export const userRejected = (message: string) => {
  return hotToast.error(message || "User rejected the request");
};

export const warning = (message: string) => {
  // react-hot-toast tidak punya warning default, kita pakai emoji
  return hotToast(message, { icon: '⚠️' });
};

export const success = (message: string) => {
  return hotToast.success(message);
};

// Ekspor default juga untuk jaga-jaga
export const toast = {
  error,
  userRejected,
  warning,
  success
};