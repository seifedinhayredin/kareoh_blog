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

import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Edit3,
  Loader2,
  Trash2,
  User,
} from "lucide-react";

import { useAuth } from "@/components/AuthProvider";
import ProtectedRoute from "@/components/ProtectedRoute";

import {
  getPost,
  deletePost,
} from "@/lib/posts";

import { Post } from "@/types/post";

import Comments from "@/components/Comments";
import LikeButton from "@/components/LikeButton";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import ShareButton from "@/components/ShareButton";


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

      <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 sm:py-10">

        <div className="mx-auto max-w-5xl">

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="animate-pulse">

              {/* Header */}

              <div className="border-b border-slate-100 p-6 sm:p-10">

                <div className="h-6 w-24 rounded-full bg-slate-200" />

                <div className="mt-6 h-10 w-full rounded-lg bg-slate-200 sm:h-12" />

                <div className="mt-3 h-10 w-4/5 rounded-lg bg-slate-200 sm:h-12" />

                <div className="mt-6 flex flex-wrap gap-4">

                  <div className="h-9 w-40 rounded-lg bg-slate-200" />

                  <div className="h-9 w-36 rounded-lg bg-slate-200" />

                </div>

              </div>


              {/* Body */}

              <div className="px-6 py-10 sm:px-10">

                <div className="mx-auto max-w-3xl space-y-5">

                  <div className="h-5 w-full rounded bg-slate-200" />

                  <div className="h-5 w-full rounded bg-slate-200" />

                  <div className="h-5 w-11/12 rounded bg-slate-200" />

                  <div className="h-5 w-full rounded bg-slate-200" />

                  <div className="h-5 w-4/5 rounded bg-slate-200" />

                  <div className="mt-8 h-64 w-full rounded-2xl bg-slate-200" />

                  <div className="h-5 w-full rounded bg-slate-200" />

                  <div className="h-5 w-10/12 rounded bg-slate-200" />

                </div>

              </div>

            </div>

          </div>

        </div>

      </main>

    );

  }


  // =========================
  // ERROR
  // =========================

  if (error && !post) {

    return (

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
            onClick={() => router.push("/")}
            className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </button>

        </div>

      </main>

    );

  }


  // =========================
  // NOT FOUND
  // =========================

  if (!post) {

    return (

      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8">

        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">

            <AlertCircle className="h-7 w-7 text-slate-400" />

          </div>


          <h1 className="mt-5 text-xl font-bold text-slate-900">
            Post not found
          </h1>


          <p className="mt-2 text-sm leading-6 text-slate-500">
            The post you're looking for doesn't
            exist or may have been removed.
          </p>


          <button
            type="button"
            onClick={() => router.push("/")}
            className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </button>

        </div>

      </main>

    );

  }


  // =========================
  // OWNERSHIP
  // =========================

  const isOwner =
    user?.id === post.author.id;


  // =========================
  // PAGE
  // =========================

  return (

    <ProtectedRoute>

      <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 sm:py-10 lg:px-8">

        <div className="mx-auto max-w-5xl">


          {/* =========================
              BACK TO BLOG
          ========================= */}

          <Link
            href="/"
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
          >

            <ArrowLeft className="h-4 w-4" />

            Back to Blog

          </Link>


          {/* =========================
              ARTICLE
          ========================= */}

          <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">


            {/* =========================
                HEADER
            ========================= */}

            <header className="border-b border-slate-100 px-5 py-7 sm:px-8 sm:py-9 lg:px-10">


              {/* STATUS */}

              <div className="mb-5">

                {post.status === "PB" ? (

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-700">

                    <CheckCircle2 className="h-3.5 w-3.5" />

                    Published

                  </span>

                ) : (

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-700">

                    <AlertCircle className="h-3.5 w-3.5" />

                    Draft

                  </span>

                )}

              </div>


              {/* TITLE */}

              <h1
                className="
                  max-w-4xl
                  break-words
                  text-3xl
                  font-bold
                  leading-tight
                  tracking-tight
                  text-slate-900

                  sm:text-4xl
                  lg:text-5xl
                "
                style={{
                  overflowWrap: "anywhere",
                }}
              >

                {post.title}

              </h1>


              {/* =========================
                  METADATA
              ========================= */}

              <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-7 sm:gap-y-4">


                {/* AUTHOR */}

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700">

                    <User className="h-4 w-4" />

                  </div>


                  <div className="min-w-0">

                    <p className="text-xs text-slate-400">
                      Written by
                    </p>

                    <p className="break-words text-sm font-semibold text-slate-700">

                      {post.author.first_name}{" "}

                      {post.author.last_name}

                    </p>

                  </div>

                </div>


                {/* DATE */}

                <div className="flex items-center gap-2 text-sm text-slate-500">

                  <CalendarDays className="h-4 w-4 shrink-0" />

                  <span>

                    Published{" "}

                    {new Date(
                      post.publish
                    ).toLocaleDateString(
                      undefined,
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}

                  </span>

                </div>

              </div>


              {/* =========================
                  OWNER ACTIONS
              ========================= */}

              {isOwner && (

                <div className="mt-7 flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row">


                  {/* EDIT */}

                  <Link
                    href={`/posts/${post.slug}/edit`}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
                  >

                    <Edit3 className="h-4 w-4" />

                    Edit Post

                  </Link>


                  {/* DELETE */}

                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleting}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-5 text-sm font-semibold text-red-600 transition hover:bg-red-50 focus:outline-none focus:ring-4 focus:ring-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >

                    {deleting ? (

                      <>

                        <Loader2 className="h-4 w-4 animate-spin" />

                        Deleting...

                      </>

                    ) : (

                      <>

                        <Trash2 className="h-4 w-4" />

                        Delete Post

                      </>

                    )}

                  </button>

                </div>

              )}

            </header>


            {/* =========================
                ERROR
            ========================= */}

            {error && (

              <div className="mx-5 mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:mx-8 lg:mx-10">

                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

                <p
                  className="min-w-0 break-words text-sm leading-6 text-red-700"
                  style={{
                    overflowWrap: "anywhere",
                  }}
                >
                  {error}
                </p>

              </div>

            )}


            {/* =========================
                BODY
            ========================= */}

            <section className="border-b border-slate-100">

              <div className="px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">

                <div className="mx-auto max-w-3xl">

                  <MarkdownRenderer
                    content={post.body}
                  />

                </div>

              </div>

            </section>


            {/* =========================
                LIKE / SHARE
            ========================= */}

            <div className="flex flex-col gap-5 px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">

              <LikeButton
                slug={post.slug}
                initialLikeCount={post.like_count}
                initialIsLiked={post.is_liked}
                isAuthenticated={!!user}
              />


              <ShareButton
                title={post.title}
                slug={post.slug}
                initialShareCount={post.share_count}
                initialHasShared={post.has_shared}
                isAuthenticated={!!user}
              />

            </div>

          </article>


          {/* =========================
              COMMENTS
          ========================= */}

          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">

            <Comments
              slug={post.slug}
              userId={user?.id}
            />

          </section>


        </div>

      </main>

    </ProtectedRoute>

  );
}