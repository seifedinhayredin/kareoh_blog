"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  useParams,
  useRouter,
} from "next/navigation";

import { useAuth } from "@/components/AuthProvider";
import ProtectedRoute from "@/components/ProtectedRoute";

import {
  getPost,
  deletePost,
} from "@/lib/posts";

import { Post } from "@/types/post";


export default function PostDetailPage() {

  const params = useParams();

  const router = useRouter();

  const { user } = useAuth();

  const slug = params.slug as string;


  const [post, setPost] =
    useState<Post | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [deleting, setDeleting] =
    useState(false);

  const [error, setError] =
    useState("");


  // =========================
  // LOAD POST
  // =========================

  useEffect(() => {

    async function loadPost() {

      try {

        const data =
          await getPost(slug);

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


  // =========================
  // DELETE POST
  // =========================

  async function handleDelete() {

    if (!post) {
      return;
    }


    const confirmed =
      window.confirm(
        "Are you sure you want to delete this post?"
      );


    if (!confirmed) {
      return;
    }


    setDeleting(true);

    setError("");


    try {

      await deletePost(post.slug);

      // Redirect to homepage
      router.push("/");

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

              if (
                Array.isArray(value)
              ) {

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
            "Failed to delete post."
          );

        }

      } else {

        setError(
          "Unable to connect to the server."
        );

      }

    } finally {

      setDeleting(false);

    }

  }


  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (

      <main className="mx-auto max-w-4xl p-10">

        <p>
          Loading post...
        </p>

      </main>

    );

  }


  // =========================
  // ERROR / NOT FOUND
  // =========================

  if (error && !post) {

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

        <p>
          Post not found.
        </p>

      </main>

    );

  }


  // =========================
  // OWNERSHIP
  // =========================

  const isOwner =
    user?.id === post.author;


  // =========================
  // PAGE
  // =========================

  return (

    <ProtectedRoute>

      <main className="mx-auto max-w-4xl px-6 py-10">

        {/* TITLE */}

        <h1 className="text-4xl font-bold">

          {post.title}

        </h1>


        {/* METADATA */}

        <div className="mt-4 flex gap-4 text-sm text-gray-500">

          <span>

            Published{" "}

            {new Date(
              post.publish
            ).toLocaleDateString()}

          </span>


          <span>

            Status:{" "}

            {post.status === "PB"
              ? "Published"
              : "Draft"}

          </span>

        </div>


        {/* OWNER ACTIONS */}

        {isOwner && (

          <div className="mt-6 flex gap-3">

            <Link
              href={`/posts/${post.slug}/edit`}
              className="rounded-md bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
            >
              Edit Post
            </Link>


            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="rounded-md bg-red-600 px-5 py-2 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >

              {deleting
                ? "Deleting..."
                : "Delete Post"}

            </button>

          </div>

        )}


        {/* ERROR */}

        {error && (

          <div className="mt-6 rounded-md bg-red-100 p-4 text-red-700">

            {error}

          </div>

        )}


        {/* DIVIDER */}

        <hr className="my-8" />


        {/* BODY */}

        <article className="leading-8">

          <p className="whitespace-pre-wrap">

            {post.body}

          </p>

        </article>

      </main>

    </ProtectedRoute>

  );
}