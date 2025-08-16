"use client";

import { Header } from "@/components/Header";
import MapComponent from "@/components/MapComponent";

import { MessagePanel } from "@/components/MessagePanel";

export default function Home() {
  return (
    <div className="relative h-screen w-screen overflow-hidden">
        <Header/>
        <MapComponent />
        <MessagePanel/>
    </div>
  );
}