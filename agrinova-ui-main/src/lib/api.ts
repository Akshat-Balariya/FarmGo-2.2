const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim() ?? "";
const CHAT_API_BASE_URL = import.meta.env.VITE_CHAT_API_BASE_URL?.trim() ?? "";

type Target = "api" | "chat";

type ApiErrorPayload = {
  message?: string;
  error?: string;
};

const buildUrl = (path: string, target: Target = "api") => {
  if (/^https?:\/\//.test(path)) return path;
  const base = target === "chat" ? CHAT_API_BASE_URL : API_BASE_URL;
  return base ? `${base}${path}` : path;
};

export const requestJson = async <T>(
  path: string,
  init?: RequestInit,
  target: Target = "api",
): Promise<T> => {
  const headers = new Headers(init?.headers ?? undefined);
  const hasBody = init?.body !== undefined && init?.body !== null;

  if (hasBody && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(buildUrl(path, target), {
    ...init,
    headers,
  });

  const contentType = response.headers.get("content-type") ?? "";
  const payload = (contentType.includes("application/json")
    ? await response.json().catch(() => null)
    : null) as ApiErrorPayload | T | null;

  if (!response.ok) {
    const errorMessage =
      (payload as ApiErrorPayload | null)?.message ||
      (payload as ApiErrorPayload | null)?.error ||
      "Request failed. Please try again.";
    throw new Error(errorMessage);
  }

  if (payload === null || typeof payload !== "object") {
    throw new Error("Server returned an invalid response. Check API base URL and backend route.");
  }

  return payload as T;
};

export const apiConfig = {
  apiBaseUrl: API_BASE_URL,
  chatApiBaseUrl: CHAT_API_BASE_URL,
};
