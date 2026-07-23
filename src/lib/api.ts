const API_URL = process.env.NEXT_PUBLIC_INFRA_URL || '';

export const apiClient = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('session_token')
      : null;

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  // Si el endpoint empieza con /, lo concatenamos, si no, directo.
  const url = endpoint.startsWith('/') ? `${API_URL}${endpoint}` : `${API_URL}/${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    // credentials eliminado para ser compatible con CORS *
  });

  return response;
};
