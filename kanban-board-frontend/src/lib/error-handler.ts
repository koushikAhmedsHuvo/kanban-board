import axios from "axios";

export function getErrorMessage(error: unknown): string {
  if (!axios.isAxiosError(error)) return "Something went wrong";
  switch (error.response?.status) {
    case 401:
      return "Authentication required";
    case 403:
      return "Permission Denied";
    case 404:
      return "Resource Not Found";
    case 409:
      return "Conflict Detected";
    case 500:
      return "Internal Server Error";
    default: {
      const message = error.response?.data?.message;
      if (Array.isArray(message)) return message.join(", ");
      if (typeof message === "string" && message.length > 0) return message;
      return "Something went wrong";
    }
  }
}
