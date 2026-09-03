import { apiClient } from "@/lib/axios";
import type { RegisterRequest, RegisterResponse } from "../types/auth.types";

export async function register(data: RegisterRequest) {
  const response = await apiClient.post<RegisterResponse>("/auth/register", data);
  return response.data;
}
