"use client";

import React, { useState } from "react";
import { ArrowBigDown, ArrowBigUp, ArrowRight, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface UpVoteMessageProps {
  message: string;
  voteCount: number;
}

const UpVoteMessage: React.FC<UpVoteMessageProps> = ({ message, voteCount }) => {
  
  return (
    <div className="absolute flex flex-row gap-x-2 w-max">
        <button className="bg-white text-neutral-500 p-1.5 rounded-2xl hover:bg-green-400">
            <ArrowBigUp />
        </button>

        <p className="bg-white text-neutral-500 px-3 py-2 rounded-2xl shadow text-sm"> {voteCount}</p>

        <button className="bg-white text-neutral-500 p-1.5 rounded-2xl hover:hover:bg-red-400">
            <ArrowBigDown />
        </button>
      
        <div className="bg-white text-neutral-500 px-3 py-2 rounded-xl shadow text-sm">
            <p>{message}</p>
        </div>
    </div>
  )
};

export default UpVoteMessage;
