/*"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import ReactDOM from "react-dom/client";
import UpVoteMessage from "./UpVoteMessage";
import io from "socket.io-client";
import { MessageDocument } from "@/lib/models/Message";

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

const socket = io("http://localhost:3001");

const MapComponent = () => {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  // 🔹 Reusable marker creator
  const addMarkerToMap = (msg: Message, map: mapboxgl.Map) => {
    const { lat, lng } = msg.location;

    const el = document.createElement("div");
    el.className = "custom-map-marker inline-block";
    el.style.opacity = "0";
    el.style.transition = "opacity 2s ease-in-out";
    setTimeout(() => (el.style.opacity = "1"), 100);

    const wrapper = document.createElement("div");
    wrapper.className = "relative flex items-center";

    const divContent = document.createElement("div");
    divContent.className =
      "absolute left-full text-neutral-500 px-2 py-1 rounded-full text-sm hidden bg-white shadow";
    divContent.style.transition = "opacity 0.1s ease-in-out";

    const root = ReactDOM.createRoot(divContent);
    root.render(
      <UpVoteMessage
        message={msg.message}
        voteCount={msg.upvotes}
        id={msg._id}
      />
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
      divContent.style.opacity = "1";
    });

    wrapper.addEventListener("mouseleave", () => {
      divContent.style.opacity = "0";
      setTimeout(() => divContent.classList.add("hidden"), 200);
    });
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
      center: [112, -44],
      zoom: 1.1,
      antialias: true,
      maxZoom: 20,
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
      const points: Message[] = await getAllMessages();
      points.forEach((msg) => addMarkerToMap(msg, mapRef.current!));

      // 🔹 Add socket listener AFTER map loads
      socket.on("newMessage", (msg: Message) => {
        console.log("📩 New message received:", msg);
        addMarkerToMap(msg, mapRef.current!);
      });
    });

    return () => {
      map.off("load", applySpace);
      map.off("style.load", applySpace);
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
      socket.off("newMessage");
    };
  }, []);

  const getAllMessages = async (): Promise<Message[]> => {
    try {
      const response = await fetch("/api/messages");
      const { messages } = await response.json();
      return messages.map((msg: Message) => {
        const jitter = 0.00015;
        return {
          ...msg,
          location: {
            lat: msg.location.lat + (Math.random() - 0.5) * jitter,
            lng: msg.location.lng + (Math.random() - 0.5) * jitter,
          },
        };
      });
    } catch {
      console.log("Error fetching messages");
      return [];
    }
  };

  return <div ref={ref} className="w-full h-full" />;
};

export default MapComponent;
*/
"use client";

import { useEffect, useRef, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import ReactDOM from "react-dom/client";
import UpVoteMessage from "./UpVoteMessage";
import io from "socket.io-client";
import { MessageDocument } from "@/lib/models/Message";

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
  //const socketRef = useRef<any>(null);
  //const socketRef = useRef<Socket | null>(null);
  const socketRef = useRef<ReturnType<typeof io> | null>(null);


  // 🔹 Reusable marker creator
  const addMarkerToMap = useCallback((msg: Message, map: mapboxgl.Map) => {
    const { lat, lng } = msg.location;

    const el = document.createElement("div");
    el.className = "custom-map-marker inline-block";
    el.style.opacity = "0";
    el.style.transition = "opacity 2s ease-in-out";
    setTimeout(() => (el.style.opacity = "1"), 100);

    const wrapper = document.createElement("div");
    wrapper.className = "relative flex items-center";

    const divContent = document.createElement("div");
    divContent.className =
      "absolute left-full text-neutral-500 px-2 py-1 rounded-full text-sm hidden bg-white shadow";
    divContent.style.transition = "opacity 0.1s ease-in-out";

    const root = ReactDOM.createRoot(divContent);
    root.render(
      <UpVoteMessage
        message={msg.message}
        voteCount={msg.upvotes}
        id={msg._id}
      />
    );

    const iconContent = document.createElement("div");
    iconContent.className =
      "w-8 h-8 bg-white border rounded-full flex items-center justify-center cursor-pointer text-xl";
    iconContent.innerText = msg.emoji || "📍";

    wrapper.appendChild(iconContent);
    wrapper.appendChild(divContent);
    el.appendChild(wrapper);

    const marker = new mapboxgl.Marker(el).setLngLat([lng, lat]).addTo(map);
    markersRef.current.push(marker);

    wrapper.addEventListener("mouseenter", () => {
      divContent.classList.remove("hidden");
      divContent.style.opacity = "1";
    });

    wrapper.addEventListener("mouseleave", () => {
      divContent.style.opacity = "0";
      setTimeout(() => divContent.classList.add("hidden"), 200);
    });

    console.log(`✅ Added marker at [${lng}, ${lat}] with emoji: ${msg.emoji}`);
  }, []);

  const getAllMessages = async (): Promise<Message[]> => {
    try {
      const response = await fetch("/api/messages");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const { messages } = await response.json();
      return messages.map((msg: Message) => {
        const jitter = 0.00015;
        return {
          ...msg,
          location: {
            lat: msg.location.lat + (Math.random() - 0.5) * jitter,
            lng: msg.location.lng + (Math.random() - 0.5) * jitter,
          },
        };
      });
    } catch (error) {
      console.error("Error fetching messages:", error);
      return [];
    }
  };

  useEffect(() => {
    if (!ref.current || mapRef.current) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) {
      console.error("Missing NEXT_PUBLIC_MAPBOX_TOKEN");
      return;
    }
    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: ref.current,
      style: "mapbox://styles/mapbox/light-v11",
      projection: "globe",
      center: [112, -44],
      zoom: 1.1,
      antialias: true,
      maxZoom: 20,
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

    // 🔹 Initialize socket connection
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:3001", {
        transports: ['websocket', 'polling'],
        autoConnect: true,
      });

      socketRef.current.on('connect', () => {
        console.log('🔌 Socket connected');
      });

      socketRef.current.on('disconnect', () => {
        console.log('🔌 Socket disconnected');
      });
    }

    // 🔹 Handle new messages from socket
    const handleNewMessage = (msg: Message) => {
      console.log("📩 New message received:", msg);
      if (mapRef.current && mapRef.current.loaded()) {
        addMarkerToMap(msg, mapRef.current);
      } else {
        console.warn("Map not ready, queuing message");
        // Optionally queue the message to add when map loads
      }
    };

    map.on("load", async () => {
      console.log("🗺️ Map loaded, fetching initial messages...");
      const points: Message[] = await getAllMessages();
      console.log(`📍 Adding ${points.length} initial markers`);
      
      points.forEach((msg) => addMarkerToMap(msg, mapRef.current!));

      // 🔹 Add socket listener AFTER map loads
      if (socketRef.current) {
        socketRef.current.on("newMessage", handleNewMessage);
        console.log("👂 Socket listener attached for newMessage");
      }
    });

    return () => {
      console.log("🧹 Cleaning up MapComponent...");
      
      map.off("load", applySpace);
      map.off("style.load", applySpace);
      
      // Clean up markers
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      
      // Clean up socket listener for this specific handler
      if (socketRef.current) {
        socketRef.current.off("newMessage", handleNewMessage);
      }
      
      map.remove();
      mapRef.current = null;
    };
  }, [addMarkerToMap]);

  // 🔹 Cleanup socket on component unmount
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        console.log("🔌 Disconnecting socket...");
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  return <div ref={ref} className="w-full h-full" />;
};

export default MapComponent;