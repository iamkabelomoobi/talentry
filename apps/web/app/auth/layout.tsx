"use client";

import React, { ReactNode, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const testimonials = [
  {
    quote:
      "Thanks to this job portal website, I quickly found my dream job! Easy to navigate, countless opportunities, and excellent results. Highly recommended!",
    name: "Emily Kuper",
    title: "Satisfied Job Seeker",
  },
];

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(1);

  useEffect(() => {
    const hasSessionCookie = document.cookie
      .split("; ")
      .some(
        (cookie) =>
          cookie.startsWith("better-auth.session_token=") ||
          cookie.startsWith("__Secure-better-auth.session_token="),
      );

    if (hasSessionCookie) {
      router.replace("/");
    }
  }, [router]);

  return (
    <div className="flex min-h-screen w-full bg-white font-sans">
      <div className="flex w-full flex-col lg:w-[40%]">
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 sm:px-10">
          <div className="w-full max-w-lg ">
            <div className="mb-10 flex justify-center">
              <Image
                src="/images/logo/logo.svg"
                alt="Talentry"
                width={260}
                height={70}
                className="h-14 w-auto mb-15"
                priority
              />
            </div>

            {children}
          </div>
        </div>
      </div>

      <div className="relative hidden lg:block lg:w-[60%]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&auto=format&fit=crop&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-10 text-white">
          <p className="mb-4 text-base font-light leading-relaxed">
            &ldquo;{testimonials[activeIndex]?.quote}&rdquo;
          </p>
          <p className="text-sm font-semibold">
            {testimonials[activeIndex]?.name}
          </p>
          <p className="mt-0.5 text-xs text-white/60">
            {testimonials[activeIndex]?.title}
          </p>

          <div className="mt-5 flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                  i === activeIndex
                    ? "scale-110 bg-white"
                    : "bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
