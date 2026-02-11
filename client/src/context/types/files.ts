export type FileType = {
  id: number;
  originalName: string;
  storedName: string;
  fileType: string;
  targetType: string;
  status: "pending" | "completed";
};

export type FileContextType = {
  files: FileType[];
  loading: boolean;
  error: string | null;
  fetchHistory: () => Promise<void>;
  uploadFile: (file: File, convertTo?: string) => Promise<void>;
  deleteFile: (id: number) => Promise<void>;
};
