"use client";

import { useEffect, useRef, useState } from "react";

import {
  Check,
  Copy,
  Share2,
  X,
} from "lucide-react";

interface ShareButtonProps {
  title: string;
  slug: string;
}

/* =========================
   SOCIAL ICONS
========================= */

function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982 1-3.648-.235-.374a9.86 9.86 0 01-1.511-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.002 5.45-4.437 9.884-9.886 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.158 11.89c0 2.096.547 4.142 1.587 5.946L.057 24l6.304-1.654a11.875 11.875 0 005.684 1.447h.005c6.554 0 11.89-5.335 11.892-11.89a11.821 11.821 0 00-3.478-8.415" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M21.9 3.6L18.6 20c-.25 1.16-.9 1.45-1.83.9l-5.03-3.71-2.43 2.34c-.27.27-.5.5-1.02.5l.36-5.13 9.34-8.44c.41-.36-.09-.56-.64-.2L5.8 13.57.83 12.02c-1.08-.34-1.1-1.08.23-1.6L20.5 2.87c.9-.34 1.68.2 1.4.73z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.02 4.388 11.022 10.125 11.925v-8.432H7.078v-3.493h3.047V9.41c0-3.017 1.792-4.687 4.533-4.687 1.313 0 2.686.236 2.686.236v2.973h-1.514c-1.491 0-1.956.93-1.956 1.885v2.261h3.328l-.532 3.493h-2.796v8.432C19.612 23.095 24 18.093 24 12.073z" />
    </svg>
  );
}

function XSocialIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817-5.963 6.817H1.684l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V8.999h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.287zM5.337 7.433a2.062 2.062 0 11-.001-4.124 2.062 2.062 0 01.001 4.124zM7.114 20.452H3.56V8.999h3.554v11.453zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
    </svg>
  );
}

/* =========================
   SHARE BUTTON
========================= */

