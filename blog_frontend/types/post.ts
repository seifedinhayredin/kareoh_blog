export interface Author {
  id: number;
  username:string;
  first_name: string;
  last_name: string;
}
export interface Post {
  id: number;
  title: string;
  slug: string;
  author: Author;
  body: string;
  publish: string;
  created: string;
  updated: string;
  status: "DR" | "PB";

   like_count: number;
  is_liked: boolean;

  share_count: number;
  has_shared: boolean;
}

export interface CreatePostData {
  title: string;
  body: string;
  status: "DR" | "PB";
}

export interface CommentAuthor {
  id: number;
  first_name: string;
  last_name: string;
}

export interface Comment {
  id: number;
  post: number;
  author: CommentAuthor;
  body: string;
  created: string;
  updated: string;
  active: boolean;
}

export interface PaginatedPosts {
  count: number;
  next: string | null;
  previous: string | null;
  results: Post[];
}