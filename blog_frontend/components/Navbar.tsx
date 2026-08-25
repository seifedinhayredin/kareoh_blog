"use client";

import { useState } from "react";

import Link from "next/link";

import {
  BookOpen,
  FilePlus2,
  Home,
  KeyRound,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Settings,
  User,
  UserPlus,
  X,
} from "lucide-react";

import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const [settingsOpen, setSettingsOpen] =
    useState(false);

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  function closeSettingsMenu() {
    setSettingsOpen(false);
  }

  function handleSettingsClick() {
    setSettingsOpen(
      (current) => !current
    );
  }

  async function handleLogout() {
    closeMobileMenu();
    closeSettingsMenu();

    await logout();
    router.push("/login");
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* =========================
            LOGO
        ========================= */}

        <Link
          href="/"
          onClick={() => {
            closeMobileMenu();
            closeSettingsMenu();
          }}
          className="group flex items-center gap-2.5"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white transition group-hover:bg-blue-700">
            <BookOpen className="h-5 w-5" />
          </div>

          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white sm:text-xl">
            Kaeroh Blog
          </span>
        </Link>

        {/* =========================
            DESKTOP NAVIGATION
        ========================= */}

        <div className="hidden items-center gap-1 md:flex">

          {/* Home */}
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-400"
          >
            <Home className="h-4 w-4" />
            Home
          </Link>

          {loading ? (
            <div className="ml-2 h-9 w-20 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
          ) : user ? (
            <>
              {/* Dashboard */}
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-400"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>

              {/* Create Post */}
              <Link
                href="/posts/create"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-400"
              >
                <FilePlus2 className="h-4 w-4" />
                Create Post
              </Link>

              {/* =========================
                  USER / SETTINGS
              ========================= */}

              <div className="relative ml-2 flex items-center gap-3 border-l border-slate-200 pl-4 dark:border-slate-800">

                {/* User */}
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-400">
                  {user.username
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <span className="max-w-32 truncate text-sm font-medium text-slate-700 dark:text-slate-300">
                  {user.username}
                </span>

                {/* Settings Button */}
                <button
                  type="button"
                  onClick={handleSettingsClick}
                  aria-expanded={settingsOpen}
                  aria-haspopup="menu"
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    settingsOpen
                      ? "bg-slate-100 text-blue-600 dark:bg-slate-800 dark:text-blue-400"
                      : "text-slate-600 hover:bg-slate-100 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-400"
                  }`}
                >
                  <Settings className="h-4 w-4" />

                  Settings

                  <svg
                    className={`h-4 w-4 transition-transform ${
                      settingsOpen
                        ? "rotate-180"
                        : ""
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {/* =========================
                    SETTINGS DROPDOWN
                ========================= */}

                {settingsOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white py-2 shadow-lg ring-1 ring-black/5 dark:border-slate-800 dark:bg-slate-900"
                  >
                    {/* Profile */}
                    <Link
                      href="/settings/profile"
                      onClick={closeSettingsMenu}
                      role="menuitem"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-50 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-400"
                    >
                      <User className="h-4 w-4" />

                      <div>
                        <p className="font-medium">
                          Profile Information
                        </p>

                        <p className="text-xs text-slate-500 dark:text-slate-500">
                          Update your profile
                        </p>
                      </div>
                    </Link>

                    {/* Password */}
                    <Link
                      href="/settings/passupdate"
                      onClick={closeSettingsMenu}
                      role="menuitem"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-50 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-400"
                    >
                      <KeyRound className="h-4 w-4" />

                      <div>
                        <p className="font-medium">
                          Change Password
                        </p>

                        <p className="text-xs text-slate-500 dark:text-slate-500">
                          Update your password
                        </p>
                      </div>
                    </Link>

                    <div className="my-1 border-t border-slate-200 dark:border-slate-800" />

                    {/* Logout */}
                    <button
                      type="button"
                      onClick={handleLogout}
                      role="menuitem"
                      className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                    >
                      <LogOut className="h-4 w-4" />

                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Login */}
              <Link
                href="/login"
                className="ml-2 flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <LogIn className="h-4 w-4" />
                Login
              </Link>

              {/* Register */}
              <Link
                href="/register"
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
              >
                <UserPlus className="h-4 w-4" />
                Register
              </Link>
            </>
          )}
        </div>

        {/* =========================
            MOBILE MENU BUTTON
        ========================= */}

        <button
          type="button"
          onClick={() =>
            setMobileMenuOpen(
              (current) => !current
            )
          }
          aria-label={
            mobileMenuOpen
              ? "Close menu"
              : "Open menu"
          }
          aria-expanded={mobileMenuOpen}
          className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white md:hidden"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* =========================
          MOBILE NAVIGATION
      ========================= */}

      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 md:hidden">
          <div className="mx-auto max-w-7xl space-y-1 px-4 py-4 sm:px-6">

            {/* Home */}
            <Link
              href="/"
              onClick={closeMobileMenu}
              className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-400"
            >
              <Home className="h-5 w-5" />
              Home
            </Link>

            {loading ? (
              <div className="px-3 py-3">
                <div className="h-5 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
              </div>
            ) : user ? (
              <>
                {/* User Information */}
                <div className="my-2 flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-900">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-400">
                    {user.username
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-slate-500">
                      Signed in as
                    </p>

                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                      {user.username}
                    </p>
                  </div>
                </div>

                {/* Dashboard */}
                <Link
                  href="/dashboard"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-400"
                >
                  <LayoutDashboard className="h-5 w-5" />
                  Dashboard
                </Link>

                {/* Create Post */}
                <Link
                  href="/posts/create"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-400"
                >
                  <FilePlus2 className="h-5 w-5" />
                  Create Post
                </Link>

                {/* =========================
                    SETTINGS
                ========================= */}

                <div className="mt-2 border-t border-slate-200 pt-2 dark:border-slate-800">
                  <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Settings
                  </div>

                  {/* Profile */}
                  <Link
                    href="/settings/profile"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-400"
                  >
                    <User className="h-5 w-5" />
                    Profile Information
                  </Link>

                  {/* Password */}
                  <Link
                    href="/settings/passupdate"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-400"
                  >
                    <KeyRound className="h-5 w-5" />
                    Change Password
                  </Link>

                  {/* Logout */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                  >
                    <LogOut className="h-5 w-5" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Login */}
                <Link
                  href="/login"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-400"
                >
                  <LogIn className="h-5 w-5" />
                  Login
                </Link>

                {/* Register */}
                <Link
                  href="/register"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 rounded-lg bg-blue-600 px-3 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  <UserPlus className="h-5 w-5" />
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}