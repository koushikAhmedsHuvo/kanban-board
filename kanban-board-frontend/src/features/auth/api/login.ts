import { apiClient } from "@/lib/axios";
import type { LoginRequest, LoginResponse } from "../types/auth.types";

export async function login(data: LoginRequest) {
  const response = await apiClient.post<LoginResponse>("/auth/login", data);
  return response.data;
}
