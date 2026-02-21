import { createContext, useContext, useState, useEffect } from "react";
import type { AuthContextValue, AuthUser, FileData } from "./types/auth";

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get("token");

      if (urlToken) {
        setToken(urlToken);
        localStorage.setItem("token", urlToken);
        
        window.history.replaceState({}, document.title, window.location.pathname);

        setLoading(true);
        try {
          const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${urlToken}` },
          });
          if (res.ok) {
            const data = await res.json();
            setUser(data);
            await fetchFiles();
          }
        } catch (err: any) {
          console.error("Auth initialization failed:", err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      } else if (token && !user) {
         setLoading(true);
         fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/me`, {
             headers: { Authorization: `Bearer ${token}` },
         })
         .then(res => res.ok ? res.json() : null)
         .then(data => {
             if (data) {
                 setUser(data);
                 fetchFiles();
             } else {
                 setToken(null);
             }
         })
         .catch(() => setToken(null))
         .finally(() => setLoading(false));
      }
    };

    handleOAuthCallback();
  }, []);

  const fetchFiles = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/files/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch files");
      const data = await res.json();
      setFiles(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      setUser(data.user);
      setToken(data.token);
      await fetchFiles();
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Signup failed");
      }

      setUser(data.user);
      setToken(data.token);
      await fetchFiles();

      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setFiles([]);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, files, loading, error, signup, login, logout, fetchFiles }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
