"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/components/AuthProvider";

import {
  getPost,
  updatePost,
} from "@/lib/posts";

import { Post } from "@/types/post";

export default function EditPostPage() {
  const params = useParams();

  const router = useRouter();

  const slug = params.slug as string;

  const [post, setPost] = useState<Post | null>(
    null
  );

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<"DR" | "PB">("DR");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const { user } = useAuth();

  // =========================
  // LOAD POST
  // =========================

  useEffect(() => {
    async function loadPost() {
      try {
        const data = await getPost(slug);

        setPost(data);

        setTitle(data.title);
        setBody(data.body);
        setStatus(data.status);

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

  // =========================
  // SUBMIT
  // =========================

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

    setSaving(true);

    try {
      await updatePost(slug, {
        title,
        body,
        status,
      });

      // Go back to post detail
      router.push(`/posts/${slug}`);

      // Refresh the page data
      router.refresh();

    } catch (error: any) {
      console.error(error);

      const responseData =
        error.response?.data;

      if (responseData) {
        if (
          typeof responseData === "object"
        ) {
          const messages: string[] = [];

          Object.entries(
            responseData
          ).forEach(
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

          setError(
            messages.join(" | ")
          );
        } else {
          setError(
            "Failed to update post."
          );
        }
      } else {
        setError(
          "Unable to connect to the server."
        );
      }
    } finally {
      setSaving(false);
    }
  }

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <ProtectedRoute>
        <main className="mx-auto max-w-3xl p-10">
          <p>Loading post...</p>
        </main>
      </ProtectedRoute>
    );
  }

  // =========================
  // ERROR
  // =========================

if (
  post &&
  user &&
  post.author.id !== user.id
) {
  return (
    <ProtectedRoute>
      <main className="mx-auto max-w-3xl p-10">
        <div className="rounded-md bg-red-100 p-4 text-red-700">
          You do not have permission to edit this post.
        </div>
      </main>
    </ProtectedRoute>
  );
}

  if (error && !post) {
    return (
      <ProtectedRoute>
        <main className="mx-auto max-w-3xl p-10">
          <div className="rounded-md bg-red-100 p-4 text-red-700">
            {error}
          </div>
        </main>
      </ProtectedRoute>
    );
  }

  // =========================
  // PAGE
  // =========================

  return (
    <ProtectedRoute>
      <main className="mx-auto max-w-3xl p-10">

        <h1 className="mb-8 text-3xl font-bold">
          Edit Post
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

          {/* TITLE */}

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
                setTitle(
                  event.target.value
                )
              }
              disabled={saving}
              className="w-full rounded-md border p-3 outline-none focus:border-blue-500"
            />
          </div>

          {/* BODY */}

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
                setBody(
                  event.target.value
                )
              }
              disabled={saving}
              rows={15}
              className="w-full resize-y rounded-md border p-3 outline-none focus:border-blue-500"
            />
          </div>
          <div>
  <label className="mb-3 block font-medium">
    Status
  </label>

  <div className="flex gap-6">

    <label className="flex items-center gap-2">
      <input
        type="radio"
        name="status"
        value="DR"
        checked={status === "DR"}
        onChange={() => setStatus("DR")}
        disabled={saving}
      />

      Draft
    </label>

    <label className="flex items-center gap-2">
      <input
        type="radio"
        name="status"
        value="PB"
        checked={status === "PB"}
        onChange={() => setStatus("PB")}
        disabled={saving}
      />

      Published
    </label>

  </div>
</div>

          {/* BUTTONS */}

          <div className="flex gap-4">

            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={() =>
                router.push(
                  `/posts/${slug}`
                )
              }
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