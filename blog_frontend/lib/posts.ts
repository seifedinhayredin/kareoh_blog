import api from "./axios";
import { getCsrfToken } from "./csrf";

import {
  Post,
  CreatePostData,
} from "@/types/post";

// =========================
// GET ALL POSTS
// =========================

export async function getPosts(): Promise<Post[]> {
  const response = await api.get<Post[]>(
    "/blog/posts/"
  );

  return response.data;
}

// =========================
// GET SINGLE POST
// =========================

export async function getPost(
  id: number
): Promise<Post> {
  const response = await api.get<Post>(
    `/blog/posts/${id}/`
  );

  return response.data;
}

// =========================
// CREATE POST
// =========================

export async function createPost(
  data: CreatePostData
): Promise<Post> {
  const csrfToken = await getCsrfToken();

  const response = await api.post<Post>(
    "/blog/posts/",
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
// UPDATE POST
// =========================

export async function updatePost(
  id: number,
  data: CreatePostData
): Promise<Post> {
  const csrfToken = await getCsrfToken();

  const response = await api.put<Post>(
    `/blog/posts/${id}/`,
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
// DELETE POST
// =========================

export async function deletePost(
  id: number
): Promise<void> {
  const csrfToken = await getCsrfToken();

  await api.delete(
    `/blog/posts/${id}/`,
    {
      headers: {
        "X-CSRFToken": csrfToken,
      },
    }
  );
}