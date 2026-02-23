"use client";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Eye,
  EyeOff,
  User,
  Briefcase,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { UserRole } from "@/types/user/user";
import { useSignUp } from "@/hooks/auth/use-sign-up";
import SocialAuth from "@/components/auth/SocialAuth";

type AccountType = UserRole.COMPANY | UserRole.SEEKER;

export default function SignUpPage() {
  const [accountType, setAccountType] = useState<AccountType>(UserRole.SEEKER);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const { mutate: signUp, isPending, error } = useSignUp();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    signUp({ ...form, role: accountType });
  };

  return (
    <>
      <h1 className="mb-6 text-3xl font-bold tracking-tight text-gray-900">
        Create Account
      </h1>

      <div className="mb-6 flex rounded-lg border border-gray-200 bg-gray-50 p-1">
        {([UserRole.COMPANY, UserRole.SEEKER] as AccountType[]).map((type) => (
          <button
            key={type}
            onClick={() => setAccountType(type)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
              accountType === type
                ? "bg-gray-900 text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {type === UserRole.SEEKER ? (
              <User className="h-4 w-4" />
            ) : (
              <Briefcase className="h-4 w-4" />
            )}
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      <p className="mb-3 text-center text-xs text-gray-400">Sign up with</p>
      <SocialAuth />

      <div className="relative mb-5 flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-gray-400">or fill in your details</span>
        <Separator className="flex-1" />
      </div>

      <div className="space-y-4">
        <div className="flex-1 space-y-1.5">
          <Label htmlFor="name" className="text-xs font-medium text-gray-600">
            Name
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Full name"
            value={form.name}
            onChange={handleChange}
            className="h-11 border-gray-200 text-sm placeholder:text-gray-400 focus-visible:ring-blue-100 focus-visible:border-blue-500"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex-1 space-y-1.5">
            <Label
              htmlFor="email"
              className="text-xs font-medium text-gray-600"
            >
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              className="h-11 border-gray-200 text-sm placeholder:text-gray-400 focus-visible:ring-blue-100 focus-visible:border-blue-500"
            />
          </div>

          <div className="flex-1 space-y-1.5">
            <Label
              htmlFor="phone"
              className="text-xs font-medium text-gray-600"
            >
              Mobile Phone
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="Mobile phone number"
              value={form.phone}
              onChange={handleChange}
              className="h-11 border-gray-200 text-sm placeholder:text-gray-400 focus-visible:ring-blue-100 focus-visible:border-blue-500"
            />
          </div>
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
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
              className="h-11 border-gray-200 pr-10 text-sm placeholder:text-gray-400 focus-visible:ring-blue-100 focus-visible:border-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
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
            Confirm Password
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Enter password again"
              value={form.confirmPassword}
              onChange={handleChange}
              className="h-11 border-gray-200 pr-10 text-sm placeholder:text-gray-400 focus-visible:ring-blue-100 focus-visible:border-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
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
        className="mt-6 w-full gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 font-semibold shadow-sm hover:shadow-md transition-all duration-200"
        size="lg"
      >
        {isPending ? "Signing Up..." : "Sign Up"}
        <ArrowRight className="h-4 w-4" />
      </Button>

      <p className="mt-4 text-center text-sm text-gray-500">
        Already have account?{" "}
        <a
          href="/auth/sign-in"
          className="font-semibold text-blue-600 hover:underline"
        >
          Login
        </a>
      </p>

      <p className="mt-4 text-center text-xs leading-relaxed text-gray-400">
        By clicking &quot;Create Account/Google/LinkedIn&quot; above, you
        acknowledge that you have read and understood, and agree to
        Talentry&apos;s{" "}
        <a href="#" className="underline hover:text-gray-600">
          Terms &amp; Conditions
        </a>{" "}
        and{" "}
        <a href="#" className="underline hover:text-gray-600">
          Privacy Policy
        </a>
      </p>
    </>
  );
}
