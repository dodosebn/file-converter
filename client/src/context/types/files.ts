export interface UploadResponse {
  fileId: string;
  status: "queued" | "processing" | "done";
  downloadUrl?: string;
}

export interface FileContextValue {
  uploading: boolean;
  error: string | null;
  result: UploadResponse | null;
  uploadFile: (file: File) => Promise<void>;
}
