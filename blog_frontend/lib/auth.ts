import api from "./axios";
import { getCsrfToken } from "./csrf";

import {
  AuthResponse,
  RegisterData,
  User,
} from "@/types/auth";

// =========================
// LOGIN
// =========================

export async function login(
  username: string,
  password: string
): Promise<AuthResponse> {
  const csrfToken = await getCsrfToken();

  const response = await api.post<AuthResponse>(
    "/auth/login/",
    {
      username,
      password,
    },
    {
      headers: {
        "X-CSRFToken": csrfToken,
      },
    }
  );

  return response.data;
}

// =========================
// REGISTER
// =========================

export async function register(
  data: RegisterData
) {
  const csrfToken = await getCsrfToken();

  const response = await api.post(
    "/auth/register/",
    data,
    {
      headers: {
        "X-CSRFToken": csrfToken,
      },
    }
  );

  return response.data;
}

// =========================
// GET CURRENT USER
// =========================

export async function getCurrentUser(): Promise<User> {
  const response = await api.get<User>(
    "/auth/me/"
  );

  return response.data;
}

// =========================
// REFRESH TOKEN
// =========================

export async function refreshToken() {
  const csrfToken = await getCsrfToken();

  const response = await api.post(
    "/auth/refresh/",
    {},
    {
      headers: {
        "X-CSRFToken": csrfToken,
      },
    }
  );

  return response.data;
}

// =========================
// LOGOUT
// =========================

export async function logout() {
  const csrfToken = await getCsrfToken();

  const response = await api.post(
    "/auth/logout/",
    {},
    {
      headers: {
        "X-CSRFToken": csrfToken,
      },
    }
  );

  return response.data;
}

export interface ChangePasswordData {
  current_password: string;
  new_password: string;
}

export async function changePassword(
  data: ChangePasswordData
) {
  
  const csrfToken = await getCsrfToken();

  const response = await api.patch(
    "/auth/change-password/",
    data,
    {
      headers: {
        "X-CSRFToken": csrfToken,
      },
    }
  );

  return response.data;
}