export default function ShareButton({
  title,
  slug,
}: ShareButtonProps) {
  const [isOpen, setIsOpen] =
    useState(false);

  const [copied, setCopied] =
    useState(false);

  const menuRef =
    useRef<HTMLDivElement>(null);

  /* =========================
     POST URL
  ========================= */

  function getPostUrl() {
    return `${window.location.origin}/posts/${slug}`;
  }

  /* =========================
     CLOSE WHEN CLICKING OUTSIDE
  ========================= */

  useEffect(() => {
    function handleClickOutside(
      event: MouseEvent
    ) {
      if (
        menuRef.current &&
        !menuRef.current.contains(
          event.target as Node
        )
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /* =========================
     ESCAPE KEY
  ========================= */

  useEffect(() => {
    function handleEscape(
      event: KeyboardEvent
    ) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  /* =========================
     COPY LINK
  ========================= */

  async function handleCopyLink() {
    try {
      const url = getPostUrl();

      await navigator.clipboard.writeText(
        url
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error(
        "Failed to copy link:",
        error
      );
    }
  }

  /* =========================
     NATIVE SHARE
  ========================= */

  async function handleNativeShare() {
    const url = getPostUrl();

    if (!navigator.share) {
      return;
    }

    try {
      await navigator.share({
        title,
        text: `Check out this post: ${title}`,
        url,
      });

      setIsOpen(false);
    } catch (error) {
      if (
        error instanceof DOMException &&
        error.name === "AbortError"
      ) {
        return;
      }

      console.error(
        "Native sharing failed:",
        error
      );
    }
  }

  /* =========================
     WHATSAPP
  ========================= */

  function shareOnWhatsApp() {
    const url = getPostUrl();

    const message = encodeURIComponent(
      `${title}\n\n${url}`
    );

    window.open(
      `https://wa.me/?text=${message}`,
      "_blank",
      "noopener,noreferrer"
    );

    setIsOpen(false);
  }

  /* =========================
     TELEGRAM
  ========================= */

  function shareOnTelegram() {
    const url = getPostUrl();

    const text =
      encodeURIComponent(title);

    const encodedUrl =
      encodeURIComponent(url);

    window.open(
      `https://t.me/share/url?url=${encodedUrl}&text=${text}`,
      "_blank",
      "noopener,noreferrer"
    );

    setIsOpen(false);
  }

  /* =========================
     FACEBOOK
  ========================= */

  function shareOnFacebook() {
    const url = getPostUrl();

    const encodedUrl =
      encodeURIComponent(url);

    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      "_blank",
      "noopener,noreferrer"
    );

    setIsOpen(false);
  }

  /* =========================
     X / TWITTER
  ========================= */

  function shareOnX() {
    const url = getPostUrl();

    const text =
      encodeURIComponent(title);

    const encodedUrl =
      encodeURIComponent(url);

    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${encodedUrl}`,
      "_blank",
      "noopener,noreferrer"
    );

    setIsOpen(false);
  }

  /* =========================
     LINKEDIN
  ========================= */

  function shareOnLinkedIn() {
    const url = getPostUrl();

    const encodedUrl =
      encodeURIComponent(url);

    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      "_blank",
      "noopener,noreferrer"
    );

    setIsOpen(false);
  }

  /* =========================
     UI
  ========================= */

  return (
    <div
      ref={menuRef}
      className="relative"
    >
      {/* Main Share Button */}
      <button
        type="button"
        onClick={() =>
          setIsOpen(
            (previous) => !previous
          )
        }
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100"
      >
        <Share2 className="h-4 w-4" />

        Share
      </button>

      {/* Share Menu */}
      {isOpen && (
        <div
          role="menu"
          className="absolute bottom-full right-0 z-50 mb-3 w-72 overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Share this post
              </p>

              <p className="mt-0.5 text-xs text-slate-500">
                Choose how you want to share it
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setIsOpen(false)
              }
              aria-label="Close share menu"
              className="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="my-2 border-t border-slate-100" />

          {/* Social Buttons */}
          <div className="grid grid-cols-2 gap-2">
            {/* WhatsApp */}
            <button
              type="button"
              role="menuitem"
              onClick={shareOnWhatsApp}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-green-50 hover:text-green-700"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-700">
                <WhatsAppIcon />
              </span>

              WhatsApp
            </button>

            {/* Telegram */}
            <button
              type="button"
              role="menuitem"
              onClick={shareOnTelegram}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-sky-50 hover:text-sky-700"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-100 text-sky-700">
                <TelegramIcon />
              </span>

              Telegram
            </button>

            {/* Facebook */}
            <button
              type="button"
              role="menuitem"
              onClick={shareOnFacebook}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                <FacebookIcon />
              </span>

              Facebook
            </button>

            {/* X */}
            <button
              type="button"
              role="menuitem"
              onClick={shareOnX}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-900">
                <XSocialIcon />
              </span>

              X / Twitter
            </button>

            {/* LinkedIn */}
            <button
              type="button"
              role="menuitem"
              onClick={shareOnLinkedIn}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                <LinkedInIcon />
              </span>

              LinkedIn
            </button>

            {/* Copy Link */}
            <button
              type="button"
              role="menuitem"
              onClick={handleCopyLink}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </span>

              {copied
                ? "Copied!"
                : "Copy Link"}
            </button>
          </div>

          {/* Native Share */}
          {typeof navigator !==
            "undefined" &&
            "share" in navigator && (
              <>
                <div className="my-2 border-t border-slate-100" />

                <button
                  type="button"
                  role="menuitem"
                  onClick={
                    handleNativeShare
                  }
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                    <Share2 className="h-4 w-4" />
                  </span>

                  <div>
                    <p className="font-semibold">
                      More sharing options
                    </p>

                    <p className="text-xs font-normal text-slate-500">
                      Use your device&apos;s
                      share menu
                    </p>
                  </div>
                </button>
              </>
            )}
        </div>
      )}
    </div>
  );
}