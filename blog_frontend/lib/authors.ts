import api from "./axios";

export interface PublicAuthor {
  username: string;
  first_name: string;
  last_name: string;
  bio: string;
  profession: string;
  education: string;
}

export async function getPublicAuthor(
  username: string
): Promise<PublicAuthor> {
  const response = await api.get(
    `/auth/authors/${encodeURIComponent(username)}/`
  );

  return response.data;
}