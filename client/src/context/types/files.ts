export type FileType = {
  progress: unknown;
  size(size: unknown): import("react").ReactNode;
  id: number;
  originalName: string;
  storedName: string;
  fileType: string;
  targetType: string;
  status: "pending" | "completed";
};


export interface FileContextType {
  files: FileType[];
  loading: boolean;
  error: string | null;
  fetchHistory: () => Promise<void>;
  uploadFile: (options: {
    file: File;
    convertTo?: string;
    onProgress?: (progress: number) => void;
  }) => Promise<void>;
  deleteFile: (id: number) => Promise<void>;
}
