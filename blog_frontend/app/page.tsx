"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getPosts } from "@/lib/posts";
import { Post } from "@/types/post";

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPosts() {
      try {
        const data = await getPosts();

        setPosts(data);
      } catch (error) {
        console.error(error);

        setError(
          "Failed to load posts."
        );
      } finally {
        setLoading(false);
      }
    }

    loadPosts();
  }, []);

  if (loading) {
    return (
      <main className="p-10">
        <p>Loading posts...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-10">
        <p className="text-red-600">
          {error}
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl p-10">

      <h1 className="mb-8 text-3xl font-bold">
        Blog Posts
      </h1>

      {posts.length === 0 ? (
        <p>
          No posts available.
        </p>
      ) : (
        <div className="space-y-6">

          {posts.map((post) => (
            <article
            key={post.id}
            className="rounded-lg border p-6 shadow-sm"
          >
            <Link
              href={`/posts/${post.slug}`}
              className="text-2xl font-semibold hover:text-blue-600"
            >
              {post.title}
            </Link>

            <p className="mt-3 text-gray-700">
              {post.body}
            </p>

            <div className="mt-4 text-sm text-gray-500">
              Published:{" "}
              {new Date(
                post.publish
              ).toLocaleDateString()}
            </div>
          </article>
          ))}

        </div>
      )}

    </main>
  );
}