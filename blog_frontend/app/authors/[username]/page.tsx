"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import {
  AlertCircle,
  ArrowLeft,
  BriefcaseBusiness,
  GraduationCap,
  Loader2,
  User,
} from "lucide-react";

import { useParams } from "next/navigation";

import {
  getPublicAuthor,
  PublicAuthor,
} from "@/lib/authors";

export default function AuthorProfilePage() {
  const params = useParams();

  const username = params.username as string;

  const [author, setAuthor] =
    useState<PublicAuthor | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (!username) {
      return;
    }

    async function loadAuthor() {
      try {
        setLoading(true);
        setError("");

        const data =
          await getPublicAuthor(username);

        setAuthor(data);
      } catch (error: any) {
        console.error(
          "Failed to load author:",
          error
        );

        if (
          error?.response?.status === 404
        ) {
          setError("Author not found.");
        } else {
          setError(
            "Unable to load author profile."
          );
        }
      } finally {
        setLoading(false);
      }
    }

    loadAuthor();
  }, [username]);

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950">
        <div className="mx-auto max-w-3xl">
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading author profile...
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* =========================
     ERROR
  ========================= */

  if (error || !author) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm dark:border-red-900/50 dark:bg-slate-900">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400">
              <AlertCircle className="h-6 w-6" />
            </div>

            <h1 className="mt-4 text-xl font-semibold text-slate-900 dark:text-white">
              {error || "Author not found."}
            </h1>

            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const fullName =
    `${author.first_name} ${author.last_name}`.trim();

  const displayName =
    fullName || author.username;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950 sm:py-14">
      <div className="mx-auto max-w-3xl">

        {/* Back */}
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        {/* Profile */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

          {/* Profile Header */}
          <div className="border-b border-slate-200 px-6 py-8 dark:border-slate-800 sm:px-8">
            <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left">

              {/* Avatar */}
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-400">
                {displayName
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div className="mt-4 sm:ml-5 sm:mt-0">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {displayName}
                </h1>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  @{author.username}
                </p>

                {author.profession && (
                  <p className="mt-2 text-sm font-medium text-blue-600 dark:text-blue-400">
                    {author.profession}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="space-y-8 p-6 sm:p-8">

            {/* Bio */}
            {author.bio && (
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />

                  <h2 className="font-semibold text-slate-900 dark:text-white">
                    About
                  </h2>
                </div>

                <p className="whitespace-pre-line text-sm leading-7 text-slate-600 dark:text-slate-400">
                  {author.bio}
                </p>
              </div>
            )}

            {/* Profession */}
            {author.profession && (
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <BriefcaseBusiness className="h-5 w-5 text-blue-600 dark:text-blue-400" />

                  <h2 className="font-semibold text-slate-900 dark:text-white">
                    Profession
                  </h2>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {author.profession}
                </p>
              </div>
            )}

            {/* Education */}
            {author.education && (
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-blue-600 dark:text-blue-400" />

                  <h2 className="font-semibold text-slate-900 dark:text-white">
                    Education
                  </h2>
                </div>

                <p className="whitespace-pre-line text-sm leading-7 text-slate-600 dark:text-slate-400">
                  {author.education}
                </p>
              </div>
            )}

            {/* Empty profile */}
            {!author.bio &&
              !author.profession &&
              !author.education && (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  This author hasn't added any profile information yet.
                </p>
              )}
          </div>
        </section>
      </div>
    </main>
  );
}