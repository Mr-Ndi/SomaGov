const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export async function apiRequest<T>(
  path: string,
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' = 'GET',
  body?: Record<string, unknown>,
  token?: string
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    throw new Error(`API Error: ${res.status}`);
  }

  return await res.json();
}
