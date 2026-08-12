export interface Post {
  id: number;
  title: string;
  slug: string;
  author: number;
  body: string;
  publish: string;
  created: string;
  updated: string;
  status: "DR" | "PB";
}

export interface CreatePostData {
  title: string;
  body: string;
}