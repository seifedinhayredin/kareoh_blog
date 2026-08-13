"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { getPost } from "@/lib/posts";
import { Post } from "@/types/post";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

export default function PostDetailPage() {
  const params = useParams();
  const { user } = useAuth();
  const slug = params.slug as string;

  const [post, setPost] = useState<Post | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPost() {
      try {
        const data = await getPost(slug);

        setPost(data);
      } catch (error) {
        console.error(error);

        setError(
          "Failed to load the post."
        );
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      loadPost();
    }
  }, [slug]);

  if (loading) {
    return (
      <main className="mx-auto max-w-4xl p-10">
        <p>Loading post...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-4xl p-10">
        <div className="rounded-md bg-red-100 p-4 text-red-700">
          {error}
        </div>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="mx-auto max-w-4xl p-10">
        <p>Post not found.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">

      {/* Title */}
      <h1 className="text-4xl font-bold">
        {post.title}
      </h1>

      {/* Metadata */}
      <div className="mt-4 flex gap-4 text-sm text-gray-500">
        <span>
          Published{" "}
          {new Date(
            post.publish
          ).toLocaleDateString()}
        </span>

        <span>
          Status: {post.status === "PB"
            ? "Published"
            : "Draft"}
        </span>
      </div>

      {/* Divider */}
      <hr className="my-8" />

      {/* Body */}
      <article className="prose max-w-none">
        <p className="whitespace-pre-wrap leading-8">
          {post.body}
        </p>
      </article>

      {user && user.id === post.author && (
        <div className="mt-6">
          <Link
            href={`/posts/${post.slug}/edit`}
            className="rounded-md bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
          >
            Edit Post
          </Link>
        </div>
      )}
    </main>
  );
}