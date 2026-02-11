import { createContext, useContext, useState, type ReactNode } from "react";
import { toast } from "react-toastify";
import { apiRequest, ApiError } from "../api/client";
import type { FileContextType, FileType } from "./types/files";

const FileContext = createContext<FileContextType | null>(null);

export const FileProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [files, setFiles] = useState<FileType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiRequest<FileType[]>("/files/history");
      setFiles(res);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Failed to fetch history",
      );
      toast.error(error || "Failed to fetch history");
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file: File, convertTo?: string) => {
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    if (convertTo) formData.append("convertTo", convertTo);

    try {
      const res = await fetch("/api/files/upload", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      setFiles((prev) => [data.file, ...prev]);
      toast.success("File uploaded successfully!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Upload failed";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const deleteFile = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/files/file/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete file");
      setFiles((prev) => prev.filter((f) => f.id !== id));
      toast.success("File deleted!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Delete failed";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FileContext.Provider
      value={{ files, loading, error, fetchHistory, uploadFile, deleteFile }}
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
