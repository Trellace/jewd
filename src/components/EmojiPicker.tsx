"use client";

import * as React from "react";

import {
  EmojiPicker,
  EmojiPickerSearch,
  EmojiPickerContent,
} from "@/components/ui/emoji-picker";

export default function Page() {
  return (
    <main className="flex h-full min-h-screen w-full items-center justify-center p-4">
      <EmojiPicker
        className="h-[326px] rounded-lg border shadow-md"
        onEmojiSelect={({ emoji }) => {
          console.log(emoji);
        }}
      >
        <EmojiPickerSearch />
        <EmojiPickerContent />
      </EmojiPicker>
    </main>
  );
}