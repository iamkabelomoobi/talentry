"use client";

import Link from "next/link";
import { MailCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ConfirmEmailPage() {
  const router = useRouter();
  const emailSessionKey = "pending_verification_email";

  const [email] = useState(() => {
    if (typeof window === "undefined") return "";
    return sessionStorage.getItem(emailSessionKey) ?? "";
  });

  useEffect(() => {
    if (!email) {
      router.replace("/auth/sign-in");
      return;
    }
    sessionStorage.removeItem(emailSessionKey);
  }, [email, router]);

  if (!email) return null;

  return (
    <>
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
        <MailCheck className="h-6 w-6" />
      </div>

      <h1 className="mb-2 text-3xl font-bold tracking-tight text-gray-900">
        Confirm your email
      </h1>
      <p className="mb-6 text-sm text-gray-500">
        We&apos;ve sent a verification link to{" "}
        <span className="font-semibold text-gray-700">{email}</span>. Open your
        inbox and verify your account to continue.
      </p>

      <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
        Didn&apos;t get the email? Check your spam folder, then try signing up
        again if needed.
      </div>

      <div className="mt-6">
        <Link
          href="/auth/sign-in"
          className="inline-flex h-11 w-full items-center justify-center rounded-md bg-blue-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Back to sign in
        </Link>
      </div>
    </>
  );
}
