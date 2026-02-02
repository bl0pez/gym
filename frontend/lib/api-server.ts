import { cookies } from 'next/headers';

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

const apiServer = {
  get: async (url: string, options: RequestInit = {}) => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}${url}`, {
      ...options,
      headers: { ...headers, ...options.headers },
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return { data: await res.json() };
  },
  post: async (url: string, body: any, options: RequestInit = {}) => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}${url}`, {
      method: 'POST',
      body: JSON.stringify(body),
      ...options,
      headers: { ...headers, ...options.headers },
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return { data: await res.json() };
  },
  patch: async (url: string, body: any, options: RequestInit = {}) => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}${url}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
      ...options,
      headers: { ...headers, ...options.headers },
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return { data: await res.json() };
  },
  delete: async (url: string, options: RequestInit = {}) => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}${url}`, {
      method: 'DELETE',
      ...options,
      headers: { ...headers, ...options.headers },
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return { data: await res.json() };
  },
};

export default apiServer;
