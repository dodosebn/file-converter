// types/auth.ts
// export interface AuthContextValue {
//   user: AuthUser | null;
//   token: string | null; 
//   isAuthenticated: boolean; 
//   loading: boolean;
//   error: string | null;
//   signup: (name: string, email: string, password: string) => Promise<void>;
//   login: (email: string, password: string) => Promise<void>;
//   logout: () => void;
// }

// export interface AuthResponse {
//   user: AuthUser;
//   token: string; 
// }
export interface FileData {
  id: number;
  originalName: string;
  storedName: string;
  fileType: string;
  targetType: string;
  status: string;
  createdAt: string;
}

export interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  files: FileData[];
  loading: boolean;
  error: string | null;
  signup: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchFiles: () => Promise<void>;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
}