import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { apiRequest } from "../api/client";

 const UseFiles = () => {
  const queryClient = useQueryClient();

  // 🔹 Fetch history
  const historyQuery = useQuery({
    queryKey: ["files"],
    queryFn: () => apiRequest("/api/files/history"),
  });

  // 🔹 Upload mutation (with progress)
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

      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/files/upload");
        xhr.withCredentials = true;

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
            resolve(JSON.parse(xhr.response));
          } else {
            reject(new Error("Upload failed"));
          }
        };

        xhr.onerror = () => reject(new Error("Upload failed"));

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

  // 🔹 Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      apiRequest(`/api/files/file/${id}`, { method: "DELETE" }),
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