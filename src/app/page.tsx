// src/app/page.tsx
"use client";

import MapComponent from "@/components/MapComponent";
import Link from "next/link";

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
    </div>
  );
}