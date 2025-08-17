"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import ReactDOM from "react-dom/client";
import UpVoteMessage from "./UpVoteMessage";
import { MessageDocument } from "@/lib/models/Message";

type Message = {
  location: { lat: number; lng: number };
  message: string;
  emoji: string;
  _id: string;
  upvotes: number;
};

// Add near the top of MapComponent.tsx (for TypeScript friendliness)
declare global {
  interface WindowEvente{
    "doxxed:toggleSatellite": CustomEvent<{ on?: boolean }>;
    "doxxed:recenterMap": CustomEvent<{ on?: boolean }>
  }
}
const MapComponent = () => {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [satellite, setSatellite] = useState(false);

  const addMarkerToMap = (msg: Message, map: mapboxgl.Map) => {
    const { lat, lng } = msg.location;
    const el = document.createElement("div");
    el.className = "custom-map-marker inline-block overflow-visible";
    el.style.opacity = "0";
    el.style.transition = "opacity 0.5s ease-in-out";
    setTimeout(() => (el.style.opacity = "1"), 50);

    const wrapper = document.createElement("div");
    wrapper.className = "relative flex items-center overflow-visible cursor-pointer";

    const divContent = document.createElement("div");
    divContent.className =
      "absolute text-neutral-500 rounded-full z-[9999] text-sm hidden bg-white shadow pointer-events-auto";
    const root = ReactDOM.createRoot(divContent);
    root.render(
      <UpVoteMessage message={msg.message} voteCount={msg.upvotes} id={msg._id} />
    );

    const iconContent = document.createElement("div");
    iconContent.className =
      "w-8 h-8 bg-white border rounded-full flex items-center justify-center cursor-pointer text-xl";
    iconContent.innerText = msg.emoji || "";

    wrapper.appendChild(iconContent);
    wrapper.appendChild(divContent);
    el.appendChild(wrapper);

    const marker = new mapboxgl.Marker(el).setLngLat([lng, lat]).addTo(map);
    markersRef.current.push(marker);

    wrapper.addEventListener("mouseenter", () => {
      divContent.classList.remove("hidden");
    });
    wrapper.addEventListener("mouseleave", () => {
      divContent.classList.add("hidden");
    });
  };

  // listen for header toggle events - satellite toggle
  useEffect(() => {
    // satellite toggle handler
    const handleToggleSatellite = (e: Event) => {
      const ev = e as CustomEvent<{ on?: boolean }>;
      setSatellite(prev =>
        typeof ev.detail?.on === "boolean" ? ev.detail.on : !prev
      );
    };

    // recenter map handler
    const handleRecenterMap = (e: Event) => {
      const ev = e as CustomEvent<{ coordinates: [number, number] }>;
      if (ev.detail?.coordinates && mapRef.current) {
        console.log("Recentering map to:", ev.detail.coordinates);
        mapRef.current.flyTo({
          center: ev.detail.coordinates, // [lng, lat]
          zoom: 8,
          speed: 1.2,
          curve: 1.4,
          essential: true                // respects prefers-reduced-motion
        });
      }
    };

    window.addEventListener("doxxed:toggleSatellite", handleToggleSatellite);
    window.addEventListener("doxxed:recenterMap", handleRecenterMap);

    return () => {
      window.removeEventListener("doxxed:toggleSatellite", handleToggleSatellite);
      window.removeEventListener("doxxed:recenterMap", handleRecenterMap);
    };
  }, []);


  const applySpace = (map: mapboxgl.Map) => {
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
    (map.getContainer() as HTMLElement).style.background = "#060814";
  };

  useEffect(() => {
    if (!ref.current || mapRef.current) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) return console.error("Missing NEXT_PUBLIC_MAPBOX_TOKEN");
    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: ref.current,
      style: "mapbox://styles/mapbox/light-v11",
      projection: "globe",
      center: [133.7751, -28.2744],
      zoom: 3.5,
      antialias: true,
      maxZoom: 20,
    });
    mapRef.current = map;

    map.on("load", () => {
      applySpace(map);
      getAllMessages().then((points) =>
        points.forEach((msg) => addMarkerToMap(msg, map))
      );
    });

    // also reapply globe settings on style change
    map.on("style.load", () => applySpace(map));

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // watch satellite toggle
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const style = satellite
      ? "mapbox://styles/mapbox/satellite-streets-v12"
      : "mapbox://styles/mapbox/light-v11";

    map.setStyle(style);
  }, [satellite]);

  const getAllMessages = async (): Promise<Message[]> => {
    try {
      const response = await fetch("/api/messages");
      const { messages } = await response.json();
      const jitter = 0.00015;
      return messages.map((msg: Message) => ({
        ...msg,
        location: {
          lat: msg.location.lat + (Math.random() - 0.5) * jitter,
          lng: msg.location.lng + (Math.random() - 0.5) * jitter,
        },
      }));
    } catch {
      console.log("Error fetching messages");
      return [];
    }
  };

  return <div ref={ref} className="w-full h-full" />
};

export default MapComponent;
