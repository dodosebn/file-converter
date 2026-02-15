import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { apiRequest, API_BASE_URL } from "../api/client";
import { useAuth } from "../context/authContext";

const useFiles = () => {
  const queryClient = useQueryClient();
  const { token } = useAuth();

  const historyQuery = useQuery({
    queryKey: ["files"],
    queryFn: () => apiRequest("/files/history", {}, token),
    enabled: !!token,
  });

  // ✅ Upload file
  const uploadMutation = useMutation({
    mutationFn: async ({
      file,
      convertTo,
      onProgress,
    }: {
      file: File;
      convertTo?: string;
      onProgress?: (percent: number) => void;
    }) => {
      if (!token) {
        throw new Error("You must be logged in to upload files.");
      }

      const formData = new FormData();
      formData.append("file", file);
      if (convertTo) formData.append("convertTo", convertTo);

      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `${API_BASE_URL}/files/upload`);
        xhr.withCredentials = true;

        xhr.setRequestHeader("Authorization", `Bearer ${token}`);

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable && onProgress) {
            const percent = Math.round(
              (event.loaded / event.total) * 100
            );
            onProgress(percent);
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              resolve(JSON.parse(xhr.response));
            } catch {
              reject(new Error("Invalid server response"));
            }
          } else {
            try {
              const errorData = JSON.parse(xhr.response);
              reject(new Error(errorData.message || "Upload failed"));
            } catch {
              reject(new Error(`Upload failed (${xhr.status})`));
            }
          }
        };

        xhr.onerror = () => reject(new Error("Network error"));
        xhr.send(formData);
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
      toast.success("File uploaded successfully!");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (err: any) => {
      toast.error(err.message || "Upload failed");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      apiRequest(`/files/file/${id}`, { method: "DELETE" }, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
      toast.success("File deleted!");
    },
    onError: () => {
      toast.error("Delete failed");
    },
  });

  return {
    files: historyQuery.data || [],
    loading: historyQuery.isLoading,
    error: historyQuery.error,
    uploadFile: uploadMutation.mutate,
    deleteFile: deleteMutation.mutate,
    isUploading: uploadMutation.isPending,
  };
};

export default useFiles;
