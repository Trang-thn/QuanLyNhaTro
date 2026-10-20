const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api/v1';

export class ApiRequestError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = 'ApiRequestError';
  }
}

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });
  if (!response.ok) {
    let message = `API request failed (${response.status})`;
    try {
      const body = await response.json() as { message?: unknown };
      if (typeof body.message === 'string' && body.message.trim()) message = body.message;
    } catch {
      // Keep the status-based fallback for empty or non-JSON error responses.
    }
    throw new ApiRequestError(response.status, message);
  }
  if (response.status === 204 || response.body === null) return undefined as T;
  return response.json() as Promise<T>;
}
