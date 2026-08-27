"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  FileText,
  Search,
  X,
} from "lucide-react";

import { getPosts } from "@/lib/posts";
import { Post } from "@/types/post";
import { useAuth } from "@/components/AuthProvider";
import MarkdownRenderer from "@/components/MarkdownRenderer";


export default function HomePage() {

  // =====================================
  // STATE
  // =====================================

  const [posts, setPosts] =
    useState<Post[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [totalPosts, setTotalPosts] =
    useState(0);

  const [searchInput, setSearchInput] =
    useState("");

  const [searchQuery, setSearchQuery] =
    useState("");

  const { user } =
    useAuth();


  // =====================================
  // CONSTANTS
  // =====================================

  const POSTS_PER_PAGE = 7;


  // =====================================
  // TOTAL PAGES
  // =====================================

  const totalPages =
    Math.ceil(
      totalPosts / POSTS_PER_PAGE
    );


  // =====================================
  // LOAD POSTS
  // =====================================

  useEffect(() => {

    async function loadPosts() {

      try {

        setLoading(true);

        setError("");

        const data =
          await getPosts(
            currentPage,
            searchQuery
          );

        setPosts(
          data.results
        );

        setTotalPosts(
          data.count
        );

      } catch (error) {

        console.error(
          error
        );

        setError(
          "Failed to load posts."
        );

      } finally {

        setLoading(false);

      }
    }


    loadPosts();

  }, [
    currentPage,
    searchQuery,
  ]);


  // =====================================
  // SEARCH
  // =====================================

  function handleSearch(
    event: FormEvent<HTMLFormElement>
  ) {

    event.preventDefault();

    const query =
      searchInput.trim();

    setCurrentPage(1);

    setSearchQuery(
      query
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }


  // =====================================
  // CLEAR SEARCH
  // =====================================

  function clearSearch() {

    setSearchInput("");

    setSearchQuery("");

    setCurrentPage(1);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }


  // =====================================
  // CHANGE PAGE
  // =====================================

  function changePage(
    page: number
  ) {

    if (
      page < 1 ||
      page > totalPages ||
      page === currentPage
    ) {
      return;
    }

    setCurrentPage(
      page
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }


  // =====================================
  // LOADING STATE
  // =====================================

  if (loading) {

    return (

      <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">

        <div className="mx-auto max-w-5xl">

          {/* Header skeleton */}

          <div className="mb-8">

            <div className="h-9 w-48 animate-pulse rounded-lg bg-slate-200" />

            <div className="mt-3 h-5 w-72 max-w-full animate-pulse rounded bg-slate-200" />

          </div>


          {/* Search skeleton */}

          <div className="mb-8 flex flex-col gap-2 sm:flex-row">

            <div className="h-12 flex-1 animate-pulse rounded-xl bg-slate-200" />

            <div className="h-12 w-full animate-pulse rounded-xl bg-slate-200 sm:w-28" />

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


  // =====================================
  // ERROR STATE
  // =====================================

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


  // =====================================
  // MAIN PAGE
  // =====================================

  return (

    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">

      <div className="mx-auto max-w-5xl">


        {/* =================================
            PAGE HEADER
        ================================= */}

        <header className="mb-6 sm:mb-8">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100">

              <FileText className="h-6 w-6 text-blue-600" />

            </div>


            <div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Blog Posts
              </h1>


              {searchQuery ? (

                <p className="mt-1 text-sm text-slate-500 sm:text-base">

                  Search results for{" "}

                  <span className="font-medium text-slate-700">
                    "{searchQuery}"
                  </span>

                </p>

              ) : (

                <p className="mt-1 text-sm text-slate-500 sm:text-base">
                  Discover the latest articles and ideas.
                </p>

              )}

            </div>

          </div>

        </header>


        {/* =================================
            SEARCH
        ================================= */}

        <form
          onSubmit={handleSearch}
          className="mb-8"
        >

          <div className="flex flex-col gap-2 sm:flex-row">


            {/* SEARCH INPUT */}

            <div className="relative flex-1">

              <Search
                className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
              />


              <input
                type="text"
                value={searchInput}
                onChange={(event) =>
                  setSearchInput(
                    event.target.value
                  )
                }
                placeholder="Search posts..."
                aria-label="Search posts"
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-10 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />


              {/* CLEAR BUTTON */}

              {searchInput && (

                <button
                  type="button"
                  onClick={() =>
                    setSearchInput("")
                  }
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                >

                  <X className="h-4 w-4" />

                </button>

              )}

            </div>


            {/* SEARCH BUTTON */}

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 sm:w-auto"
            >

              <Search className="h-4 w-4" />

              Search

            </button>


            {/* CLEAR SEARCH */}

            {searchQuery && (

              <button
                type="button"
                onClick={clearSearch}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 sm:w-auto"
              >

                <X className="h-4 w-4" />

                Clear

              </button>

            )}

          </div>

        </form>


        {/* =================================
            RESULT COUNT
        ================================= */}

        {searchQuery && totalPosts > 0 && (

          <div className="mb-5 text-sm text-slate-500">

            Found{" "}

            <span className="font-semibold text-slate-700">
              {totalPosts}
            </span>{" "}

            {totalPosts === 1
              ? "post"
              : "posts"}

          </div>

        )}


        {/* =================================
            EMPTY STATE
        ================================= */}

        {posts.length === 0 ? (

          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm sm:px-8">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">

              {searchQuery ? (

                <Search className="h-7 w-7 text-slate-400" />

              ) : (

                <FileText className="h-7 w-7 text-slate-400" />

              )}

            </div>


            <h2 className="mt-5 text-lg font-semibold text-slate-900">

              {searchQuery
                ? "No posts found"
                : "No posts yet"}

            </h2>


            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">

              {searchQuery ? (

                <>
                  No posts matched{" "}

                  <span className="font-medium text-slate-700">
                    "{searchQuery}"
                  </span>

                  . Try a different search term.
                </>

              ) : (

                <>
                  There are no blog posts available
                  at the moment. Check back later
                  for new content.
                </>

              )}

            </p>


            {searchQuery && (

              <button
                type="button"
                onClick={clearSearch}
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >

                <X className="h-4 w-4" />

                Clear search

              </button>

            )}

          </div>

        ) : (

          <>

            {/* =================================
                POST LIST
            ================================= */}

            <div className="space-y-5">

              {posts.map(
                (post) => (

                  <article
                    key={post.id}
                    className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md sm:p-6"
                  >

                    {/* TITLE */}

                    <Link
                      href={`/posts/${post.slug}`}
                      className="block"
                    >

                      <h2 className="break-words text-xl font-bold leading-tight text-slate-900 transition group-hover:text-blue-600 sm:text-2xl">
                        {post.title}
                      </h2>

                    </Link>


                    {/* POST BODY */}

                    <div className="mt-4 line-clamp-4 break-words text-sm leading-6 text-slate-600 sm:text-base">

                      <div className="mt-8">

                        <MarkdownRenderer
                          content={post.body}
                        />

                      </div>

                    </div>


                    {/* METADATA */}

                    <div className="mt-5 flex flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">


                      {/* DATE */}

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


                      {/* READ MORE */}

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

                )
              )}

            </div>


            {/* =================================
                PAGINATION
            ================================= */}

            {totalPages > 1 && (

              <nav
                aria-label="Pagination"
                className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-between"
              >


                {/* PREVIOUS */}

                <button
                  type="button"
                  onClick={() =>
                    changePage(
                      currentPage - 1
                    )
                  }
                  disabled={
                    currentPage === 1
                  }
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
                >

                  <ArrowLeft className="h-4 w-4" />

                  Previous

                </button>


                {/* PAGE NUMBERS */}

                <div className="flex max-w-full items-center gap-1 overflow-x-auto">

                  {Array.from(
                    {
                      length: totalPages,
                    },
                    (_, index) =>
                      index + 1
                  ).map(
                    (page) => (

                      <button
                        key={page}
                        type="button"
                        onClick={() =>
                          changePage(
                            page
                          )
                        }
                        aria-current={
                          page ===
                          currentPage
                            ? "page"
                            : undefined
                        }
                        className={`flex h-10 min-w-10 shrink-0 items-center justify-center rounded-lg px-3 text-sm font-medium transition ${
                          page ===
                          currentPage
                            ? "bg-blue-600 text-white shadow-sm"
                            : "bg-white text-slate-700 hover:bg-slate-100"
                        }`}
                      >

                        {page}

                      </button>

                    )
                  )}

                </div>


                {/* NEXT */}

                <button
                  type="button"
                  onClick={() =>
                    changePage(
                      currentPage + 1
                    )
                  }
                  disabled={
                    currentPage ===
                    totalPages
                  }
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
                >

                  Next

                  <ArrowRight className="h-4 w-4" />

                </button>

              </nav>

            )}


            {/* =================================
                PAGE INFORMATION
            ================================= */}

            {totalPosts > 0 && (

              <div className="mt-4 text-center text-xs text-slate-400">

                Showing{" "}

                {(currentPage - 1) *
                  POSTS_PER_PAGE +
                  1}

                {" "}–{" "}

                {Math.min(
                  currentPage *
                    POSTS_PER_PAGE,
                  totalPosts
                )}

                {" "}of{" "}

                {totalPosts}

                {" "}

                {searchQuery
                  ? "matching posts"
                  : "posts"}

              </div>

            )}

          </>

        )}

      </div>

    </main>

  );
}