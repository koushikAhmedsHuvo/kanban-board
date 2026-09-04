import { toast as sonner } from "sonner";

export const toastSuccess = (message: string) => sonner.success(message);
export const toastError = (message: string) => sonner.error(message);
export const toastInfo = (message: string) => sonner.info(message);
export const toastWarning = (message: string) => sonner.warning(message);
