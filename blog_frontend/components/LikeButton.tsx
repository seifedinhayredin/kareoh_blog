"use client";

import { useState } from "react";

import {
  Heart,
  Loader2,
  AlertCircle,
} from "lucide-react";

import {
  likePost,
  unlikePost,
} from "@/lib/posts";


interface LikeButtonProps {
  slug: string;
  initialLikeCount: number;
  initialIsLiked: boolean;
  isAuthenticated: boolean;
}


export default function LikeButton({
  slug,
  initialLikeCount,
  initialIsLiked,
  isAuthenticated,
}: LikeButtonProps) {

  const [liked, setLiked] =
    useState(initialIsLiked);

  const [likeCount, setLikeCount] =
    useState(initialLikeCount);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  async function handleLike() {

    if (!isAuthenticated) {

      setError(
        "You must be logged in to like a post."
      );

      return;
    }

    if (loading) {
      return;
    }

    try {

      setLoading(true);
      setError("");

      if (liked) {

        const data =
          await unlikePost(slug);

        setLiked(false);

        setLikeCount(
          data.like_count
        );

      } else {

        const data =
          await likePost(slug);

        setLiked(true);

        setLikeCount(
          data.like_count
        );
      }

    } catch (error) {

      console.error(error);

      setError(
        "Something went wrong. Please try again."
      );

    } finally {

      setLoading(false);

    }
  }


  return (

    <div className="mt-8 border-t border-slate-100 pt-6">

      {/* =========================
          LIKE CARD
      ========================= */}

      <div
        className="
          flex
          flex-col
          gap-4
          rounded-xl
          border
          border-slate-200
          bg-slate-50
          p-4
          
          sm:flex-row
          sm:items-center
          sm:justify-between
          sm:p-5
        "
      >

        {/* =========================
            LIKE INFORMATION
        ========================= */}

        <div className="flex items-center gap-3">

          <div
            className={`
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-full
              transition

              ${
                liked
                  ? "bg-red-100"
                  : "bg-white"
              }
            `}
          >

            <Heart
              className={`
                h-5
                w-5
                transition

                ${
                  liked
                    ? "fill-red-500 text-red-500"
                    : "text-slate-500"
                }
              `}
            />

          </div>


          <div>

            <p className="text-sm font-semibold text-slate-800">

              {likeCount.toLocaleString()}{" "}

              {likeCount === 1
                ? "Like"
                : "Likes"}

            </p>


            <p className="mt-0.5 text-xs text-slate-500">

              {liked
                ? "You liked this post"
                : "Enjoyed this post?"}

            </p>

          </div>

        </div>


        {/* =========================
            LIKE BUTTON
        ========================= */}

        <button
          type="button"
          onClick={handleLike}
          disabled={loading}
          aria-label={
            liked
              ? "Unlike this post"
              : "Like this post"
          }
          aria-pressed={liked}
          className={`
            inline-flex
            h-11
            w-full
            items-center
            justify-center
            gap-2
            rounded-lg
            px-5
            text-sm
            font-semibold
            transition

            focus:outline-none
            focus:ring-4

            disabled:cursor-not-allowed
            disabled:opacity-60

            sm:w-auto

            ${
              liked
                ? `
                  border
                  border-red-200
                  bg-red-50
                  text-red-600
                  hover:bg-red-100
                  focus:ring-red-100
                `
                : `
                  bg-blue-600
                  text-white
                  shadow-sm
                  hover:bg-blue-700
                  focus:ring-blue-200
                `
            }
          `}
        >

          {loading ? (

            <>
              <Loader2
                className="
                  h-4
                  w-4
                  animate-spin
                "
              />

              {liked
                ? "Removing..."
                : "Liking..."}

            </>

          ) : (

            <>

              <Heart
                className={`
                  h-4
                  w-4

                  ${
                    liked
                      ? "fill-red-500"
                      : ""
                  }
                `}
              />

              {liked
                ? "Unlike"
                : "Like Post"}

            </>

          )}

        </button>

      </div>


      {/* =========================
          ERROR
      ========================= */}

      {error && (

        <div
          className="
            mt-3
            flex
            items-start
            gap-2
            rounded-lg
            border
            border-red-200
            bg-red-50
            px-3
            py-2.5
            text-sm
            text-red-600
          "
        >

          <AlertCircle
            className="
              mt-0.5
              h-4
              w-4
              shrink-0
            "
          />

          <p>
            {error}
          </p>

        </div>

      )}

    </div>

  );
}