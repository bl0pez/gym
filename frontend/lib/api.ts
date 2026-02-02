import Cookies from 'js-cookie';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

function getAuthHeaders() {
  const token = Cookies.get('token');
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };


  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

const api = {
  get: async (url: string, options: RequestInit = {}) => {
    const headers = getAuthHeaders();
    const res = await fetch(`${BASE_URL}${url}`, {
      ...options,
      headers: { ...headers, ...options.headers },
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return { data: await res.json() };
  },
  post: async (url: string, body: any, options: RequestInit = {}) => {
    const headers = getAuthHeaders();
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
    const headers = getAuthHeaders();
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
    const headers = getAuthHeaders();
    const res = await fetch(`${BASE_URL}${url}`, {
      method: 'DELETE',
      ...options,
      headers: { ...headers, ...options.headers },
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return { data: await res.json() };
  },
};

export default api;
