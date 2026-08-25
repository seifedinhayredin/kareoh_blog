"use client";

import ProfileInfo from "@/components/settings/ProfileInfo";

export default function ProfileSettingsPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:py-10">
      <div className="mx-auto max-w-3xl">
        <ProfileInfo />
      </div>
    </main>
  );
}