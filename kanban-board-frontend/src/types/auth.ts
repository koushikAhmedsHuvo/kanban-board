export interface User {
  id: string;
  email: string;
  name?: string | null;
  avatarUrl?: string | null;
}

export interface AuthResponse {
  user: User;
  token: string;
}
