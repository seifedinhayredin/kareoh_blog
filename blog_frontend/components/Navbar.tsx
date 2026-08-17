"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  FilePlus2,
  Home,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  UserPlus,
  X,
} from "lucide-react";

import { useAuth } from "@/components/AuthProvider";

export default function Navbar() {
  const { user, loading, logout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  async function handleLogout() {
    closeMobileMenu();
    await logout();
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          href="/"
          onClick={closeMobileMenu}
          className="group flex items-center gap-2.5"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white transition group-hover:bg-blue-700">
            <BookOpen className="h-5 w-5" />
          </div>

          <span className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
            Kaeroh Blog
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 md:flex">

          {/* Home */}
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-blue-600"
          >
            <Home className="h-4 w-4" />
            Home
          </Link>

          {loading ? (
            <div className="ml-2 h-9 w-20 animate-pulse rounded-lg bg-slate-100" />
          ) : user ? (
            <>
              {/* Dashboard */}
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-blue-600"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>

              {/* Create Post */}
              <Link
                href="/posts/create"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-blue-600"
              >
                <FilePlus2 className="h-4 w-4" />
                Create Post
              </Link>

              {/* User */}
              <div className="ml-2 flex items-center gap-3 border-l border-slate-200 pl-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                  {user.username
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <span className="max-w-32 truncate text-sm font-medium text-slate-700">
                  {user.username}
                </span>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Login */}
              <Link
                href="/login"
                className="ml-2 flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
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

        {/* Mobile Menu Button */}
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
          className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 md:hidden"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <div className="mx-auto max-w-7xl space-y-1 px-4 py-4 sm:px-6">

            {/* Home */}
            <Link
              href="/"
              onClick={closeMobileMenu}
              className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-blue-600"
            >
              <Home className="h-5 w-5" />
              Home
            </Link>

            {loading ? (
              <div className="px-3 py-3">
                <div className="h-5 w-24 animate-pulse rounded bg-slate-200" />
              </div>
            ) : user ? (
              <>
                {/* User Information */}
                <div className="my-2 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
                    {user.username
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-slate-500">
                      Signed in as
                    </p>

                    <p className="truncate text-sm font-semibold text-slate-900">
                      {user.username}
                    </p>
                  </div>
                </div>

                {/* Dashboard */}
                <Link
                  href="/dashboard"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-blue-600"
                >
                  <LayoutDashboard className="h-5 w-5" />
                  Dashboard
                </Link>

                {/* Create Post */}
                <Link
                  href="/posts/create"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-blue-600"
                >
                  <FilePlus2 className="h-5 w-5" />
                  Create Post
                </Link>

                {/* Logout */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* Login */}
                <Link
                  href="/login"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-blue-600"
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