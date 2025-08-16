"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import ReactDOM from "react-dom/client";
import UpVoteMessage from "./UpVoteMessage";

import io from "socket.io-client";
const socket = io("http://localhost:3001");


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

  // useEffect(() => {
  //   socket.on("newMessage", (msg) => {
  //     setMessages((prev) => [...prev, msg]);
  //   });

  //   return () => {
  //     socket.off("newMessage");
  //   };
  // }, []);

  // // Render messages...

  useEffect(() => {
    if (!ref.current || mapRef.current) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) return console.error("Missing NEXT_PUBLIC_MAPBOX_TOKEN");
    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: ref.current,
      style: "mapbox://styles/mapbox/light-v11",
      projection: "globe",
      center: [112, -44],
      zoom: 1.1,
      antialias: true,
      maxZoom: 18,
    });
    mapRef.current = map;

    (map.getContainer() as HTMLElement).style.background = "#060814";

    const applySpace = () => {
      map.setFog?.({
        color: "#c7d2e4",
        "high-color": "#d7dfef",
        "horizon-blend": 0.02,
        "space-color": "#060814",
        "star-intensity": 0.35,
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

    map.on("load", async () => {
      const points: [number, number, string, string, string, number][] =
        await getAllMessages();

      points.forEach(([lat, lng, message, emoji, _id, upvotes]) => {
        // Main marker container
        const el = document.createElement("div");
        el.className = "custom-map-marker inline-block";

        el.style.opacity = "0";
        el.style.transition = "opacity 2s ease-in-out";
        setTimeout(() => {
          el.style.opacity = "1";
        }, 100);

        // Relative wrapper for icon + message
        const wrapper = document.createElement("div");
        wrapper.className = "relative flex items-center";

        // Message (hidden by default, appears to the right)
        const divContent = document.createElement("div");
        divContent.className =
          "absolute left-full text-neutral-500 px-2 py-1 rounded-full text-sm hidden bg-white shadow";
        divContent.style.transition = "opacity 0.2s ease-in-out";
        const root = ReactDOM.createRoot(divContent);
        root.render(
          <UpVoteMessage message={message} voteCount={upvotes} id={_id} />
        );

        // Emoji circle
        const iconContent = document.createElement("div");
        iconContent.className =
          "w-8 h-8 bg-white border rounded-full flex items-center justify-center cursor-pointer text-xl";
        iconContent.innerText = emoji ? emoji : "";

        // Append to wrapper
        wrapper.appendChild(iconContent);
        wrapper.appendChild(divContent);

        // Append wrapper to marker
        el.appendChild(wrapper);

        // Add marker to map
        const marker = new mapboxgl.Marker(el)
          .setLngLat([lng, lat])
          .addTo(map);
        markersRef.current.push(marker);

        // Hover behavior
        wrapper.addEventListener("mouseenter", () => {
          divContent.classList.remove("hidden");
          divContent.style.opacity = "1";
        });

        wrapper.addEventListener("mouseleave", () => {
          divContent.style.opacity = "0";
          setTimeout(() => divContent.classList.add("hidden"), 200);
        });
      });
    });

    return () => {
      map.off("load", applySpace);
      map.off("style.load", applySpace);
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, []);

  const getAllMessages = async () => {
    try {
      const response = await fetch("/api/messages", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const { messages } = await response.json();
      console.log(messages);

      return messages.map((msg: Message) => {
        const jitter = 0.00015;
        const noisyLat = msg.location.lat + (Math.random() - 0.5) * jitter;
        const noisyLng = msg.location.lng + (Math.random() - 0.5) * jitter;
        return [
          noisyLat,
          noisyLng,
          msg.message,
          msg.emoji,
          msg._id,
          msg.upvotes,
        ];
      });
    } catch {
      console.log("Error fetching messages");
    }
  };

  return <div ref={ref} className="w-full h-full" />;
};

export default MapComponent;