"use client";

import React, { useState } from "react";
import { TbArrowBigDownFilled, TbArrowBigUpFilled } from "react-icons/tb";

interface UpVoteMessageProps {
  message: string;
  voteCount: number;
  id: string;
}

const UpVoteMessage: React.FC<UpVoteMessageProps> = ({ message, voteCount, id }) => {
  const [upvotes, setUpvotes] = useState(voteCount);

  async function handleVote(id: string, action: "up" | "down") {
    try {
      setUpvotes(action == 'up' ? upvotes + 1 : upvotes - 1); // change what is seen by the user, should be after db update but placed here to avoid the ui feeling slow

      const res = await fetch(`/api/messages/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }), // action tells server to add or subtract
      });

      if (!res.ok) throw new Error("Failed to update vote");


      //const data = await res.json();
  //    console.log("Updated message:", data.message);
    } catch (err) {
      console.error(err);
    }
  }
  
  return (
    <div className="flex flex-row gap-1 w-max items-center cursor-default">
        <button onClick={() => handleVote(id, "up")} className="bg-white cursor-pointer text-neutral-500 rounded-full hover:text-green-600 hover:scale-110 duration-150">
            <TbArrowBigUpFilled />
        </button>

        <p className={`text-lg mx-1 ${upvotes != 0 ? upvotes > 0 ? 'text-green-600' : 'text-red-500' : ''}`}> {upvotes}</p>

        <button onClick={() => handleVote(id, "down")} className="bg-white cursor-pointer text-neutral-500rounded-full hover:text-red-500 hover:scale-110 transition-all duration-150">
            <TbArrowBigDownFilled />
        </button>
      
        <div className="bg-white text-neutral-500 px-3 py-2 text-sm">
            <p>{message}</p>
        </div>
    </div>
  )
};

export default UpVoteMessage;
