import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { apiRequest, API_BASE_URL } from "../api/client";
import { useAuth } from "../context/authContext";

const UseFiles = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth(); 

  const historyQuery = useQuery({
    queryKey: ["files"],
    queryFn: () => apiRequest("/files/history"),
    enabled: isAuthenticated,
  });

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
      const formData = new FormData();
      formData.append("file", file);
      if (convertTo) formData.append("convertTo", convertTo);

      const token = localStorage.getItem('token');

      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `${API_BASE_URL}/files/upload`);
        xhr.withCredentials = true;

        if (token) {
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }

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
              reject(new Error(xhr.responseText || "Upload failed"));
            }
          }
        };

        xhr.onerror = () => reject(new Error("Network error during upload"));
        xhr.ontimeout = () => reject(new Error("Upload timed out"));

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
      apiRequest(`/files/file/${id}`, { method: "DELETE" }),
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

export default UseFiles;