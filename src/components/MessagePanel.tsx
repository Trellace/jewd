'use client';

import { ArrowRight, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { useUser } from "@/contexts/userContext";
import { useState, useEffect } from "react";
import { Tooltip } from "./ui/tooltip";
import { TooltipContent, TooltipTrigger } from "@radix-ui/react-tooltip";

export const MessagePanel = () => {
    const { user, setUser } = useUser();
    const [message, setMessage] = useState("");
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getUserLocation();
    }, [])

  // Method to get user location
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        setLocation(newLocation); // update local state

        if (user && setUser) {
          setUser({ ...user, location: newLocation }); // update user context
        }

        setError(null);
      },
      (err) => setError(err.message),
      { enableHighAccuracy: true }
    );
  };

  const handleSend = () => {
    console.log("Message:", message);
    console.log("Location:", location);
    // You can send this to your server or API here
    setMessage(""); // clear input after sending
  };

    const SendMessage = async ({ message } : { message: string }) => {
        if (user == null || message == null || message == '') return;


    }

  return (
    <div className="absolute left-0 right-0 mx-auto w-2/3 bottom-10 flex items-center shadow-md bg-white border border-gray-200 rounded-2xl h-14 p-2">
      <Input
        placeholder="Type a message..."
        className="flex-1 border-none focus:ring-0 focus:outline-none shadow-none hover:bg-neutral-100"
      />
        <Tooltip>
        <TooltipTrigger asChild>
            <Button
            disabled={!!error || message === ""}
            className="ml-2 p-2 bg-purple-500 hover:scale-110 shadow-md duration-200 transition-all hover:bg-purple-400 cursor-pointer"
            >
            <ArrowRight size={30} />
            </Button>
        </TooltipTrigger>

        {error && (
            <TooltipContent side="top">
            {error}
            </TooltipContent>
        )}
        </Tooltip>
      {/* <Separator orientation="vertical" className="ml-2"/> */}
      <Button variant={"ghost"} className="ml-2 p-2 hover:scale-110 text-neutral-200 shdow-md duration-200 transition-all cursor-pointer">
        <MapPin size={30} />
      </Button>
    </div>
  );
};