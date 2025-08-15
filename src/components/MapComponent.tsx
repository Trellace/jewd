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

    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    // // Example Points
    // const points: [number, number][] = [
    //   [134.58478, -25.30149],   // Base point
    //   [134.59012, -25.29875],   // ~0.5 km northeast
    //   [134.57934, -25.30512],   // ~0.6 km southwest
    // ];

    // // Only add markers after map is ready
    // map.on("load", () => {
    //   points.forEach(([lng, lat]) => {
    //     //add custom make maker to each maker
    //     const el = document.createElement('div');
    //     el.className = 'custom-map-marker';
    //     //create new marker on map with custom maker passed in
    //     new mapboxgl.Marker(el).setLngLat([lng, lat]).addTo(map);
    //   });

    //   // Fit map to points
    //   const bounds = new mapboxgl.LngLatBounds();
    //   points.forEach((point) => bounds.extend(point));
    //   map.fitBounds(bounds, { padding: 50 });
    // });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return <div ref={mapContainer} className="w-full h-full" />;
};

export default MapComponent;
