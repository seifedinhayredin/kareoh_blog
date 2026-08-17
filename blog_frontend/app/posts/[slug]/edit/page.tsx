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

import {
  AlertCircle,
  ArrowLeft,
  Edit3,
  FileText,
  Loader2,
  Save,
  Send,
  X,
} from "lucide-react";

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

  const [post, setPost] = useState<Post | null>(null);

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

        setError("Failed to load the post.");
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

      router.push(`/posts/${slug}`);
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

          setError(messages.join(" | "));
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
        <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

              <div className="flex items-center gap-3">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />

                <div>
                  <h1 className="text-lg font-semibold text-slate-900">
                    Loading post
                  </h1>

                  <p className="mt-1 text-sm text-slate-500">
                    Please wait while we load your post.
                  </p>
                </div>
              </div>

              {/* Skeleton */}
              <div className="mt-8 space-y-6">
                <div>
                  <div className="mb-2 h-4 w-20 animate-pulse rounded bg-slate-200" />
                  <div className="h-12 w-full animate-pulse rounded-lg bg-slate-200" />
                </div>

                <div>
                  <div className="mb-2 h-4 w-20 animate-pulse rounded bg-slate-200" />

                  <div className="h-80 w-full animate-pulse rounded-lg bg-slate-200" />
                </div>
              </div>
            </div>
          </div>
        </main>
      </ProtectedRoute>
    );
  }

  // =========================
  // OWNERSHIP ERROR
  // =========================

  if (
    post &&
    user &&
    post.author.id !== user.id
  ) {
    return (
      <ProtectedRoute>
        <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8">
          <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-6 text-center shadow-sm sm:p-8">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-7 w-7 text-red-600" />
            </div>

            <h1 className="mt-5 text-xl font-bold text-slate-900">
              Access denied
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              You do not have permission to edit this post.
              Only the author can make changes.
            </p>

            <button
              type="button"
              onClick={() =>
                router.push(`/posts/${slug}`)
              }
              className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Post
            </button>
          </div>
        </main>
      </ProtectedRoute>
    );
  }

  // =========================
  // LOAD ERROR
  // =========================

  if (error && !post) {
    return (
      <ProtectedRoute>
        <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8">
          <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-6 text-center shadow-sm sm:p-8">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-7 w-7 text-red-600" />
            </div>

            <h1 className="mt-5 text-xl font-bold text-slate-900">
              Unable to load post
            </h1>

            <p className="mt-2 break-words text-sm leading-6 text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={() => router.back()}
              className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-300 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </button>
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
      <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mx-auto max-w-4xl">

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100">
                <Edit3 className="h-6 w-6 text-blue-600" />
              </div>

              <div className="min-w-0">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Edit Post
                </h1>

                <p className="mt-1 text-sm text-slate-500 sm:text-base">
                  Update your article and keep your readers
                  informed.
                </p>
              </div>
            </div>
          </div>

          {/* Editor Card */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

            {/* Error */}
            {error && (
              <div className="mx-5 mt-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:mx-6">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

                <p className="break-words">
                  {error}
                </p>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="p-5 sm:p-6 lg:p-8"
            >
              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Post Title
                </label>

                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(event) =>
                    setTitle(event.target.value)
                  }
                  disabled={saving}
                  placeholder="Enter post title..."
                  className="h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-base font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                />
              </div>

              {/* Content */}
              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between gap-4">
                  <label
                    htmlFor="body"
                    className="block text-sm font-semibold text-slate-700"
                  >
                    Content
                  </label>

                  <span className="shrink-0 text-xs text-slate-400">
                    {body.length.toLocaleString()} characters
                  </span>
                </div>

                <textarea
                  id="body"
                  value={body}
                  onChange={(event) =>
                    setBody(event.target.value)
                  }
                  disabled={saving}
                  rows={18}
                  placeholder="Write your post here..."
                  className="min-h-[320px] w-full resize-y rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm leading-7 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50 sm:min-h-[420px] sm:text-base"
                />

                <p className="mt-2 text-xs text-slate-400">
                  Make your changes and save when you're ready.
                </p>
              </div>

              {/* Status */}
              <div className="mt-7">
                <fieldset>
                  <legend className="mb-3 text-sm font-semibold text-slate-700">
                    Publication Status
                  </legend>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                    {/* Draft */}
                    <label
                      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                        status === "DR"
                          ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="status"
                        value="DR"
                        checked={status === "DR"}
                        onChange={() =>
                          setStatus("DR")
                        }
                        disabled={saving}
                        className="mt-1 h-4 w-4 accent-blue-600"
                      />

                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          Draft
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          Keep the post private while you
                          continue editing.
                        </p>
                      </div>
                    </label>

                    {/* Published */}
                    <label
                      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                        status === "PB"
                          ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="status"
                        value="PB"
                        checked={status === "PB"}
                        onChange={() =>
                          setStatus("PB")
                        }
                        disabled={saving}
                        className="mt-1 h-4 w-4 accent-blue-600"
                      />

                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          Published
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          Make the updated post visible to
                          readers.
                        </p>
                      </div>
                    </label>
                  </div>
                </fieldset>
              </div>

              {/* Actions */}
              <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-between">

                {/* Back */}
                <button
                  type="button"
                  disabled={saving}
                  onClick={() =>
                    router.push(
                      `/posts/${slug}`
                    )
                  }
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-slate-300 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Cancel
                </button>

                {/* Save */}
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Saving...
                    </>
                  ) : status === "PB" ? (
                    <>
                      <Send className="h-4 w-4" />
                      Save & Publish
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Draft
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Bottom navigation */}
          <div className="mt-5">
            <button
              type="button"
              onClick={() =>
                router.push(`/posts/${slug}`)
              }
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
            >
              <ArrowLeft className="h-4 w-4" />
              Return to post
            </button>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}