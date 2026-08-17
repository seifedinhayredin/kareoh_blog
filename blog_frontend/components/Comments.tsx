"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  MessageCircle,
  Pencil,
  Send,
  Trash2,
  User,
  X,
  Check,
  Loader2,
  AlertCircle,
} from "lucide-react";

import {
  createComment,
  deleteComment,
  getComments,
  updateComment,
} from "@/lib/posts";

import { Comment } from "@/types/post";

interface CommentsProps {
  slug: string;
  userId?: number;
}

export default function Comments({
  slug,
  userId,
}: CommentsProps) {
  const [comments, setComments] =
    useState<Comment[]>([]);

  const [body, setBody] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  // Comment currently being edited
  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [editingBody, setEditingBody] =
    useState("");

  // Comment currently being deleted
  const [deletingId, setDeletingId] =
    useState<number | null>(null);

  // =========================
  // LOAD COMMENTS
  // =========================

  useEffect(() => {
    async function loadComments() {
      try {
        setLoading(true);
        setError("");

        const data =
          await getComments(slug);

        setComments(data);
      } catch (error) {
        console.error(error);

        setError(
          "Failed to load comments."
        );
      } finally {
        setLoading(false);
      }
    }

    loadComments();
  }, [slug]);

  // =========================
  // CREATE COMMENT
  // =========================

  async function handleCreateComment(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const trimmedBody =
      body.trim();

    if (!trimmedBody) {
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const newComment =
        await createComment(
          slug,
          trimmedBody
        );

      setComments((current) => [
        ...current,
        newComment,
      ]);

      setBody("");
    } catch (error) {
      console.error(error);

      setError(
        "Failed to add comment."
      );
    } finally {
      setSubmitting(false);
    }
  }

  // =========================
  // START EDIT
  // =========================

  function handleStartEdit(
    comment: Comment
  ) {
    setEditingId(comment.id);
    setEditingBody(comment.body);
    setError("");
  }

  // =========================
  // CANCEL EDIT
  // =========================

  function handleCancelEdit() {
    setEditingId(null);
    setEditingBody("");
  }

  // =========================
  // SAVE EDIT
  // =========================

  async function handleUpdateComment(
    commentId: number
  ) {
    const trimmedBody =
      editingBody.trim();

    if (!trimmedBody) {
      return;
    }

    try {
      setError("");

      const updatedComment =
        await updateComment(
          slug,
          commentId,
          trimmedBody
        );

      setComments((current) =>
        current.map((comment) =>
          comment.id === commentId
            ? updatedComment
            : comment
        )
      );

      setEditingId(null);
      setEditingBody("");
    } catch (error) {
      console.error(error);

      setError(
        "Failed to update comment."
      );
    }
  }

  // =========================
  // DELETE COMMENT
  // =========================

  async function handleDeleteComment(
    commentId: number
  ) {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this comment?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(commentId);
      setError("");

      await deleteComment(
        slug,
        commentId
      );

      setComments((current) =>
        current.filter(
          (comment) =>
            comment.id !== commentId
        )
      );
    } catch (error) {
      console.error(error);

      setError(
        "Failed to delete comment."
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section>

      {/* =========================
          HEADER
      ========================= */}

      <div className="mb-7 flex items-center gap-3">

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100">
          <MessageCircle className="h-5 w-5 text-blue-600" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
            Comments
          </h2>

          <p className="mt-0.5 text-sm text-slate-500">
            {comments.length}{" "}
            {comments.length === 1
              ? "comment"
              : "comments"}
          </p>
        </div>

      </div>

      {/* =========================
          ERROR
      ========================= */}

      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">

          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

          <p className="break-words">
            {error}
          </p>

        </div>
      )}

      {/* =========================
          CREATE COMMENT
      ========================= */}

      {userId ? (
        <form
          onSubmit={handleCreateComment}
          className="mb-8"
        >
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5">

            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                <User className="h-4 w-4 text-blue-600" />
              </div>

              <span className="text-sm font-semibold text-slate-700">
                Join the discussion
              </span>
            </div>

            <textarea
              value={body}
              onChange={(event) =>
                setBody(event.target.value)
              }
              placeholder="Share your thoughts..."
              rows={4}
              disabled={submitting}
              className="w-full resize-y rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100 sm:text-base"
            />

            <div className="mt-3 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">

              <p className="text-xs text-slate-400">
                Be respectful and constructive.
              </p>

              <button
                type="submit"
                disabled={
                  submitting ||
                  !body.trim()
                }
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Post Comment
                  </>
                )}
              </button>

            </div>
          </div>
        </form>
      ) : (
        <div className="mb-8 rounded-xl border border-slate-200 bg-slate-50 p-5 text-center sm:p-6">

          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-slate-200">
            <MessageCircle className="h-5 w-5 text-slate-500" />
          </div>

          <p className="mt-3 text-sm font-medium text-slate-700">
            Want to join the conversation?
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Log in to leave a comment.
          </p>

        </div>
      )}

      {/* =========================
          COMMENTS
      ========================= */}

      {loading ? (
        <div className="space-y-4">

          {[1, 2].map((item) => (
            <div
              key={item}
              className="rounded-xl border border-slate-200 p-5"
            >
              <div className="flex items-center gap-3">

                <div className="h-10 w-10 animate-pulse rounded-full bg-slate-200" />

                <div className="space-y-2">
                  <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
                  <div className="h-3 w-20 animate-pulse rounded bg-slate-200" />
                </div>

              </div>

              <div className="mt-5 space-y-2">
                <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
                <div className="h-4 w-11/12 animate-pulse rounded bg-slate-200" />
                <div className="h-4 w-8/12 animate-pulse rounded bg-slate-200" />
              </div>
            </div>
          ))}

        </div>
      ) : comments.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center sm:p-10">

          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
            <MessageCircle className="h-6 w-6 text-slate-400" />
          </div>

          <p className="mt-4 font-medium text-slate-700">
            No comments yet
          </p>

          {userId ? (
            <p className="mt-1 text-sm text-slate-400">
              Be the first person to share your thoughts.
            </p>
          ) : (
            <p className="mt-1 text-sm text-slate-400">
              Log in to start the conversation.
            </p>
          )}

        </div>
      ) : (
        <div className="space-y-4">

          {comments.map((comment) => {
            const isOwner =
              userId === comment.author.id;

            const isEditing =
              editingId === comment.id;

            const isDeleting =
              deletingId === comment.id;

            return (
              <article
                key={comment.id}
                className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 sm:p-5"
              >

                {/* =====================
                    COMMENT HEADER
                ===================== */}

                <div className="flex items-start justify-between gap-3">

                  <div className="flex min-w-0 items-center gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                      <User className="h-4 w-4" />
                    </div>

                    <div className="min-w-0">

                      <p className="truncate text-sm font-semibold text-slate-900">
                        {comment.author.first_name}{" "}
                        {comment.author.last_name}
                      </p>

                      <p className="mt-0.5 text-xs text-slate-400">
                        {new Date(
                          comment.created
                        ).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </p>

                    </div>

                  </div>

                  {/* =====================
                      OWNER ACTIONS
                  ===================== */}

                  {isOwner && !isEditing && (
                    <div className="flex shrink-0 gap-1 sm:gap-2">

                      <button
                        type="button"
                        onClick={() =>
                          handleStartEdit(
                            comment
                          )
                        }
                        className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold text-blue-600 transition hover:bg-blue-50 sm:px-3 sm:text-sm"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        <span className="hidden xs:inline sm:inline">
                          Edit
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteComment(
                            comment.id
                          )
                        }
                        disabled={isDeleting}
                        className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 sm:px-3 sm:text-sm"
                      >
                        {isDeleting ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}

                        <span className="hidden sm:inline">
                          {isDeleting
                            ? "Deleting..."
                            : "Delete"}
                        </span>
                      </button>

                    </div>
                  )}

                </div>

                {/* =====================
                    EDIT MODE
                ===================== */}

                {isEditing ? (
                  <div className="mt-5">

                    <textarea
                      value={editingBody}
                      onChange={(event) =>
                        setEditingBody(
                          event.target.value
                        )
                      }
                      rows={4}
                      disabled={isDeleting}
                      className="w-full resize-y rounded-lg border border-blue-300 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 sm:text-base"
                    />

                    <div className="mt-3 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">

                      <button
                        type="button"
                        onClick={
                          handleCancelEdit
                        }
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        <X className="h-4 w-4" />
                        Cancel
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateComment(
                            comment.id
                          )
                        }
                        disabled={
                          !editingBody.trim()
                        }
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Check className="h-4 w-4" />
                        Save Changes
                      </button>

                    </div>

                  </div>
                ) : (
                  /* =====================
                     NORMAL COMMENT
                  ===================== */

                  <p className="mt-4 break-words whitespace-pre-wrap text-sm leading-7 text-slate-700 sm:text-base">
                    {comment.body}
                  </p>
                )}

              </article>
            );
          })}

        </div>
      )}

    </section>
  );
}