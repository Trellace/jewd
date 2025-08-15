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
    isPreview: boolean
}

const MapComponent = ({isPreview}: MapRenderProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const movingObjects: MovingObject[] = [
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

    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [133.7751, -25.2744], // Australia (lng, lat)
      zoom: 4,
      maxZoom: 15,
      
    });

    //mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Example: add markers for movingObjects
    // movingObjects.forEach(obj => {
    //   new mapboxgl.Marker().setLngLat(obj.coordinates).setPopup(
    //     new mapboxgl.Popup({ offset: 24 }).setText(obj.name)
    //   ).addTo(mapRef.current!);
    // });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // Friendly placeholder if token missing so the page doesn’t crash
  if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gray-100">
        <p className="text-sm text-gray-600">
          Set <code>NEXT_PUBLIC_MAPBOX_TOKEN</code> in <code>.env.local</code> and restart dev server.
        </p>
      </div>
    );
  }

  return <div ref={mapContainer} className="w-full h-full -z-10" />;
};

export default MapComponent;
