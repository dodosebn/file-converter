import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { toast } from "react-toastify";
import { apiRequest, ApiError, API_BASE_URL } from "../api/client";
import { useAuth } from "./authContext";
import type { FileContextType, FileType } from "./types/files";
import axios from "axios";

interface UploadOptions {
  file: File;
  convertTo?: string;
  onProgress?: (progress: number) => void;
}

const FileContext = createContext<FileContextType | null>(null);

export const FileProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { token } = useAuth();
  const [files, setFiles] = useState<FileType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

 
  const fetchHistory = async () => {
    if (!token) return;

    try {
      const res = await apiRequest<FileType[]>("/files/history", {}, token);
      setFiles(res);
    } catch (err) {
      if (!token) return; 

      const message =
        err instanceof ApiError
          ? err.message
          : "Failed to fetch history";

      setError(message);
    }
  };


  const uploadFile = async ({
  file,
  convertTo,
  onProgress,
}: UploadOptions) => {
  if (!token) {
      toast.error("Please login to upload files");
      return Promise.reject("Not authenticated");
  }

  setLoading(true);
  setError(null);

  const formData = new FormData();
  formData.append("file", file);
  if (convertTo) formData.append("convertTo", convertTo);

  try {
    const res = await axios.post(
      `${API_BASE_URL}/files/upload`,
      formData,
      {
        withCredentials: true,
        headers: {
            Authorization: `Bearer ${token}`
        },
        onUploadProgress: (progressEvent: any ) => {
          if (!onProgress) return;

          const percent = Math.round(
            (progressEvent.loaded * 100) /
              (progressEvent.total || 1)
          );

          onProgress(percent);
        },
      }
    );

    setFiles((prev) => [res.data.file, ...prev]);

    toast.success("File uploaded successfully!");

    await fetchHistory();
    
    return res.data.file;
  } catch (err: any) {
    const message =
      err.response?.data?.message || "Upload failed";

    setError(message);
    toast.error(message);
    throw err;
  } finally {
    setLoading(false);
  }
};


  const deleteFile = async (id: number) => {
    if (!token) return;

    try {
      await apiRequest(`/files/file/${id}`, {
        method: "DELETE",
      }, token);

      setFiles((prev) => prev.filter((f) => f.id !== id));
      toast.success("File deleted!");
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Delete failed";

      setError(message);
      toast.error(message);
    }
  };

 
  useEffect(() => {
    if (token) {
        fetchHistory(); 

        const interval = setInterval(() => {
        fetchHistory();
        }, 3000); 

        return () => clearInterval(interval);
    } else {
        setFiles([]); 
    }
  }, [token]);

  return (
    <FileContext.Provider
      value={{
        files,
        loading,
        error,
        fetchHistory,
        uploadFile,
        deleteFile,
      }}
    >
      {children}
    </FileContext.Provider>
  );
};


export const useFile = (): FileContextType => {
  const ctx = useContext(FileContext);
  if (!ctx) throw new Error("useFile must be used inside a FileProvider");
  return ctx;
};
