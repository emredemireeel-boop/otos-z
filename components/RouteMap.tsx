"use client";
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Props {
    from: [number, number] | null; // [lat, lon]
    to: [number, number] | null;
    routeGeometry?: [number, number][]; // decoded route coords
}

export default function RouteMap({ from, to, routeGeometry }: Props) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<L.Map | null>(null);

    useEffect(() => {
        if (!mapRef.current || !from || !to) return;

        // Haritayı oluştur veya temizle
        if (mapInstance.current) {
            mapInstance.current.remove();
            mapInstance.current = null;
        }

        const map = L.map(mapRef.current, {
            zoomControl: true,
            scrollWheelZoom: true,
            attributionControl: true,
        });
        mapInstance.current = map;

        // OpenStreetMap tile layer (tamamen ücretsiz)
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 18,
        }).addTo(map);

        // Özel marker ikonu
        const startIcon = L.divIcon({
            className: "",
            html: `<div style="width:28px;height:28px;border-radius:50%;background:#2563EB;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center"><div style="width:8px;height:8px;border-radius:50%;background:white"></div></div>`,
            iconSize: [28, 28],
            iconAnchor: [14, 14],
        });
        const endIcon = L.divIcon({
            className: "",
            html: `<div style="width:28px;height:28px;border-radius:50%;background:#ef4444;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center"><div style="width:8px;height:8px;border-radius:50%;background:white"></div></div>`,
            iconSize: [28, 28],
            iconAnchor: [14, 14],
        });

        // Tek konum mu yoksa rota m\u0131?
        const isSinglePoint = from[0] === to[0] && from[1] === to[1];

        if (isSinglePoint) {
            // Tek konum — servis/usta konumu
            const locIcon = L.divIcon({
                className: "",
                html: `<div style="width:32px;height:32px;border-radius:50%;background:#ef4444;border:3px solid white;box-shadow:0 4px 12px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center"><div style="width:10px;height:10px;border-radius:50%;background:white"></div></div>`,
                iconSize: [32, 32],
                iconAnchor: [16, 16],
            });
            L.marker(from, { icon: locIcon }).addTo(map).bindPopup("Servis Konumu").openPopup();
            map.setView(from, 16);
        } else {
            // Marker'lar
            L.marker(from, { icon: startIcon }).addTo(map).bindPopup("Kalk\u0131\u015f");
            L.marker(to, { icon: endIcon }).addTo(map).bindPopup("Var\u0131\u015f");

            // Rota \u00e7izgisi
            if (routeGeometry && routeGeometry.length > 0) {
                const routeLine = L.polyline(routeGeometry, {
                    color: "#2563EB", weight: 4, opacity: 0.8, smoothFactor: 1,
                }).addTo(map);
                map.fitBounds(routeLine.getBounds(), { padding: [40, 40] });
            } else {
                map.fitBounds(L.latLngBounds([from, to]), { padding: [40, 40] });
            }
        }

        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, [from, to, routeGeometry]);

    if (!from || !to) return null;

    return (
        <div ref={mapRef} style={{
            width: "100%", height: "340px", borderRadius: "14px",
            border: "1px solid var(--card-border)", overflow: "hidden",
        }} />
    );
}
