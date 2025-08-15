// src/app/page.tsx
"use client";

import MapComponent from "@/components/MapComponent";
import { MessagePanel } from "@/components/MessagePanel";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative h-screen w-screen overflow-hidden">
        <MapComponent />

        <MessagePanel/>
    </div>
  );
}