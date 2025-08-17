'use client';

import { ArrowRight, LoaderCircle, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useUser } from "@/contexts/userContext";
import { useState, useEffect } from "react";

export const MessagePanel = () => {
  const { user, setUser } = useUser();
  const [message, setMessage] = useState("");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUserLocation();
  }, []);

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

        console.log("New location:" + newLocation);

        setLocation(newLocation);

        if (user && setUser) {
          setUser({ ...user, location: newLocation });
        }       

        setError(null);
      },
      (err) => setError(err.message),
      { enableHighAccuracy: true }
    );
  };

  const handleSend = async () => {
    if (loading) return;

    setLoading(true);
    
    if (message == '' || message == null || message.length > 50 || location == null) return;
    
    try {
      const data = {message: message, location: location, emoji: user?.emoji}
      
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      console.log(response.json);
    } catch {
      console.error("Error sending message");
    }
    setMessage(""); // clear input after sending
    setLoading(false);
  };
  
  return (
    <div className="absolute left-0 right-0 md:mx-auto sm:w-full sm:mx-2 md:w-1/2 bottom-10 flex items-center shadow-md bg-white border border-gray-200 rounded-3xl h-14 p-2">
      <div className="flex-1 flex flex-row justify-center items-center">
        <Input
          placeholder="Dox a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border-none focus:ring-0 focus:outline-none shadow-none hover:bg-neutral-100"
          />
        {/* Character counter */}
        <span className="text-xs text-gray-400 text-nowrap text-right ml-2">
          {message.length} / 50
        </span>
      </div>

      <Button
        disabled={!!error || message === "" || message.length > 50 || loading}
        onClick={handleSend}
        className="ml-4 p-2 bg-purple-500 rounded-xl hover:scale-110 shadow-md duration-200 transition-all hover:bg-purple-400 cursor-pointer"
      >
        {!loading ? <ArrowRight size={30} /> : <LoaderCircle className="animate-spin text-white"/>}
      </Button>

      <Button
        variant={"ghost"}
        aria-label="Recenter Location"
        onClick={() => {
                  // toggle if no detail provided
                  window.dispatchEvent(
                    new CustomEvent("doxxed:recenterMap", {
                      detail: { coordinates: [location?.lng, location?.lat] } // [lng, lat]
                    })
                  );

                }}
        className="ml-2 p-2 hover:scale-110 text-neutral-400 duration-200 transition-all cursor-pointer"
      >
        <MapPin size={30} />
      </Button>
      
      <div className="absolute top-16 w-full justify-center flex">
        {error ? <h3 className="text-sm text-red-500">{error}</h3> : <h3 className="text-sm text-neutral-500">Reload page to see updates</h3>}
      </div>
    </div>
  );
};