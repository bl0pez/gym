import { cookies } from 'next/headers';
import { ActionResponse } from '../types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

async function handleResponse<T>(res: Response): Promise<ActionResponse<T>> {
  // If there's a Set-Cookie header, we might want to forward it.
  // This is handled in the actions usually, but let's make the token available if possible.
  
  if (!res.ok) {
    try {
      const errorData = await res.json();
      return { 
        data: null, 
        error: errorData.message || `Error ${res.status}: ${res.statusText}` 
      };
    } catch {
      return { 
        data: null, 
        error: `Error ${res.status}: ${res.statusText}` 
      };
    }
  }

  try {
    const data = await res.json();
    return { data, error: null };
  } catch {
    if (res.status === 204) return { data: {} as T, error: null };
    return { data: null, error: 'Failed to parse response' };
  }
}

const apiServer = {
  // Return both data and the original response for advanced cases like auth
  request: async <T>(url: string, init: RequestInit = {}): Promise<{ result: ActionResponse<T>, response: Response }> => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}${url}`, {
      ...init,
      headers: { ...headers, ...init.headers },
    });
    const result = await handleResponse<T>(res.clone());
    return { result, response: res };
  },

  get: async <T>(url: string, tags: string[] = []): Promise<ActionResponse<T>> => {
    const { result } = await apiServer.request<T>(url, { next: { tags } });
    return result;
  },

  post: async <T>(url: string, body: unknown): Promise<ActionResponse<T>> => {
    const { result } = await apiServer.request<T>(url, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return result;
  },
  
  // Custom post that returns the full response object
  postFull: async <T>(url: string, body: unknown): Promise<{ result: ActionResponse<T>, response: Response }> => {
    return apiServer.request<T>(url, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  patch: async <T>(url: string, body: unknown): Promise<ActionResponse<T>> => {
    const { result } = await apiServer.request<T>(url, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
    return result;
  },

  delete: async <T>(url: string): Promise<ActionResponse<T>> => {
    const { result } = await apiServer.request<T>(url, {
      method: 'DELETE',
    });
    return result;
  },
};


export default apiServer;

