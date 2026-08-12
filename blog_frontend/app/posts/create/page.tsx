"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import ProtectedRoute from "@/components/ProtectedRoute";
import { createPost } from "@/lib/posts";
import { useAuth } from "@/components/AuthProvider";

export default function CreatePostPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    if (!body.trim()) {
      setError("Content is required.");
      return;
    }

    setLoading(true);

    try {
      const post = await createPost({
        title,
        body,
      });

      console.log("Created post:", post);

      router.push("/");
    } catch (error: any) {
      console.error(error);

      const data = error.response?.data;

      if (data) {
        if (typeof data === "object") {
          const messages: string[] = [];

          Object.entries(data).forEach(
            ([field, value]) => {
              if (Array.isArray(value)) {
                messages.push(
                  `${field}: ${value.join(", ")}`
                );
              } else {
                messages.push(
                  `${field}: ${value}`
                );
              }
            }
          );

          setError(messages.join(" | "));
        } else {
          setError("Failed to create post.");
        }
      } else {
        setError(
          "Unable to connect to the server."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <ProtectedRoute>
      <main className="mx-auto max-w-3xl p-10">

        <h1 className="mb-8 text-3xl font-bold">
          Create New Post
        </h1>

        {error && (
          <div className="mb-6 rounded-md bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="mb-2 block font-medium"
            >
              Title
            </label>

            <input
              id="title"
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              placeholder="Enter post title"
              className="w-full rounded-md border p-3 outline-none focus:border-blue-500"
              disabled={loading}
            />
          </div>

          {/* Content */}
          <div>
            <label
              htmlFor="body"
              className="mb-2 block font-medium"
            >
              Content
            </label>

            <textarea
              id="body"
              value={body}
              onChange={(event) =>
                setBody(event.target.value)
              }
              placeholder="Write your post..."
              rows={12}
              className="w-full resize-y rounded-md border p-3 outline-none focus:border-blue-500"
              disabled={loading}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4">

            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Publishing..."
                : "Publish Post"}
            </button>

            <button
              type="button"
              onClick={() => router.back()}
              disabled={loading}
              className="rounded-md border px-6 py-3 font-medium hover:bg-gray-100"
            >
              Cancel
            </button>

          </div>

        </form>

      </main>
    </ProtectedRoute>
  );
}