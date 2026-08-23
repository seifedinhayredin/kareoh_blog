"use client";

import {
  FormEvent,
  useState,
} from "react";

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

import {
  createPost,
  updatePost,
} from "@/lib/posts";

import MarkdownEditor from "@/components/MarkdownEditor";


export default function CreatePostPage() {

  const router =
    useRouter();


  // =====================================
  // FORM STATE
  // =====================================

  const [title, setTitle] =
    useState("");

  const [body, setBody] =
    useState("");

  const [status, setStatus] =
    useState<"DR" | "PB">("DR");


  // =====================================
  // POST STATE
  // =====================================

  const [postSlug, setPostSlug] =
    useState<string | undefined>(
      undefined
    );


  // =====================================
  // UI STATE
  // =====================================

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  // =====================================
  // CREATE DRAFT
  // =====================================

  async function createDraft(): Promise<
    string | undefined
  > {

    try {

      setError("");


      // -----------------------------------
      // Validate title
      // -----------------------------------

      if (!title.trim()) {

        throw new Error(
          "Please enter a title before uploading an image."
        );

      }


      // -----------------------------------
      // Create draft
      // -----------------------------------

      const response =
        await createPost({

          title: title.trim(),

          body: body,

          status: "DR",

        });


      // -----------------------------------
      // Get slug
      // -----------------------------------

      const slug =
        response.slug;


      if (!slug) {

        throw new Error(
          "Server did not return a slug."
        );

      }


      // -----------------------------------
      // Store slug
      // -----------------------------------

      setPostSlug(slug);


      return slug;


    } catch (error: any) {

      console.error(
        "Failed to create draft:",
        error
      );


      const message =
        error?.message ||
        "Could not save the post as a draft.";


      setError(message);


      throw new Error(message);
    }
  }


  // =====================================
  // HANDLE FINAL SAVE / PUBLISH
  // =====================================

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {

    event.preventDefault();


    setError("");


    // -----------------------------------
    // Validate title
    // -----------------------------------

    if (!title.trim()) {

      setError(
        "Title is required."
      );

      return;
    }


    // -----------------------------------
    // Validate body
    // -----------------------------------

    if (!body.trim()) {

      setError(
        "Content is required."
      );

      return;
    }


    setLoading(true);


    try {

      let post;


      // =================================
      // CASE 1
      // =================================
      // Post was already created as draft
      // because an image was uploaded.
      //
      // UPDATE existing post.
      // =================================

      if (postSlug) {

        post =
          await updatePost(
            postSlug,
            {
              title: title.trim(),
              body,
              status,
            }
          );


      } else {

        // =================================
        // CASE 2
        // =================================
        // No draft exists yet.
        //
        // Create the post normally.
        // =================================

        post =
          await createPost({

            title: title.trim(),

            body,

            status,

          });


        // Save slug in state
        if (post.slug) {

          setPostSlug(
            post.slug
          );

        }

      }


      console.log(
        "Saved post:",
        post
      );


      // =================================
      // REDIRECT
      // =================================

      router.push(
        `/posts/${post.slug}`
      );


    } catch (error: any) {

      console.error(
        "Failed to save post:",
        error
      );


      const data =
        error?.response?.data;


      if (data) {

        if (
          typeof data === "object"
        ) {

          const messages: string[] =
            [];


          Object.entries(data).forEach(
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
            "Failed to save post."
          );

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


          {/* =================================
              HEADER
          ================================= */}

          <div className="mb-8">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100">

                <FileText
                  className="h-6 w-6 text-blue-600"
                />

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


          {/* =================================
              EDITOR CARD
          ================================= */}

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">


            {/* =================================
                ERROR
            ================================= */}

            {error && (

              <div className="mx-5 mt-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:mx-6">

                <AlertCircle
                  className="mt-0.5 h-5 w-5 shrink-0"
                />

                <p className="break-words">
                  {error}
                </p>

              </div>

            )}


            <form
              onSubmit={handleSubmit}
              className="p-5 sm:p-6 lg:p-8"
            >


              {/* =================================
                  TITLE
              ================================= */}

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
                    setTitle(
                      event.target.value
                    )
                  }
                  placeholder="Enter a compelling title..."
                  className="h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-base font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                  disabled={loading}
                />

              </div>


              {/* =================================
                  CONTENT
              ================================= */}

              <div className="mt-6">

                <div className="mb-2 flex items-center justify-between gap-4">

                  <label
                    htmlFor="body"
                    className="block text-sm font-semibold text-slate-700"
                  >
                    Content
                  </label>


                  <span className="shrink-0 text-xs text-slate-400">
                    {body.length.toLocaleString()}{" "}
                    characters
                  </span>

                </div>


                <MarkdownEditor
                  value={body}
                  onChange={setBody}
                  postSlug={postSlug}
                  onCreateDraft={createDraft}
                />


                <p className="mt-2 text-xs text-slate-400">
                  Write your article naturally. You can resize
                  the editor vertically as needed.
                </p>

              </div>


              {/* =================================
                  STATUS
              ================================= */}

              <div className="mt-7">

                <fieldset>

                  <legend className="mb-3 text-sm font-semibold text-slate-700">
                    Publication Status
                  </legend>


                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">


                    {/* =================================
                        DRAFT
                    ================================= */}

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
                        checked={
                          status === "DR"
                        }
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


                    {/* =================================
                        PUBLISHED
                    ================================= */}

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
                        checked={
                          status === "PB"
                        }
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


              {/* =================================
                  ACTIONS
              ================================= */}

              <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">


                {/* =================================
                    CANCEL
                ================================= */}

                <button
                  type="button"
                  onClick={() =>
                    router.back()
                  }
                  disabled={loading}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-slate-300 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                >

                  <X className="h-4 w-4" />

                  Cancel

                </button>


                {/* =================================
                    SUBMIT
                ================================= */}

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {loading ? (

                    <>

                      <Loader2
                        className="h-5 w-5 animate-spin"
                      />

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