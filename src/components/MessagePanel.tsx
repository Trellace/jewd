'use client';

import { ArrowRight, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { useUser } from "@/contexts/userContext";
import { useState } from "react";

export const MessagePanel = () => {
    const { user } = useUser();
    const [message, setMessage] = useState("");
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [error, setError] = useState<string | null>(null);

  // Method to get user location
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setError(null);
      },
      (err) => {
        setError(err.message);
      },
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
    <div className="absolute left-0 right-0 mx-auto w-2/3 bottom-10 flex items-center bg-white border border-gray-200 rounded-2xl h-14 p-2">
      <Input
        placeholder="Type a message..."
        className="flex-1 border-none focus:ring-0 focus:outline-none shadow-none"
      />
      <Separator orientation="vertical" className="ml-2"/>
      <Button variant={"ghost"} className="ml-2 p-2 hover:scale-110 shdow-md duration-200 transition-all cursor-pointer">
        <MapPin size={30} />
      </Button>
      <Button className="ml-2 p-2 bg-purple-500 hover:scale-110 shdow-md duration-200 transition-all hover:bg-purple-400 cursor-pointer">
        <ArrowRight size={30} />
      </Button>
    </div>
  );
};