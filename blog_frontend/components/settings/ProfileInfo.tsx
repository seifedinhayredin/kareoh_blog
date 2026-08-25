"use client";

import { FormEvent, useEffect, useState } from "react";

import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Save,
} from "lucide-react";

import { useAuth } from "@/components/AuthProvider";
import { getProfile, updateProfile, UserProfile } from "@/lib/profile";



export default function ProfileInfo() {
  const { user, loading: authLoading } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);

  const [bio, setBio] = useState("");
  const [profession, setProfession] = useState("");
  const [education, setEducation] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* =========================
     LOAD PROFILE
  ========================= */

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      setLoading(false);
      return;
    }

    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProfile();

        setProfile(data);

        setBio(data.bio ?? "");
        setProfession(data.profession ?? "");
        setEducation(data.education ?? "");
      } catch (err) {
        console.error("Failed to load profile:", err);

        setError(
          "Unable to load your profile information. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user, authLoading]);

  /* =========================
     SAVE PROFILE
  ========================= */

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!user) {
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const updatedProfile = await updateProfile({
        bio,
        profession,
        education,
      });

      setProfile(updatedProfile);

      setBio(updatedProfile.bio ?? "");
      setProfession(updatedProfile.profession ?? "");
      setEducation(updatedProfile.education ?? "");

      setSuccess("Profile information saved successfully.");

      // Automatically hide success message
      setTimeout(() => {
        setSuccess("");
      }, 4000);
    } catch (err) {
      console.error("Failed to update profile:", err);

      setError(
        "Unable to save your profile information. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================
     AUTH LOADING
  ========================= */

  if (authLoading) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10 dark:bg-gray-950">
        <div className="mx-auto flex max-w-3xl items-center justify-center py-20">
          <Loader2 className="h-7 w-7 animate-spin text-gray-500" />
        </div>
      </main>
    );
  }

  /* =========================
     NOT AUTHENTICATED
  ========================= */

  if (!user) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10 dark:bg-gray-950">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

              <div>
                <h2 className="font-semibold">
                  Authentication required
                </h2>

                <p className="mt-1 text-sm">
                  You must be logged in to access your settings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* =========================
     PROFILE LOADING
  ========================= */

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10 dark:bg-gray-950">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8">
            <div className="h-9 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />

            <div className="mt-3 h-5 w-72 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="space-y-6">
              <div>
                <div className="mb-2 h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                <div className="h-28 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800" />
              </div>

              <div>
                <div className="mb-2 h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                <div className="h-11 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800" />
              </div>

              <div>
                <div className="mb-2 h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                <div className="h-11 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800" />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 dark:bg-gray-950">
      <div className="mx-auto max-w-3xl">
        {/* =========================
            HEADER
        ========================= */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Settings
          </h1>

          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Manage your profile information.
          </p>
        </div>

        {/* =========================
            ERROR
        ========================= */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* =========================
            SUCCESS
        ========================= */}

        {success && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-400">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />

              <p className="text-sm font-medium">{success}</p>
            </div>
          </div>
        )}

        {/* =========================
            PROFILE INFORMATION
        ========================= */}

        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div className="border-b border-gray-200 px-6 py-5 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Profile Information
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Add information that helps people learn more about you.
            </p>
          </div>

          <div className="space-y-6 p-6">
            {/* =========================
                BIO
            ========================= */}

            <div>
              <label
                htmlFor="bio"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-200"
              >
                Bio
              </label>

              <textarea
                id="bio"
                name="bio"
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                placeholder="Tell people a little about yourself..."
                rows={5}
                className="w-full resize-y rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:placeholder:text-gray-600"
              />

              <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-500">
                Optional
              </p>
            </div>

            {/* =========================
                PROFESSION
            ========================= */}

            <div>
              <label
                htmlFor="profession"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-200"
              >
                Profession
              </label>

              <input
                id="profession"
                name="profession"
                type="text"
                value={profession}
                onChange={(event) =>
                  setProfession(event.target.value)
                }
                placeholder="e.g. Software Developer"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:placeholder:text-gray-600"
              />

              <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-500">
                Optional
              </p>
            </div>

            {/* =========================
                EDUCATION
            ========================= */}

            <div>
              <label
                htmlFor="education"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-200"
              >
                Education
              </label>

              <input
                id="education"
                name="education"
                type="text"
                value={education}
                onChange={(event) =>
                  setEducation(event.target.value)
                }
                placeholder="e.g. Computer Science"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:placeholder:text-gray-600"
              />

              <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-500">
                Optional
              </p>
            </div>
          </div>

          {/* =========================
              FOOTER
          ========================= */}

          <div className="flex justify-end border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-800 dark:bg-gray-950/50">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:focus:ring-offset-gray-900"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>

    
      </div>
    </main>
  );
}