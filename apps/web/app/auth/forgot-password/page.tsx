"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Send, MailCheck, AlertCircle } from "lucide-react";
import { useForgotPassword } from "@/hooks/auth/use-forgot-password";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const { mutate: forgotPassword, isPending, error } = useForgotPassword();

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    const redirectTo = `${window.location.origin}/auth/reset-password`;
    forgotPassword({ email, redirectTo });
  };

  return (
    <>
      <a
        href="/auth/sign-in"
        className="mb-8 -mt-2 inline-flex items-center gap-1.5 text-xs text-gray-400 transition-colors hover:text-gray-600"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Sign In
      </a>

      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
        <MailCheck className="h-7 w-7 text-blue-600" />
      </div>

      <h1 className="mb-2 text-3xl font-bold tracking-tight text-gray-900">
        Forgot Password?
      </h1>
      <p className="mb-8 text-sm leading-relaxed text-gray-500">
        No worries! Enter your registered email address and we&apos;ll send you
        a link to reset your password.
      </p>

      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-xs font-medium text-gray-600">
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-11 border-gray-200 text-sm placeholder:text-gray-400 focus-visible:border-blue-500 focus-visible:ring-blue-100"
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 px-3.5 py-2.5 text-xs text-red-600 mb-4">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error.message}
        </div>
      )}

      <Button
        onClick={handleSubmit}
        disabled={isPending}
        className="mt-6 w-full gap-2 bg-blue-600 font-semibold shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow-md active:bg-blue-800"
        size="lg"
      >
        Send Reset Link
        <Send className="h-4 w-4" />
      </Button>

      <p className="mt-5 text-center text-sm text-gray-500">
        Remembered it?{" "}
        <a
          href="/auth/sign-in"
          className="font-semibold text-blue-600 hover:underline"
        >
          Sign In
        </a>
      </p>
    </>
  );
}
