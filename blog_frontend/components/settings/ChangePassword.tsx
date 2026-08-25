"use client";

import {
  FormEvent,
  useState,
} from "react";

import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
} from "lucide-react";

import { useRouter } from "next/navigation";

import { changePassword } from "@/lib/auth";

export default function ChangePassword() {
  const router = useRouter();

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  /* =========================
     SUBMIT
  ========================= */

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    /* =========================
       FRONTEND VALIDATION
    ========================= */

    if (!currentPassword) {
      setError("Please enter your current password.");
      return;
    }

    if (!newPassword) {
      setError("Please enter a new password.");
      return;
    }

    if (newPassword.length < 8) {
      setError(
        "New password must be at least 8 characters."
      );
      return;
    }

    if (!confirmPassword) {
      setError(
        "Please confirm your new password."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      setError(
        "New password must be different from your current password."
      );
      return;
    }

    /* =========================
       API REQUEST
    ========================= */

    try {
      setSaving(true);

      await changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });

      setSuccess(
        "Password updated successfully. Please log in again."
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      /*
       * Give the user a moment to see the
       * success message before redirecting.
       */
      setTimeout(() => {
        router.replace("/login");
      }, 1500);
    } catch (error: any) {
      console.error(
        "Password change failed:",
        error
      );

      const responseData =
        error?.response?.data;

      if (
        responseData?.current_password
      ) {
        setError(
          responseData.current_password[0]
        );
      } else if (
        responseData?.new_password
      ) {
        setError(
          responseData.new_password[0]
        );
      } else if (
        responseData?.detail
      ) {
        setError(
          responseData.detail
        );
      } else {
        setError(
          "Unable to update your password. Please try again."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      {/* =========================
          HEADER
      ========================= */}

      <div className="border-b border-gray-200 px-6 py-5 dark:border-gray-800">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
            <KeyRound className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Change Password
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Update your password to keep your account secure.
            </p>
          </div>
        </div>
      </div>

      {/* =========================
          SUCCESS
      ========================= */}

      {success && (
        <div className="mx-6 mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-400">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />

            <p className="text-sm font-medium">
              {success}
            </p>
          </div>
        </div>
      )}

      {/* =========================
          ERROR
      ========================= */}

      {error && (
        <div className="mx-6 mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

            <p className="text-sm">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* =========================
          FORM
      ========================= */}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 p-6"
      >
        {/* CURRENT PASSWORD */}

        <PasswordField
          id="current-password"
          label="Current Password"
          value={currentPassword}
          onChange={setCurrentPassword}
          visible={showCurrentPassword}
          onToggle={() =>
            setShowCurrentPassword(
              (previous) => !previous
            )
          }
          autoComplete="current-password"
        />

        {/* NEW PASSWORD */}

        <PasswordField
          id="new-password"
          label="New Password"
          value={newPassword}
          onChange={setNewPassword}
          visible={showNewPassword}
          onToggle={() =>
            setShowNewPassword(
              (previous) => !previous
            )
          }
          autoComplete="new-password"
        />

        <p className="-mt-4 text-xs text-gray-500 dark:text-gray-500">
          Password must contain at least 8 characters.
        </p>

        {/* CONFIRM PASSWORD */}

        <PasswordField
          id="confirm-password"
          label="Confirm New Password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          visible={showConfirmPassword}
          onToggle={() =>
            setShowConfirmPassword(
              (previous) => !previous
            )
          }
          autoComplete="new-password"
        />

        {/* ACTION */}

        <div className="flex justify-end border-t border-gray-200 pt-6 dark:border-gray-800">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:focus:ring-offset-gray-900"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Password"
            )}
          </button>
        </div>
      </form>
    </section>
  );
}

/* =========================
   PASSWORD FIELD
========================= */

interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  visible: boolean;
  onToggle: () => void;
  autoComplete: string;
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  visible,
  onToggle,
  autoComplete,
}: PasswordFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-200"
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          name={id}
          type={
            visible
              ? "text"
              : "password"
          }
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          autoComplete={autoComplete}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-12 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:placeholder:text-gray-600"
        />

        <button
          type="button"
          onClick={onToggle}
          aria-label={
            visible
              ? `Hide ${label}`
              : `Show ${label}`
          }
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-300"
        >
          {visible ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}