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
  slug: string
): Promise<Post> {
  const response = await api.get<Post>(
    `/blog/posts/${slug}/`
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
  slug: string,
  data: CreatePostData
): Promise<Post> {
  const csrfToken = await getCsrfToken();

  const response = await api.patch<Post>(
    `/blog/posts/${slug}/`,
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
  slug: string
): Promise<void> {
  const csrfToken = await getCsrfToken();

  await api.delete(
    `/blog/posts/${slug}/`,
    {
      headers: {
        "X-CSRFToken": csrfToken,
      },
    }
  );
}

// =========================
// GET MY POSTS
// =========================

export async function getMyPosts(): Promise<Post[]> {
  const response = await api.get<Post[]>(
    "/blog/posts/mine/"
  );

  return response.data;
}