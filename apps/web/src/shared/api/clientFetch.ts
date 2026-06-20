import type { ApiResponse } from "@music-app/shared";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

type Params = Record<string, string | number | boolean>;

interface ApiClientOptions<B> {
  method?: HttpMethod;
  body?: B;
  params?: Params;
}

function createParams(params: Params): URLSearchParams {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    searchParams.append(key, String(value));
  });

  return searchParams;
}

export async function apiClient<T, B = unknown>(
  url: string,
  { method = "GET", body, params }: ApiClientOptions<B> = {},
): Promise<ApiResponse<T>> {
  let path = url;

  if (params) {
    path = `${path}?${createParams(params).toString()}`;
  }

  const fetchOptions: RequestInit = {
    method,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (body !== undefined && method !== "GET") {
    fetchOptions.body = JSON.stringify(body);
  }

  const response = await fetch(path, fetchOptions);

  return response.json() as Promise<ApiResponse<T>>;
}
