"use client";

import { FormEvent, useState } from "react";
import api from "@/lib/axios";
import { getCsrfToken } from "@/lib/csrf";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const csrfToken = await getCsrfToken();
      console.log("CSRF Token:", csrfToken);

      await api.post(
        "/auth/login/",
        {
          username,
          password,
        },
        {
          headers: {
            "X-CSRFToken": csrfToken,
          },
        }
      );

      window.location.href = "/";
    } catch (error: any) {
      console.error(error);

      if (error.response?.data) {
        setError(
          error.response.data.detail ||
            error.response.data.non_field_errors?.[0] ||
            "Login failed."
        );
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-5 rounded-lg border p-6"
      >
        <h1 className="text-2xl font-bold">
          Login
        </h1>

        {error && (
          <p className="rounded bg-red-100 p-3 text-red-700">
            {error}
          </p>
        )}

        <div>
          <label className="mb-1 block">
            Username
          </label>

          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded border p-2"
            required
          />
        </div>

        <div>
          <label className="mb-1 block">
            Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded border p-2"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-blue-600 p-2 text-white disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </main>
  );
}