// types/auth.ts
export interface AuthContextValue {
  user: AuthUser | null;
  token: string | null; 
  isAuthenticated: boolean; 
  loading: boolean;
  error: string | null;
  signup: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export interface AuthResponse {
  user: AuthUser;
  token: string; 
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
}