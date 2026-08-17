"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

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


  // ID of comment currently being edited
  const [editingId, setEditingId] =
    useState<number | null>(null);

  // Text currently being edited
  const [editingBody, setEditingBody] =
    useState("");

  // ID of comment currently being deleted
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
  // START EDITING
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

    <section className="mt-12 border-t pt-10">

      {/* =========================
          HEADER
      ========================= */}

      <div className="mb-8">

        <h2 className="text-2xl font-bold">
          Comments
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          {comments.length}{" "}
          {comments.length === 1
            ? "comment"
            : "comments"}
        </p>

      </div>


      {/* =========================
          ERROR
      ========================= */}

      {error && (

        <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>

      )}


      {/* =========================
          CREATE FORM
      ========================= */}

      {userId ? (

        <form
          onSubmit={handleCreateComment}
          className="mb-10"
        >

          <textarea
            value={body}
            onChange={(event) =>
              setBody(event.target.value)
            }
            placeholder="Write a comment..."
            rows={4}
            className="w-full resize-y rounded-lg border border-gray-300 p-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          <div className="mt-3 flex justify-end">

            <button
              type="submit"
              disabled={
                submitting ||
                !body.trim()
              }
              className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting
                ? "Posting..."
                : "Post Comment"}
            </button>

          </div>

        </form>

      ) : (

        <div className="mb-10 rounded-lg border bg-gray-50 p-5 text-center">

          <p className="text-gray-600">
            Log in to leave a comment.
          </p>

        </div>

      )}


      {/* =========================
          COMMENTS LIST
      ========================= */}

      {loading ? (

        <p className="text-gray-500">
          Loading comments...
        </p>

      ) : comments.length === 0 ? (

        <div className="rounded-lg border p-8 text-center">

          <p className="text-gray-500">
            No comments yet.
          </p>

          {userId && (
            <p className="mt-1 text-sm text-gray-400">
              Be the first to comment.
            </p>
          )}

        </div>

      ) : (

        <div className="space-y-6">

          {comments.map((comment) => {

            // =========================
            // OWNERSHIP
            // =========================

            const isOwner =
              userId === comment.author.id;

            const isEditing =
              editingId === comment.id;

            const isDeleting =
              deletingId === comment.id;


            return (

              <article
                key={comment.id}
                className="rounded-xl border p-5"
              >

                {/* =====================
                    COMMENT HEADER
                ===================== */}

                <div className="flex items-start justify-between gap-4">

                  <div>

                    <p className="font-semibold">
                      {comment.author.first_name}{" "}
                      {comment.author.last_name}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {new Date(
                        comment.created
                      ).toLocaleDateString()}
                    </p>

                  </div>


                  {/* =====================
                      OWNER ACTIONS
                  ===================== */}

                  {isOwner && !isEditing && (

                    <div className="flex gap-2">

                      <button
                        type="button"
                        onClick={() =>
                          handleStartEdit(
                            comment
                          )
                        }
                        className="rounded-md px-3 py-1.5 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteComment(
                            comment.id
                          )
                        }
                        disabled={isDeleting}
                        className="rounded-md px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                      >
                        {isDeleting
                          ? "Deleting..."
                          : "Delete"}
                      </button>

                    </div>

                  )}

                </div>


                {/* =====================
                    EDIT MODE
                ===================== */}

                {isEditing ? (

                  <div className="mt-4">

                    <textarea
                      value={editingBody}
                      onChange={(event) =>
                        setEditingBody(
                          event.target.value
                        )
                      }
                      rows={4}
                      className="w-full resize-y rounded-lg border border-gray-300 p-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />

                    <div className="mt-3 flex justify-end gap-2">

                      <button
                        type="button"
                        onClick={
                          handleCancelEdit
                        }
                        className="rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-gray-50"
                      >
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
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Save
                      </button>

                    </div>

                  </div>

                ) : (

                  /* =====================
                     NORMAL COMMENT
                  ===================== */

                  <p className="mt-4 whitespace-pre-wrap break-words text-gray-700">
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