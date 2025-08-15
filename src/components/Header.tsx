"use client";

import { useEffect, useMemo, useState } from "react";

const EMOJIS = ["😄","🤖","🐨","🐯","🐶","🐱","🐧","🐸","🐵","🦊","🐼","🐻","🐷","🐮","🐔","🐙","👾","🧠","🌏","🚀","💬"];

export const Header = () => {
  const [open, setOpen] = useState(false);
  const [avatar, setAvatar] = useState("😄");
  const [locationLabel, setLocationLabel] = useState<string>("");

  // --- Message count formatting (replace with real count later) ---
  const messageCount = 99999;
  const prettyCount = useMemo(
    () => new Intl.NumberFormat().format(messageCount),
    [messageCount]
  );

  // Load avatar
  useEffect(() => {
    try {
      const saved = localStorage.getItem("avatarEmoji");
      if (saved) setAvatar(saved);
    } catch {}
  }, []);

  // Fetch location (cached per session)
  useEffect(() => {
    const cached = sessionStorage.getItem("geoLabel");
    if (cached) return setLocationLabel(cached);
    (async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        const city = data?.city || data?.region || "";
        const country = data?.country_name || "";
        const label = [city, country].filter(Boolean).join(", ") || "Unknown";
        sessionStorage.setItem("geoLabel", label);
        setLocationLabel(label);
      } catch {
        setLocationLabel("Unknown");
      }
    })();
  }, []);

  // Close picker with Escape
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
      <div className="absolute top-0 left-0 right-0 p-4 z-10 flex items-center justify-between">
        {/* Left: count */}
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold text-neutral-700 dark:text-neutral-200">
            {prettyCount} Messages
          </h1>
          <span
            title="Live"
            className="inline-flex h-2 w-2 rounded-full bg-violet-500/80 dark:bg-violet-400/90"
          />
        </div>

        {/* Right: location + avatar */}
        <div className="flex items-center gap-3">
          {/* Gradient bordered location pill */}
          <div className="p-[1.5px] rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 shadow">
            <div
              className="hidden sm:flex items-center max-w-[50vw] rounded-full
                         bg-white/80 dark:bg-neutral-900/70 backdrop-blur px-3 py-1.5
                         text-sm text-neutral-700 dark:text-neutral-200 ring-1 ring-black/10 dark:ring-white/10"
              aria-live="polite"
              title={locationLabel || "Locating…"}
            >
              <span className="mr-1">📍</span>
              <span className="truncate">{locationLabel || "Locating…"}</span>
            </div>
          </div>

          {/* Avatar button */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open avatar picker"
            className="group relative h-10 w-10 rounded-full bg-white/80 dark:bg-neutral-900/70
                       backdrop-blur flex items-center justify-center shadow
                       ring-1 ring-black/10 dark:ring-white/10 transition-transform hover:scale-105"
          >
            {/* subtle hover ping */}
            <span className="pointer-events-none absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition">
              <span className="absolute inset-0 rounded-full animate-ping bg-violet-400/20 dark:bg-violet-300/10" />
            </span>
            <span className="text-2xl leading-none">{avatar}</span>
          </button>
        </div>
      </div>

      {/* Avatar picker modal */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Select your avatar"
          className="fixed inset-0 z-50 flex items-start justify-end p-4 sm:items-center sm:justify-center bg-black/30"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white dark:bg-neutral-900 p-4 shadow-xl
                       ring-1 ring-black/10 dark:ring-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">
                Select your avatar
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-1 text-sm text-neutral-500 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
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
                    ${avatar === e
                      ? "ring-2 ring-violet-500 bg-white dark:bg-neutral-800"
                      : "ring-1 ring-neutral-200 dark:ring-neutral-700 bg-white dark:bg-neutral-800"}
                    hover:scale-110`}
                >
                  <span className="leading-none">{e}</span>
                </button>
              ))}
            </div>

            <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400">
              Your emoji appears as your profile icon on the map.
            </p>
          </div>
        </div>
      )}
    </>
  );
};
