import { createContext, useContext, useState, type ReactNode } from "react";
import { apiRequest, ApiError } from "../api/client";
import type { FileContextValue, UploadResponse } from "./types/files";

const FileContext = createContext<FileContextValue | null>(null);

export function FileProvider({ children }: { children: ReactNode }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<UploadResponse | null>(null);

  const uploadFile = async (file: File) => {
    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const data = await apiRequest<UploadResponse>("/files/upload", {
        method: "POST",
        body: formData,
      });

      setResult(data);
    } catch (err) {
      if (err instanceof ApiError) {
        // Multer / backend errors land here
        setError(err.message);
      } else {
        setError("Unexpected upload error");
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <FileContext.Provider value={{ uploading, error, result, uploadFile }}>
      {children}
    </FileContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useFile(): FileContextValue {
  const ctx = useContext(FileContext);
  if (!ctx) {
    throw new Error("useFile must be used inside FileProvider");
  }
  return ctx;
}
