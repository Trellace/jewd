"use client";

import MapComponent from "@/components/MapComponent";
import { SearchPanel } from "@/components/search-panel";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

// THIS IS THE LANDING PAGE - default route
export default function Home() {
  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Full-screen map background */}
      <div className="absolute inset-0 -z-10">
        <MapComponent />
      </div>

      {/* Optional dark overlay for readability */}
      <div className="absolute inset-0 bg-black/20 -z-10" />

      {/* Top bar */}
      <header className="absolute top-0 inset-x-0 p-4 md:p-6 flex items-center justify-between">
        <h1 className="text-white text-2xl md:text-3xl font-semibold tracking-tight">
          Site Name
        </h1>
        <nav className="flex items-center gap-2">
          <Link
            href="/explore"
            className="rounded-xl px-4 py-2 text-sm font-medium bg-white/10 text-white backdrop-blur hover:bg-white/20 transition"
          >
            Explore
          </Link>
          <Link
            href="/auth"
            className="rounded-xl px-4 py-2 text-sm font-medium bg-white text-gray-900 hover:bg-gray-100 transition"
          >
            Sign In
          </Link>
        </nav>
      </header>

      {/* Centered login popup */}
      <main className="absolute left-1/2 top-1/2 w-[92%] max-w-md -translate-x-1/2 -translate-y-1/2">
        <div className="rounded-2xl bg-white/90 backdrop-blur shadow-xl p-6 md:p-8">
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
            <Link
              href="/onboarding/profile"
              className="text-sm text-gray-700 hover:underline"
            >
              Explore without logging in
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}