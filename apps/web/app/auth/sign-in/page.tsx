"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Eye, EyeOff, LogIn } from "lucide-react";
import { useSignIn } from "@/hooks/auth/use-sign-in";
import SocialAuth from "@/components/auth/SocialAuth";

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  // const [rememberMe, setRememberMe] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const { mutate: signIn, isPending, error } = useSignIn();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    signIn({ email: form.email, password: form.password });
  };

  return (
    <>
      <h1 className="mb-2 text-3xl font-bold tracking-tight text-gray-900">
        Welcome Back
      </h1>
      <p className="mb-8 text-sm text-gray-500">
        Sign in to your Talentry account to continue.
      </p>

      <SocialAuth />

      <div className="relative mb-5 flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-gray-400">or sign in with email</span>
        <Separator className="flex-1" />
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs font-medium text-gray-600">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            className="h-11 border-gray-200 text-sm placeholder:text-gray-400 focus-visible:border-blue-500 focus-visible:ring-blue-100"
          />
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="password"
            className="text-xs font-medium text-gray-600"
          >
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              className="h-11 border-gray-200 pr-10 text-sm placeholder:text-gray-400 focus-visible:border-blue-500 focus-visible:ring-blue-100"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
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
      </div>

      <div className="mt-4 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* <Checkbox
            id="remember"
            checked={rememberMe}
            onCheckedChange={(val) => setRememberMe(!!val)}
            className="border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
          />
          <Label
            htmlFor="remember"
            className="cursor-pointer text-xs text-gray-500"
          >
            Remember me
          </Label> */}
        </div>
        <a
          href="/auth/forgot-password"
          className="text-xs font-medium text-blue-600 hover:underline"
        >
          Forgot password?
        </a>
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
        className="w-full gap-2 bg-blue-600 font-semibold shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow-md active:bg-blue-800"
        size="lg"
      >
        {isPending ? "Signing in..." : "Sign In"}
        <LogIn className="h-4 w-4" />
      </Button>

      <p className="mt-5 text-center text-sm text-gray-500">
        Don&apos;t have an account?{" "}
        <a
          href="/auth/sign-up"
          className="font-semibold text-blue-600 hover:underline"
        >
          Create Account
        </a>
      </p>
    </>
  );
}
