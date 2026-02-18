export type FileType = {
  id: number;
  originalName: string;
  storedName: string;
  fileType: string;
  targetType: string;
  status: "pending" | "completed";
  downloadUrl?: string;
  createdAt?: string; 
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
  }) => Promise<FileType | undefined>;
  deleteFile: (id: number) => Promise<void>;
}
