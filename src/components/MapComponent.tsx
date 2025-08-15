// src/components/MapComponent.tsx
"use client";

import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface MovingObject {
  id: number;
  name: string;
  coordinates: [number, number]; // [lng, lat]
}

interface MapRenderProps {
  isPreview?: boolean;
}

const MapComponent = ({ isPreview = false }: MapRenderProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const movingObjects: MovingObject[] = [
    // Example:
    // { id: 1, name: "Example", coordinates: [144.9631, -37.8136] }, // Melbourne
  ];

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) {
      console.error("Missing NEXT_PUBLIC_MAPBOX_TOKEN in .env.local");
      return;
    }
    
    if (!mapContainer.current || mapRef.current) return; // init once

    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [133.7751, -25.2744], // Australia
      zoom: 4,
      maxZoom: 15,
    });

    map.addControl(new mapboxgl.NavigationControl(), "bottom-right");

    // Example Points
    const points: [number, number][] = [
      [134.58478, -25.30149],   // Base point
    ];

    // Only add markers after map is ready
    map.on("load", () => {
      points.forEach(([lng, lat]) => {
        // Create custom marker element
        const el = document.createElement('div');
        el.className = 'custom-map-marker inline-block transform origin-bottom-center';

        // Add inner HTML for popup/content
        el.innerHTML = `
          <div class="h-fit bg-purple-700 text-white px-2 py-3 rounded-lg shadow-lg text-sm leading-tight">
            <strong class="block text-base">📍{ date/time }</strong>
            <p class="mt-1">Custom details here Custom details here Custom details here Custom details here</p>
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
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return <div ref={mapContainer} className="w-full h-full" />;
};

export default MapComponent;
