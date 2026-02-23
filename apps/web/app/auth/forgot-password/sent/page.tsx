"use client";

import { ArrowLeft, MailCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ForgotPasswordSentPage() {
  const router = useRouter();
  const emailSessionKey = "pending_forgot_password_email";

  const [email] = useState(() => {
    if (typeof window === "undefined") return "";
    return sessionStorage.getItem(emailSessionKey) ?? "";
  });

  useEffect(() => {
    if (!email) {
      router.replace("/auth/forgot-password");
      return;
    }
    sessionStorage.removeItem(emailSessionKey);
  }, [email, router]);

  if (!email) return null;

  return (
    <div className="flex flex-col items-center text-center mt-8">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
        <MailCheck className="h-9 w-9 text-green-600" />
      </div>

      <h1 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
        Check Your Email
      </h1>
      <p className="text-sm leading-relaxed text-gray-500">
        We&apos;ve sent a password reset link to
      </p>
      <p className="mb-8 mt-1 text-sm font-semibold text-gray-800">{email}</p>

      <p className="mb-6 text-xs leading-relaxed text-gray-400">
        Didn&apos;t receive the email? Check your spam folder or{" "}
        <button
          onClick={() => router.push("/auth/forgot-password")}
          className="font-medium text-blue-600 hover:underline"
        >
          try another email address
        </button>
        .
      </p>

      <a
        href="/auth/sign-in"
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition-colors hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Sign In
      </a>
    </div>
  );
}
