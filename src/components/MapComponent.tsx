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

    //mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Example: add markers for movingObjects
    // movingObjects.forEach(obj => {
    //   new mapboxgl.Marker().setLngLat(obj.coordinates).setPopup(
    //     new mapboxgl.Popup({ offset: 24 }).setText(obj.name)
    //   ).addTo(mapRef.current!);
    // });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return <div ref={mapContainer} className="w-full h-full" />;
};

export default MapComponent;
