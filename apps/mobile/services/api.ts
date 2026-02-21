const BASE_URL = process.env.EXPO_PUBLIC_URL;

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string;
};

export type ApiResponse<T> = {
  data: T;
  headers: Headers;
};

export const apiRequest = async <T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> => {
  const { method = "GET", body, token } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
  });

  const rawBody = await response.text();
  let data: unknown = null;

  if (rawBody) {
    try {
      data = JSON.parse(rawBody);
    } catch {
      data = rawBody;
    }
  }

  if (!response.ok) {
    const messageFromBody =
      data && typeof data === "object" && "message" in data
        ? data.message
        : null;

    const message =
      typeof messageFromBody === "string" && messageFromBody.trim()
        ? messageFromBody
        : typeof data === "string" && data.trim()
          ? data
          : "Something went wrong";

    throw new Error(message);
  }

  return {
    data: (data ?? {}) as T,
    headers: response.headers,
  };
}
