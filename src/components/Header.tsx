"use client";

import { useEffect, useState } from "react";

const EMOJIS = [
  "😄","🤖","🐨","🐯","🐶","🐱","🐧","🐸","🐵","🦊","🐼","🐻","🐷","🐮","🐔","🐙","👾","🧠","🌏","🚀","💬"
];

export const Header = () => {
  const [open, setOpen] = useState(false);
  const [avatar, setAvatar] = useState("😄");
  const [locationLabel, setLocationLabel] = useState<string>("");

  // Load saved avatar
  useEffect(() => {
    try {
      const saved = localStorage.getItem("avatarEmoji");
      if (saved) setAvatar(saved);
    } catch {}
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
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const selectEmoji = (e: string) => {
    setAvatar(e);
    try { localStorage.setItem("avatarEmoji", e); } catch {}
    setOpen(false);
  };

  return (
    <>
      <div className="absolute top-0 p-4 justify-between items-center w-full z-10 flex flex-row">
        <h1 className="text-xl font-semibold text-neutral-600">99999 Messages</h1>

        <div className="flex items-center gap-3">
          <div
            className="hidden sm:flex items-center max-w-[50vw] rounded-full bg-white/80 backdrop-blur px-3 py-1.5 text-sm text-neutral-700 shadow ring-1 ring-black/10"
            aria-live="polite"
          >
            <span className="mr-1">📍</span>
            <span className="truncate">
              {locationLabel ? locationLabel : "Locating..."}
            </span>
          </div>

          <button
            type="button"
            aria-label="Open avatar picker"
            onClick={() => setOpen(true)}
            className="h-10 w-10 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow ring-1 ring-black/10 hover:scale-105 transition"
          >
            <span className="text-2xl leading-none">{avatar}</span>
          </button>
        </div>
      </div>

      {open && (
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
      )}
    </>
  );
};