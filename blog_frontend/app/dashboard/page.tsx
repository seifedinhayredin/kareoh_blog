"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/components/AuthProvider";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <main className="min-h-screen p-10">
        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>

        <div className="mt-6 rounded-lg border p-6">
          <h2 className="text-xl font-semibold">
            Welcome, {user?.username}
          </h2>

          <p className="mt-2">
            Email: {user?.email}
          </p>

          <p>
            Name: {user?.first_name} {user?.last_name}
          </p>
        </div>
      </main>
    </ProtectedRoute>
  );
}