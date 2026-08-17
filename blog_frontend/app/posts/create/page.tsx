"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  FileText,
  Loader2,
  Save,
  Send,
  X,
} from "lucide-react";

import ProtectedRoute from "@/components/ProtectedRoute";
import { createPost } from "@/lib/posts";

export default function CreatePostPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<"DR" | "PB">("DR");

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
        status,
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
      <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mx-auto max-w-4xl">

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Create New Post
                </h1>

                <p className="mt-1 text-sm text-slate-500 sm:text-base">
                  Share your thoughts, ideas, and knowledge.
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
                  placeholder="Enter a compelling title..."
                  className="h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-base font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                  disabled={loading}
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
                  placeholder="Write your post here..."
                  rows={18}
                  className="min-h-[320px] w-full resize-y rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm leading-7 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50 sm:min-h-[420px] sm:text-base"
                  disabled={loading}
                />

                <p className="mt-2 text-xs text-slate-400">
                  Write your article naturally. You can resize
                  the editor vertically as needed.
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
                        disabled={loading}
                        className="mt-1 h-4 w-4 accent-blue-600"
                      />

                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          Draft
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          Save the post privately and
                          continue editing later.
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
                        disabled={loading}
                        className="mt-1 h-4 w-4 accent-blue-600"
                      />

                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          Published
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          Make this post available to
                          your blog readers.
                        </p>
                      </div>
                    </label>
                  </div>
                </fieldset>
              </div>

              {/* Actions */}
              <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">

                {/* Cancel */}
                <button
                  type="button"
                  onClick={() => router.back()}
                  disabled={loading}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-slate-300 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      {status === "PB"
                        ? "Publishing..."
                        : "Saving..."}
                    </>
                  ) : status === "PB" ? (
                    <>
                      <Send className="h-4 w-4" />
                      Publish Post
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
        </div>
      </main>
    </ProtectedRoute>
  );
}