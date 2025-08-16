"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/contexts/userContext";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import Image from "next/image";

import {
  EmojiPicker,
  EmojiPickerSearch,
  EmojiPickerContent,
  EmojiPickerFooter,
} from "@/components/ui/emoji-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./ui/button";

const EMOJIS = [
  "😄","🤖","🐨","🐯","🐶","🐱","🐧","🐸","🐵","🦊","🐼","🐻","🐷","🐮","🐔","🐙","👾","🧠","🌏","🚀","💬"
];

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [avatar, setAvatar] = useState("😄");
  const [locationLabel, setLocationLabel] = useState<string>("");
  const [messageCount, setMessageCount] = useState(0);
  const {user, setUser} = useUser();

    useEffect(() => {
        async function getCount() {
            const response = await fetch('/api/checkdb', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
            });
            const { count } = await response.json();
            if (count) setMessageCount(count);
        }

        getCount();

        // If user hasn't been created yet, create it with default emoji
        // if (!user && setUser) {
            
        // }
        setUser({
        id: '',   // placeholder, updated later
        emoji: avatar,
        location: { lat: 0, lng: 0 }, // placeholder until geolocation updates
        });
    }, []);

  // Fetch approximate location by IP (cached per session)
  useEffect(() => {
    const cached = sessionStorage.getItem("geoLabel");
    if (cached) {
      setLocationLabel(cached);
      return;
    }
    (async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");
        if (!res.ok) throw new Error("geo fetch failed");
        const data: Partial<{
          city: string; region: string; country_name: string;
        }> = await res.json();
        const city = data.city || data.region || "";
        const country = data.country_name || "";
        const label = [city, country].filter(Boolean).join(", ");
        const finalLabel = label || "Unknown";
        sessionStorage.setItem("geoLabel", finalLabel);
        setLocationLabel(finalLabel);
      } catch {
        setLocationLabel("Unknown");
      }
    })();
  }, []);

  // Close with Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIsOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

    const selectEmoji = (emoji: string) => {
        setAvatar(emoji);
        setIsOpen(false);

        if (user && setUser) {
            setUser({ ...user, emoji }); // update the user context
        }
    };

  return (
    <>
      <div className="absolute top-0 p-4 px-6 justify-between items-center w-full z-10 flex flex-row">
        <div className="flex flex-row items-center gap-2 -top-36">
          <div className="logo w-full text-purple-500 font-bold h-12 overflow-hidden flex items-center">
            <Image src="/logo-typed.png" height={50} width={200} className="max-h-full w-auto object-contain" alt="DOXXED LOGO" />
            {/* DOXXED */}
          </div>
          <h1 className="text-md font-semibold text-neutral-600 w-full select-none">{messageCount} messages</h1>
        </div>

        <div className="flex flex-row items-center gap-3">
          {/* <div className="flex items-center space-x-2">
              <Switch id="collapse" />
              <Label htmlFor="collapse" className="text-neutral-800">Collapse messages</Label>
          </div> */}

          <div
            className="hidden select-none sm:flex items-center max-w-[50vw] rounded-full bg-white/80 backdrop-blur px-3 py-1.5 text-sm text-neutral-700 shadow ring-1 ring-black/10"
            aria-live="polite"
          >
            <span className="mr-1">📍</span>
            <span className="truncate">
              {locationLabel ? locationLabel : "Locating..."}
            </span>
          </div>

          <Popover onOpenChange={setIsOpen} open={isOpen}>
            <PopoverTrigger asChild>
              <Button className="text-2xl w-10 h-10 rounded-full p-1 ring-black/10 ring-1 shadow-sm border hover:bg-white/50 bg-white/80 hover:scale-105">{avatar}</Button>
            </PopoverTrigger>
            <PopoverContent className="w-fit p-0">
              <EmojiPicker
                className="h-[342px]"
                onEmojiSelect={({ emoji }) => {
                  setIsOpen(false);
                  selectEmoji(emoji);
                }}
              >
                <EmojiPickerSearch />
                <EmojiPickerContent />
              </EmojiPicker>
            </PopoverContent>
          </Popover>
        </div>
      </div>





      {/* {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Select your avatar"
          className="fixed inset-0 z-50 flex items-start justify-end p-4 sm:items-center sm:justify-center bg-black/30"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-4 shadow-xl ring-1 ring-black/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Select your avatar</h2>
              <button
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-1 text-sm text-neutral-500 hover:bg-neutral-100"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="mt-3 grid grid-cols-6 gap-2">
              {EMOJIS.map((e) => (
                <button
                  key={e}
                  onClick={() => selectEmoji(e)}
                  aria-label={`Choose ${e}`}
                  className={`h-10 w-10 rounded-xl flex items-center justify-center text-2xl transition
                    ${avatar === e ? "ring-2 ring-blue-500 bg-white" : "ring-1 ring-neutral-200 bg-white"}
                    hover:scale-110 hover:bg-neutral-100`}
                >
                  <span className="leading-none">{e}</span>
                </button>
              ))}
            </div>

            <p className="mt-3 text-xs text-neutral-500">
              Your emoji appears as your profile icon on the map.
            </p>
          </div>
        </div>
      )} */}
    </>
  );
};