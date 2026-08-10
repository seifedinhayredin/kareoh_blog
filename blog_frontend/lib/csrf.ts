import api from "./axios";

export async function getCsrfToken(): Promise<string> {
  const response = await api.get("/auth/csrf/");

  return response.data.csrfToken;
}