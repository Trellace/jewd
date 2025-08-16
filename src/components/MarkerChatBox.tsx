"use client";

import React, { useState } from "react";
import { ArrowRight, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const message : string = "";

const MarkerChatBox = () => {
  
  return (
    <div className="absolute top-0 bg-gray-100 px-3 py-3 rounded-xl">
        <div className="flex flex-col gap-2">
            <div className="text-gray-500">
                <p>Reply History:</p>
                <div className="bg-gray-200 px-1 py-1 rounded-sm text-gray-500 h-max overflow-y-scroll">
                    <p>History Here...</p>
                </div>
            </div>
            <div className="flex flex-row gap-1">
                
                <div className="flex-1 flex flex-row justify-center items-center">
                    <Input
                    placeholder="Type a message..."
                    value={message}
                    className="w-full border-none bg-gray-200 focus:ring-0 focus:outline-none shadow-none hover:bg-neutral-100"
                    />
                    {/* Character counter */}
                    <span className="text-xs text-gray-400 text-nowrap text-right ml-2">
                    {message.length} / 50
                    </span>
                </div>

                <Button
                    className="ml-4 p- flex flex-row bg-purple-500 hover:scale-110 shadow-md duration-200 transition-all hover:bg-purple-400 cursor-pointer"
                >
                    <ArrowRight size={30} />
                </Button> 

            </div>
        </div>
    </div>
  )
};

export default MarkerChatBox;
