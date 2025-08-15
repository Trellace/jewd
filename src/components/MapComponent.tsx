// src/components/MapComponent.tsx
"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MapComponent = () => {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

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
      center: [0, 10],
      zoom: 1.1,         // zoomed out so you can see space around the globe
      antialias: true,
      maxZoom: 15,
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

    // const points: [number, number][] = getAllMessages();

    // Only add markers after map is ready
    map.on("load", async () => {
      const points: [number, number, string][] = await getAllMessages();
      //console.log(points);
      points.forEach(([lat, lng, message]) => {
        // Create custom marker element
        const el = document.createElement('div');
        el.className = 'custom-map-marker inline-block transform origin-bottom-center';

        // Add inner HTML for popup/content
        el.innerHTML = `
          <div class=" bg-white text-neutral-500 px-2 py-1 rounded-lg shadow-sm text-sm leading-tight">
            <strong class="block text-base">📍${message}</strong>
            <p class="mt-1"></p>
          </div>
        `;

        // Add marker to map
        const marker = new mapboxgl.Marker(el).setLngLat([lng, lat]).addTo(map);

        // Shrink or grow marker based on zoom
        map.on('zoom', () => {
          const zoom = map.getZoom();
          const scale = zoom < 10 ? 0.5 : 1; // shrink if zoom < 10
          el.style.transform = `scale(${scale})`;
        });
      });

      // // Fit map to points
      // const bounds = new mapboxgl.LngLatBounds();
      // points.forEach((point) => bounds.extend(point));
      // map.fitBounds(bounds, { padding: 50 });
    });

    return () => {
      map.off("load", applySpace);
      map.off("style.load", applySpace);
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

        return messages.map((msg: any) => [
          msg.location.lat,
          msg.location.lng,
          msg.message
        ]);
    } catch {
        console.log("Error fetching messages");
    }
  }

  return <div ref={ref} className="w-full h-full" />;
};

export default MapComponent;

