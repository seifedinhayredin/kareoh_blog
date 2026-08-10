"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getUser() {
      try {
        const response = await api.get("/auth/me/");

        setUser(response.data);
      } catch (error: any) {
        console.error(error);

        setError("Not authenticated.");
      }
    }

    getUser();
  }, []);

  return (
    <main className="p-10">
      <h1 className="mb-5 text-2xl font-bold">
        Home
      </h1>

      {user ? (
        <div>
          <p>
            Welcome, {user.username}
          </p>

          <p>
            Email: {user.email}
          </p>
        </div>
      ) : (
        <p>{error || "Loading..."}</p>
      )}
    </main>
  );
}