import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { toast } from "react-toastify";
import { apiRequest, ApiError } from "../api/client";
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
  const [files, setFiles] = useState<FileType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

 
  const fetchHistory = async () => {
    try {
      const res = await apiRequest<FileType[]>("/files/history");
      setFiles(res);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Failed to fetch history";

      setError(message);
      toast.error(message);
    }
  };


  const uploadFile = async ({
  file,
  convertTo,
  onProgress,
}: UploadOptions) => {
  setLoading(true);
  setError(null);

  const formData = new FormData();
  formData.append("file", file);
  if (convertTo) formData.append("convertTo", convertTo);

  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/files/upload`,
      formData,
      {
        withCredentials: true,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    const message =
      err.response?.data?.message || "Upload failed";

    setError(message);
    toast.error(message);
  } finally {
    setLoading(false);
  }
};


  const deleteFile = async (id: number) => {
    try {
      await apiRequest(`/files/file/${id}`, {
        method: "DELETE",
      });

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

  // ================================
  // 🔥 Poll for Conversion Updates
  // ================================
  useEffect(() => {
    fetchHistory(); // initial load

    const interval = setInterval(() => {
      fetchHistory();
    }, 3000); // every 3 seconds

    return () => clearInterval(interval);
  }, []);

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


// eslint-disable-next-line react-refresh/only-export-components
export const useFile = (): FileContextType => {
  const ctx = useContext(FileContext);
  if (!ctx) throw new Error("useFile must be used inside a FileProvider");
  return ctx;
};
