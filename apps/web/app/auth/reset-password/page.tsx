"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useResetPassword } from "@/hooks/auth/use-reset-password";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  LogIn,
} from "lucide-react";

export default function ResetPasswordPage() {
  const [token] = useState(() => {
    if (typeof window === "undefined") {
      return "";
    }

    return (
      new URLSearchParams(window.location.search).get("token")?.trim() ?? ""
    );
  });
  const { mutate: resetPassword, isPending } = useResetPassword();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const submitResetPassword = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!token) {
      setError("Invalid or missing reset token.");
      return;
    }

    if (!password || !confirmPassword) {
      setError("Please fill in both password fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    resetPassword(
      { token, newPassword: password },
      {
        onSuccess: () => setIsSuccess(true),
        onError: (mutationError) => {
          setError(mutationError.message || "Failed to reset password.");
        },
      },
    );
  };

  if (isSuccess) {
    return (
      <div className="mt-8 flex flex-col items-center text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-gray-900">
          Password Reset
        </h1>
        <p className="mb-8 text-sm leading-relaxed text-gray-500">
          Your password has been updated. You can now sign in with your new
          password.
        </p>
        <Button
          asChild
          className="w-full gap-2 bg-blue-600 hover:bg-blue-700"
          size="lg"
        >
          <Link href="/auth/sign-in">
            Continue to Sign In
            <LogIn className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <Link
        href="/auth/sign-in"
        className="mb-8 -mt-2 inline-flex items-center gap-1.5 text-xs text-gray-400 transition-colors hover:text-gray-600"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Sign In
      </Link>

      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
        <KeyRound className="h-7 w-7 text-blue-600" />
      </div>

      <h1 className="mb-2 text-3xl font-bold tracking-tight text-gray-900">
        Reset Password
      </h1>
      <p className="mb-8 text-sm leading-relaxed text-gray-500">
        Enter your new password to finish resetting your account.
      </p>

      <form className="space-y-4" onSubmit={submitResetPassword}>
        <div className="space-y-1.5">
          <Label
            htmlFor="password"
            className="text-xs font-medium text-gray-600"
          >
            New Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-11 border-gray-200 pr-10 text-sm placeholder:text-gray-400 focus-visible:border-blue-500 focus-visible:ring-blue-100"
              disabled={isPending}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="confirmPassword"
            className="text-xs font-medium text-gray-600"
          >
            Confirm New Password
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="h-11 border-gray-200 pr-10 text-sm placeholder:text-gray-400 focus-visible:border-blue-500 focus-visible:ring-blue-100"
              disabled={isPending}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 px-3.5 py-2.5 text-xs text-red-600">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {!token && (
          <div className="flex items-center gap-2 rounded-lg border border-amber-100 bg-amber-50 px-3.5 py-2.5 text-xs text-amber-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            Reset token not found. Open the reset link from your email again.
          </div>
        )}

        <Button
          type="submit"
          className="w-full gap-2 bg-blue-600 font-semibold shadow-sm transition-all duration-200 hover:bg-blue-700"
          size="lg"
          disabled={isPending || !token}
        >
          {isPending ? "Resetting Password..." : "Reset Password"}
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <KeyRound className="h-4 w-4" />
          )}
        </Button>
      </form>
    </>
  );
}
