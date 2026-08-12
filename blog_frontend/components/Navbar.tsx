"use client";

import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

export default function Navbar() {
  const {
    user,
    loading,
    logout,
  } = useAuth();

  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold"
        >
          My Blog
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-4">

          <Link
            href="/"
            className="hover:text-blue-600"
          >
            Home
          </Link>

          {loading ? (
            <span className="text-gray-500">
              Loading...
            </span>
          ) : user ? (
            <>
              <Link
                href="/dashboard"
                className="hover:text-blue-600"
              >
                Dashboard
              </Link>

              <span className="text-gray-600">
                Hi, {user.username}
              </span>

              <button
                onClick={logout}
                className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded border px-4 py-2 hover:bg-gray-100"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Register
              </Link>
            </>
          )}

        </div>
      </div>
    </nav>
  );
}