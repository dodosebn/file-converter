export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('token');
  const url = `${API_BASE_URL}${endpoint}`;

  console.log('Fetching:', url);

  // Normalize headers safely
  const headers = new Headers(options.headers || {});

  // Add auth token if available
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Only set Content-Type if:
  // - Body is not FormData
  // - Content-Type not already set
  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(url, {
    credentials: 'include',
    ...options,
    headers,
  });

  // Handle empty responses safely
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};

  if (!res.ok) {
    throw new ApiError(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (data as any)?.message ?? text ?? 'Request failed',
      res.status
    );
  }

  return data as T;
}
