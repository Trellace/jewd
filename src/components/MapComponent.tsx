// src/components/MapComponent.tsx
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

    const isInViewPort = (lngLat: mapboxgl.LngLat, bufferPx = 100) => {
      const point = map.project(lngLat);
      const canvas = map.getCanvas();
      const bounds = {
        left: -bufferPx,
        top: -bufferPx,
        right: canvas.width + bufferPx,
        bottom: canvas.height + bufferPx
      };

      return point.x >= bounds.left &&
             point.x <= bounds.right &&
             point.y >= bounds.top && 
             point.y <= bounds.bottom;
    };

    const updateMarkerVisibility = () => {
      markersRef.current.forEach((marker) => {
        const element = marker.getElement();
        const lngLat = marker.getLngLat();
        const inViewport = isInViewPort(lngLat);
        
        if (inViewport) {
          // Fade in
          element.style.opacity = '1';
          element.style.transform = 'scale(1)';
          element.style.pointerEvents = 'auto';
        } else {
          // Fade out
          element.style.opacity = '0';
          element.style.transform = 'scale(0.8)';
          element.style.pointerEvents = 'none';
        }
      });
    };    

    // Only add markers after map is ready
    map.on("load", async () => {

      const points: [number, number, string, string, string, number][] = await getAllMessages();
      //console.log(points);
      points.forEach(([lat, lng, message, emoji, _id, upvotes]) => {
        // Create custom marker element
        const el = document.createElement('div');
        el.className = 'custom-map-marker relative inline-block';

        // Add smooth transition styles
        el.style.transition = 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out';
        el.style.opacity = '0'; // Start hidden
        el.style.transform = 'scale(0.8)';

        // Add the "message content to the div" content
        const divContent = document.createElement('div');
        divContent.className = 'bg-white text-neutral-500 px-3 py-2 rounded-xl shadow text-sm hidden';
        divContent.innerText = message;

        // Add the "icon" content
        const iconContent = document.createElement('div');
        iconContent.className = 'w-5 h-5';
        iconContent.style.backgroundImage = "url('https://png.pngtree.com/png-vector/20220809/ourmid/pngtree-dialogue-message-icon-3d-cute-bubble-box-png-image_6104861.png')";
        iconContent.style.backgroundSize = 'cover';
        iconContent.innerText = emoji ? emoji : ""; //Could put the emoji avatar here instead of the icon above

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

      updateMarkerVisibility();

      map.on('move', updateMarkerVisibility);
      map.on('zoom', updateMarkerVisibility);
      map.on('pitch', updateMarkerVisibility);
      map.on('rotate', updateMarkerVisibility);

      // // Fit map to points
      // const bounds = new mapboxgl.LngLatBounds();
      // points.forEach((point) => bounds.extend(point));
      // map.fitBounds(bounds, { padding: 50 });
    });

    return () => {

      if(mapRef.current) {
        map.off('move', updateMarkerVisibility);
        map.off('zoom', updateMarkerVisibility);
        map.off('pitch', updateMarkerVisibility);
        map.off('rotate', updateMarkerVisibility);
      }

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

