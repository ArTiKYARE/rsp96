"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

const OFFICE_COORDS: [number, number] = [56.8274836, 60.5814572];

const markerSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path fill="#386eb6" stroke="#386eb6" d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
  <circle cx="12" cy="10" r="3" fill="#ffffff" stroke="#ffffff"/>
</svg>
`;

export function MapSection() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    let mapInstance: ReturnType<typeof import("leaflet").map> | null = null;

    import("leaflet").then((L) => {
      if (!mapRef.current) return;

      mapInstance = L.map(mapRef.current).setView(OFFICE_COORDS, 16);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
      }).addTo(mapInstance);

      const icon = L.divIcon({
        className: "custom-map-marker",
        html: markerSvg,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

      L.marker(OFFICE_COORDS, { icon })
        .addTo(mapInstance)
        .bindPopup("ООО «РемСтройПроект»<br>ул. Радищева, 55, офис 6")
        .openPopup();
    });

    return () => {
      mapInstance?.remove();
    };
  }, []);

  return (
    <div
      ref={mapRef}
      className="w-full h-[400px] rounded-3xl overflow-hidden shadow-xl bg-muted"
    />
  );
}
