import api from "./axios";
import { getCsrfToken } from "./csrf";

import {
  Post,
  CreatePostData,
  Comment,
  PaginatedPosts,
} from "@/types/post";

// =========================
// GET ALL POSTS
// =========================

export async function getPosts(
  page: number = 1
): Promise<PaginatedPosts> {

  const response =
    await api.get<PaginatedPosts>(
      `/blog/posts/?page=${page}`
    );

  return response.data;
}

/*export async function getPosts(): Promise<Post[]> {
  const response = await api.get<Post[]>(
    "/blog/posts/"
  );

  return response.data;
}*/

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

// =========================
// GET COMMENTS
// =========================

export async function getComments(
  slug: string
): Promise<Comment[]> {

  const response = await api.get<Comment[]>(
    `/blog/posts/${slug}/comments/`
  );

  return response.data;
}

// =========================
// CREATE COMMENT
// =========================

export async function createComment(
  slug: string,
  body: string
): Promise<Comment> {

  const csrfToken = await getCsrfToken();

  const response = await api.post<Comment>(
    `/blog/posts/${slug}/comments/`,
    {
      body,
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
// UPDATE COMMENT
// =========================

export async function updateComment(
  slug: string,
  commentId: number,
  body: string
): Promise<Comment> {

  const response = await api.patch<Comment>(
    `/blog/posts/${slug}/comments/${commentId}/`,
    {
      body,
    }
  );

  return response.data;
}


// =========================
// DELETE COMMENT
// =========================

export async function deleteComment(
  slug: string,
  commentId: number
): Promise<void> {

  await api.delete(
    `/blog/posts/${slug}/comments/${commentId}/`
  );
}

// =========================
// LIKE POST
// =========================

export async function likePost(
  slug: string
) {

  const response = await api.post(
    `/blog/posts/${slug}/like/`
  );

  return response.data;
}

// =========================
// UNLIKE POST
// =========================

export async function unlikePost(
  slug: string
) {

  const response = await api.delete(
    `/blog/posts/${slug}/like/`
  );

  return response.data;
}

// Image upload
export async function uploadPostImage(
  slug: string,
  file: File
) {
  const formData = new FormData();

  formData.append(
    "image",
    file
  );

  const response = await api.post(
    `/blog/posts/${slug}/upload-image/`,
    formData
  );

  return response.data;
}

// Share post

// your existing interfaces and functions...

export interface SharePostResponse {
  message: string;
  share_count: number;
  has_shared: boolean;
}

export async function sharePost(
  slug: string
): Promise<SharePostResponse> {
  const response = await api.post<SharePostResponse>(
    `/blog/posts/${slug}/share/`
  );

  return response.data;
}