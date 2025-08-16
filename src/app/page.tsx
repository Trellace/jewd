"use client";

import { Header } from "@/components/Header";
import MapComponent from "@/components/MapComponent";
import MarkerChatBox from "@/components/MarkerChatBox";

import { MessagePanel } from "@/components/MessagePanel";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative h-screen w-screen overflow-hidden">
        <Header/>
        <MapComponent />
        <MessagePanel/>
    </div>
  );
}