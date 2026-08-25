"use client";

import Link from "next/link";

import {
  KeyRound,
  LogOut,
  User,
} from "lucide-react";

import { useAuth } from "@/components/AuthProvider";

export default function SettingsPage() {
  const { logout } = useAuth();

  async function handleLogout() {
    await logout();
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:py-10">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Settings
          </h1>

          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Manage your profile and account settings.
          </p>
        </div>

        {/* Settings options */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Profile */}
          <Link
            href="/settings/profile"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-700"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
              <User className="h-5 w-5" />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-slate-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
              Profile Information
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Update your bio, profession, and education.
            </p>
          </Link>

          {/* Password */}
          <Link
            href="/settings/password"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-700"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
              <KeyRound className="h-5 w-5" />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-slate-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
              Change Password
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Change your current password and secure your account.
            </p>
          </Link>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:border-red-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-red-800 sm:col-span-2"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400">
              <LogOut className="h-5 w-5" />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-red-600 dark:text-red-400">
              Logout
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Sign out of your account on this device.
            </p>
          </button>
        </div>
      </div>
    </main>
  );
}