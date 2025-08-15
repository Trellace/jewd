// src/app/auth/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="relative h-screen w-screen p-4 flex items-center justify-center bg-[rgba(0,0,0,0.02)]">
      {/* Back to home */}
      <Button asChild variant="ghost" className="absolute left-4 top-4">
        <Link href="/"><ArrowLeft /></Link>
      </Button>

      {/* Auth card */}
      <div className="w-[92%] max-w-md rounded-2xl bg-white shadow-xl p-6 md:p-8">
        <h2 className="text-xl font-semibold text-gray-900">Welcome back</h2>
        <p className="text-sm text-gray-600 mt-1">
          Sign in to personalise your home match score.
        </p>

        <form className="mt-6 space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-800">Email</label>
            <input
              type="email"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-800">Password</label>
            <input
              type="password"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 select-none">
              <input type="checkbox" className="accent-gray-900" />
              Remember me
            </label>
            <Link href="/auth/reset" className="text-gray-700 hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-gray-900 text-white py-2.5 font-medium hover:bg-gray-800 transition"
          >
            Sign In
          </button>
        </form>

        <div className="mt-5 grid grid-cols-1 gap-3">
          <button className="w-full rounded-lg border border-gray-300 bg-white py-2.5 font-medium hover:bg-gray-50 transition">
            Continue with Google
          </button>
          <button className="w-full rounded-lg border border-gray-300 bg-white py-2.5 font-medium hover:bg-gray-50 transition">
            Continue with Apple
          </button>
        </div>

        <div className="mt-4 text-center">
          <Link href="/onboarding/profile" className="text-sm text-gray-700 hover:underline">
            Explore without logging in
          </Link>
        </div>
      </div>
    </div>
  );
}
