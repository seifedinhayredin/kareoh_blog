"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  FileText,
  Loader2,
} from "lucide-react";

import { getPosts } from "@/lib/posts";
import { Post } from "@/types/post";
import { useAuth } from "@/components/AuthProvider";
import MarkdownRenderer from "@/components/MarkdownRenderer";


export default function HomePage() {

  const [posts, setPosts] = useState<Post[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =========================
  // PAGINATION
  // =========================

  const [currentPage, setCurrentPage] =
    useState(1);

  const [totalPosts, setTotalPosts] =
    useState(0);

  const postsPerPage = 7;

  const { user } = useAuth();


  // =========================
  // LOAD POSTS
  // =========================

  useEffect(() => {

    async function loadPosts() {

      try {

        setLoading(true);
        setError("");

        const data =
          await getPosts(currentPage);

        setPosts(data.results);

        setTotalPosts(data.count);

      } catch (error) {

        console.error(
          "Failed to load posts:",
          error
        );

        setError(
          "Failed to load posts."
        );

        setPosts([]);

      } finally {

        setLoading(false);

      }
    }

    loadPosts();

  }, [currentPage]);


  // =========================
  // TOTAL PAGES
  // =========================

  const totalPages =
    Math.ceil(
      totalPosts / postsPerPage
    );


  // =========================
  // CHANGE PAGE
  // =========================

  function goToPage(
    page: number
  ) {

    if (
      page < 1 ||
      page > totalPages ||
      page === currentPage
    ) {
      return;
    }

    setCurrentPage(page);

    // Scroll back to the top
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  }


  // =========================
  // LOADING STATE
  // =========================

  if (loading) {

    return (

      <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">

        <div className="mx-auto max-w-5xl">

          {/* Header skeleton */}

          <div className="mb-8">

            <div className="h-9 w-48 animate-pulse rounded-lg bg-slate-200" />

            <div className="mt-3 h-5 w-72 max-w-full animate-pulse rounded bg-slate-200" />

          </div>


          {/* Post skeletons */}

          <div className="space-y-5">

            {[1, 2, 3, 4, 5, 6, 7].map(
              (item) => (

                <div
                  key={item}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
                >

                  <div className="h-7 w-3/4 animate-pulse rounded bg-slate-200" />

                  <div className="mt-4 space-y-2">

                    <div className="h-4 w-full animate-pulse rounded bg-slate-200" />

                    <div className="h-4 w-11/12 animate-pulse rounded bg-slate-200" />

                    <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />

                  </div>

                  <div className="mt-5 h-4 w-32 animate-pulse rounded bg-slate-200" />

                </div>

              )
            )}

          </div>

        </div>

      </main>
    );
  }


  // =========================
  // ERROR STATE
  // =========================

  if (error) {

    return (

      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">

        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-6 text-center shadow-sm sm:p-8">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100">

            <AlertCircle className="h-7 w-7 text-red-600" />

          </div>


          <h1 className="mt-5 text-xl font-semibold text-slate-900">
            Something went wrong
          </h1>


          <p className="mt-2 text-sm text-slate-500">
            {error}
          </p>


          <button
            type="button"
            onClick={() =>
              window.location.reload()
            }
            className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
          >
            Try again
          </button>

        </div>

      </main>
    );
  }


  // =========================
  // MAIN PAGE
  // =========================

  return (

    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">

      <div className="mx-auto max-w-5xl">

        {/* =========================
            PAGE HEADER
        ========================= */}

        <header className="mb-8 sm:mb-10">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100">

              <FileText className="h-6 w-6 text-blue-600" />

            </div>


            <div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Blog Posts
              </h1>

              <p className="mt-1 text-sm text-slate-500 sm:text-base">
                Discover the latest articles and ideas.
              </p>

            </div>

          </div>

        </header>


        {/* =========================
            EMPTY STATE
        ========================= */}

        {posts.length === 0 ? (

          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm sm:px-8">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">

              <FileText className="h-7 w-7 text-slate-400" />

            </div>


            <h2 className="mt-5 text-lg font-semibold text-slate-900">
              No posts yet
            </h2>


            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">

              There are no blog posts available at the moment.
              Check back later for new content.

            </p>

          </div>

        ) : (

          <>

            {/* =========================
                POSTS
            ========================= */}

            <div className="space-y-5">

              {posts.map((post) => (

                <article
                  key={post.id}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md sm:p-6"
                >

                  {/* Title */}

                  <Link
                    href={`/posts/${post.slug}`}
                    className="block"
                  >

                    <h2 className="break-words text-xl font-bold leading-tight text-slate-900 transition group-hover:text-blue-600 sm:text-2xl">
                      {post.title}
                    </h2>

                  </Link>


                  {/* Post body */}

                  <div className="mt-4 line-clamp-4 break-words text-sm leading-6 text-slate-600 sm:text-base">

                    <div className="mt-8">

                      <MarkdownRenderer
                        content={post.body}
                      />

                    </div>

                  </div>


                  {/* Metadata */}

                  <div className="mt-5 flex flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex items-center gap-2">

                      <CalendarDays className="h-4 w-4 shrink-0" />

                      <span>

                        Published{" "}

                        {new Date(
                          post.publish
                        ).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}

                      </span>

                    </div>


                    {/* Read more */}

                    {user?.id ? (

                      <Link
                        href={`/posts/${post.slug}`}
                        className="inline-flex w-fit items-center gap-1.5 font-medium text-blue-600 transition hover:text-blue-700"
                      >

                        Read more

                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />

                      </Link>

                    ) : (

                      <Link
                        href="/login"
                        className="inline-flex w-fit items-center gap-1.5 font-medium text-blue-600 transition hover:text-blue-700"
                      >

                        Login to read more

                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />

                      </Link>

                    )}

                  </div>

                </article>

              ))}

            </div>


            {/* =========================
                PAGINATION
            ========================= */}

            {totalPages > 1 && (

              <div className="mt-8 flex flex-col items-center gap-4 sm:mt-10">

                {/* Page information */}

                <p className="text-sm text-slate-500">

                  Showing{" "}

                  <span className="font-medium text-slate-700">

                    {(currentPage - 1) *
                      postsPerPage +
                      1}

                  </span>

                  {" "}–{" "}

                  <span className="font-medium text-slate-700">

                    {Math.min(
                      currentPage *
                        postsPerPage,
                      totalPosts
                    )}

                  </span>

                  {" "}of{" "}

                  <span className="font-medium text-slate-700">
                    {totalPosts}
                  </span>

                  {" "}posts

                </p>


                {/* Pagination controls */}

                <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm">

                  {/* Previous */}

                  <button
                    type="button"
                    disabled={
                      currentPage === 1
                    }
                    onClick={() =>
                      goToPage(
                        currentPage - 1
                      )
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                  >

                    <ArrowLeft className="h-4 w-4" />

                    <span className="hidden sm:inline">
                      Previous
                    </span>

                  </button>


                  {/* Page numbers */}

                  <div className="flex items-center gap-1">

                    {Array.from(
                      {
                        length: totalPages,
                      },
                      (_, index) =>
                        index + 1
                    ).map((page) => (

                      <button
                        key={page}
                        type="button"
                        onClick={() =>
                          goToPage(page)
                        }
                        className={`min-w-9 rounded-lg px-2.5 py-2 text-sm font-medium transition ${
                          currentPage === page
                            ? "bg-blue-600 text-white"
                            : "text-slate-700 hover:bg-slate-100"
                        }`}
                      >

                        {page}

                      </button>

                    ))}

                  </div>


                  {/* Next */}

                  <button
                    type="button"
                    disabled={
                      currentPage ===
                      totalPages
                    }
                    onClick={() =>
                      goToPage(
                        currentPage + 1
                      )
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                  >

                    <span className="hidden sm:inline">
                      Next
                    </span>

                    <ArrowRight className="h-4 w-4" />

                  </button>

                </div>

              </div>

            )}

          </>

        )}

      </div>

    </main>
  );
}