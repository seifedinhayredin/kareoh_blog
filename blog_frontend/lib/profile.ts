import api from "./axios";


export interface UserProfile {
  bio: string;
  profession: string;
  education: string;
}


export interface UpdateProfileData {
  bio?: string;
  profession?: string;
  education?: string;
}


// =====================================
// GET PROFILE
// =====================================

export async function getProfile(): Promise<UserProfile> {

  const response =
    await api.get<UserProfile>(
      "/blog/auth/profile/"
    );

  return response.data;
}


// =====================================
// UPDATE PROFILE
// =====================================

export async function updateProfile(
  data: UpdateProfileData
): Promise<UserProfile> {

  const response =
    await api.patch<UserProfile>(
      "/blog/auth/profile/",
      data
    );

  return response.data;
}