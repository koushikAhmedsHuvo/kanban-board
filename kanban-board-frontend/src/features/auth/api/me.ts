import { apiClient } from "@/lib/axios";
import type { User } from "../types/auth.types";

export async function getCurrentUser() {
  const response = await apiClient.get<User>("/users/me");
  return response.data;
}
