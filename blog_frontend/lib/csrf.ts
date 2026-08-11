import axios from "axios";

export async function getCsrfToken(): Promise<string> {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/csrf/`,
    {
      withCredentials: true,
    }
  );

  return response.data.csrfToken;
}