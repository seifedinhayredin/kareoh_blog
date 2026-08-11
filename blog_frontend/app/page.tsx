"use client";

import { useAuth } from "@/components/AuthProvider";

export default function HomePage() {
  const {
    user,
    loading,
    logout,
  } = useAuth();

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className="p-10">
      {user ? (
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">
            Welcome, {user.username}!
          </h1>

          <p>
            Email: {user.email}
          </p>

          <p>
            Name: {user.first_name}{" "}
            {user.last_name}
          </p>

          <button
            onClick={logout}
            className="rounded bg-red-600 px-4 py-2 text-white"
          >
            Logout
          </button>
        </div>
      ) : (
        <div>
          <h1 className="text-2xl font-bold">
            Welcome to the Blog
          </h1>

          <p className="mt-2">
            You are not logged in.
          </p>
        </div>
      )}
    </main>
  );
}