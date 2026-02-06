export interface AuthUser {
  id: string;
  email: string;
}

export interface AuthResponse {
  user: AuthUser;
  token?: string;
}

export interface AuthContextValue {
  signup: (name: string, email: string, password: string) => Promise<void>; 
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
}
