"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  deletePost,
  getMyPosts,
} from "@/lib/posts";

import { Post } from "@/types/post";

import ProtectedRoute from "@/components/ProtectedRoute";


export default function DashboardPage() {

  const [posts, setPosts] =
    useState<Post[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [deletingSlug, setDeletingSlug] =
    useState<string | null>(null);


  // =========================
  // LOAD POSTS
  // =========================

  async function loadPosts() {

    try {

      setLoading(true);

      const data =
        await getMyPosts();

      setPosts(data);

    } catch (error) {

      console.error(error);

      setError(
        "Failed to load your posts."
      );

    } finally {

      setLoading(false);

    }
  }


  useEffect(() => {

    loadPosts();

  }, []);


  // =========================
  // DELETE
  // =========================

  async function handleDelete(
    slug: string
  ) {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this post?"
      );

    if (!confirmed) {
      return;
    }


    try {

      setDeletingSlug(slug);

      await deletePost(slug);

      // Remove deleted post
      // from local state
      setPosts((currentPosts) =>
        currentPosts.filter(
          (post) =>
            post.slug !== slug
        )
      );

    } catch (error) {

      console.error(error);

      setError(
        "Failed to delete the post."
      );

    } finally {

      setDeletingSlug(null);

    }
  }


  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (

      <ProtectedRoute>

        <main className="mx-auto max-w-6xl p-10">

          <p>
            Loading your posts...
          </p>

        </main>

      </ProtectedRoute>

    );
  }


  // =========================
  // PAGE
  // =========================

  return (

    <ProtectedRoute>

      <main className="mx-auto max-w-6xl px-6 py-10">

        {/* HEADER */}

        <div className="mb-8 flex items-center justify-between">

          <div>

            <h1 className="text-3xl font-bold">
              My Posts
            </h1>

            <p className="mt-2 text-gray-500">
              Manage your blog posts and drafts.
            </p>

          </div>


          <Link
            href="/posts/create"
            className="rounded-md bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
          >
            Create Post
          </Link>

        </div>


        {/* ERROR */}

        {error && (

          <div className="mb-6 rounded-md bg-red-100 p-4 text-red-700">

            {error}

          </div>

        )}


        {/* EMPTY */}

        {posts.length === 0 ? (

          <div className="rounded-lg border p-10 text-center">

            <h2 className="text-xl font-semibold">
              You don't have any posts yet.
            </h2>

            <p className="mt-2 text-gray-500">
              Create your first blog post.
            </p>

            <Link
              href="/posts/create"
              className="mt-6 inline-block rounded-md bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
            >
              Create Post
            </Link>

          </div>

        ) : (

          <div className="overflow-hidden rounded-lg border">

            {/* TABLE HEADER */}

            <div className="hidden grid-cols-[1fr_140px_180px] gap-4 border-b bg-gray-50 px-6 py-4 font-medium md:grid">

              <div>
                Post
              </div>

              <div>
                Status
              </div>

              <div>
                Actions
              </div>

            </div>


            {/* POSTS */}

            {posts.map((post) => (

              <div
                key={post.id}
                className="grid gap-4 border-b px-6 py-5 last:border-b-0 md:grid-cols-[1fr_140px_180px] md:items-center"
              >

                {/* POST */}

                <div>

                  <Link
                    href={`/posts/${post.slug}`}
                    className="font-semibold hover:text-blue-600"
                  >
                    {post.title}
                  </Link>

                  <p className="mt-1 text-sm text-gray-500">
                    Updated{" "}
                    {new Date(
                      post.updated
                    ).toLocaleDateString()}
                  </p>

                </div>


                {/* STATUS */}

                <div>

                  {post.status === "PB" ? (

                    <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                      Published
                    </span>

                  ) : (

                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm text-yellow-700">
                      Draft
                    </span>

                  )}

                </div>


                {/* ACTIONS */}

                <div className="flex flex-wrap gap-2">

                  <Link
                        href={`/posts/${post.slug}`}
                        className="rounded border px-3 py-1.5 text-sm hover:bg-gray-50"
                      >
                        {post.status === "PB"
                          ? "View"
                          : "Preview"}
                      </Link>


                  <Link
                    href={`/posts/${post.slug}/edit`}
                    className="rounded border px-3 py-1.5 text-sm hover:bg-gray-50"
                  >
                    Edit
                  </Link>


                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(post.slug)
                    }
                    disabled={
                      deletingSlug ===
                      post.slug
                    }
                    className="rounded border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    {deletingSlug ===
                    post.slug
                      ? "Deleting..."
                      : "Delete"}
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </main>

    </ProtectedRoute>

  );
}