const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export async function apiClient<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: "include", // envía la cookie httpOnly automáticamente
    headers: {
      ...(options?.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message ?? "Error desconocido");
  }

  return res.json();
}
