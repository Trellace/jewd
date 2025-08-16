"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import ReactDOM from "react-dom/client";
import UpVoteMessage from "./UpVoteMessage";


type Message = {
  location: {
    lat: number;
    lng: number;
  };
  message: string;
  emoji: string;
  _id: string;
  upvotes: number;
};

const MapComponent = () => {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!ref.current || mapRef.current) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) return console.error("Missing NEXT_PUBLIC_MAPBOX_TOKEN");
    mapboxgl.accessToken = token;

    // NOTE: keep LIGHT style so land/water colors stay the same
    const map = new mapboxgl.Map({
      container: ref.current,
      style: "mapbox://styles/mapbox/light-v11",
      projection: "globe",
      center: [112, -44], // Australia
      zoom: 1.1,         // zoomed out so you can see space around the globe
      antialias: true,
      maxZoom: 18,
    });
    mapRef.current = map;

    // dark fallback while loading (doesn't affect earth colors)
    (map.getContainer() as HTMLElement).style.background = "#060814";

    const applySpace = () => {
      map.setFog?.({
        color: "#c7d2e4",
        "high-color": "#d7dfef",
        "horizon-blend": 0.02,
        "space-color": "#060814", // space around earth
        "star-intensity": 0.35,   // stars on
      });
      map.setLight?.({
        anchor: "viewport",
        color: "white",
        intensity: 0.05,
        position: [1.2, 90, 80],
      });
    };

    map.on("load", applySpace);
    map.on("style.load", applySpace);

    // Only add markers after map is ready
    map.on("load", async () => {
      const points: [number, number, string, string, string, number][] = await getAllMessages();
      
      points.forEach(([lat, lng, message, emoji, _id, upvotes]) => {
        // Create custom marker element
        const el = document.createElement('div');
        el.className = 'custom-map-marker relative inline-block';

        // Simple fade in animation when marker is created
        el.style.opacity = '0';
        el.style.transition = 'opacity 2s ease-in-out';
        
        // Fade in after a short delay
        setTimeout(() => {
          el.style.opacity = '1';
        }, 100);

        // Add the "message content to the div" content
        const divContent = document.createElement('div');
        divContent.className = 'text-neutral-500 px-3 py-2 rounded-xl shadow text-sm hidden';
        divContent.style.transition = 'opacity 1s ease-in-out';
        const root = ReactDOM.createRoot(divContent);
        root.render(
          <UpVoteMessage
            message={message}
            voteCount={upvotes}
            id={_id}
          />
        );

        // Add the "icon" content
        const iconContent = document.createElement('div');
        iconContent.className = 'w-8 h-8 bg-white border rounded-full';
        // iconContent.style.backgroundImage = "url('https://png.pngtree.com/png-vector/20220809/ourmid/pngtree-dialogue-message-icon-3d-cute-bubble-box-png-image_6104861.png')";
        iconContent.style.backgroundSize = 'cover';
        iconContent.innerText = emoji ? emoji : "";

        // Append both to marker
        el.appendChild(divContent);
        el.appendChild(iconContent);

        // Add marker to map
        const marker = new mapboxgl.Marker(el).setLngLat([lng, lat]).addTo(map);
        markersRef.current.push(marker);

        // On Click Show Text For That Bubble, click again to hide
        el.addEventListener('click', () => {
          divContent.classList.toggle('hidden');
          iconContent.classList.toggle('hidden');
        });
      });
    });

    return () => {
      map.off("load", applySpace);
      map.off("style.load", applySpace);
      
      // Clean up markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];

      map.remove();
      mapRef.current = null;
    };
  }, []);

  const getAllMessages = async () => {
    try {
        const response = await fetch('/api/messages', {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            }
        });

        const { messages } = await response.json() // <---- this is the array of messages
        console.log(messages);
        
        return messages.map((msg: Message) => {
          // jitter factor ~±0.0001 degrees (~10m)
          const jitter = 0.00015; 

          const noisyLat = msg.location.lat + (Math.random() - 0.5) * jitter;
          const noisyLng = msg.location.lng + (Math.random() - 0.5) * jitter;

          return [noisyLat, noisyLng, msg.message, msg.emoji, msg._id, msg.upvotes];
        });
    } catch {
        console.log("Error fetching messages");
    }
  }

  return <div ref={ref} className="w-full h-full" />;
};

export default MapComponent;

