export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    credentials: "include",
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new ApiError(
      data?.message ?? "Request failed",
      res.status
    );
  }

  return data as T;
}
