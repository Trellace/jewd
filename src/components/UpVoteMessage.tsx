"use client";

import React, { useState } from "react";
import { ArrowBigDown, ArrowBigUp, ArrowRight, MapPin } from "lucide-react";

interface UpVoteMessageProps {
  message: string;
  voteCount: number;
  id: string;
}

const UpVoteMessage: React.FC<UpVoteMessageProps> = ({ message, voteCount, id }) => {
  const [upvotes, setUpvotes] = useState(voteCount);

  async function handleVote(id: string, action: "up" | "down") {
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }), // action tells server to add or subtract
      });

      if (!res.ok) throw new Error("Failed to update vote");

      setUpvotes(action == 'up' ? upvotes + 1 : upvotes - 1);

      const data = await res.json();
  //    console.log("Updated message:", data.message);
    } catch (err) {
      console.error(err);
    }
  }
  
  return (
    <div className="absolute flex flex-row gap-x-2 w-max">
        <button onClick={() => handleVote(id, "up")} className="bg-white text-neutral-500 p-1.5 rounded-2xl hover:bg-green-400">
            <ArrowBigUp />
        </button>

        <p className="bg-white text-neutral-500 px-3 py-2 rounded-2xl shadow text-sm"> {upvotes}</p>

        <button onClick={() => handleVote(id, "down")} className="bg-white text-neutral-500 p-1.5 rounded-2xl hover:hover:bg-red-400">
            <ArrowBigDown />
        </button>
      
        <div className="bg-white text-neutral-500 px-3 py-2 rounded-xl shadow text-sm">
            <p>{message}</p>
        </div>
    </div>
  )
};

export default UpVoteMessage;
