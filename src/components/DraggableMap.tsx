// Carte interactive 2D avec marker déplaçable - OpenStreetMap
import { useEffect, useRef, useState } from "react";

interface DraggableMapProps {
  latitude: string;
  longitude: string;
  onPositionChange: (lat: number, lng: number) => void;
}

export default function DraggableMap({ latitude, longitude, onPositionChange }: DraggableMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // Charger Leaflet CSS
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    // Charger Leaflet JS
    if (!window.L) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => setMapLoaded(true);
      document.head.appendChild(script);
    } else {
      setMapLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!mapLoaded || !mapContainerRef.current || !window.L) return;

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    // Créer la carte
    const map = window.L.map(mapContainerRef.current, {
      center: [lat, lng],
      zoom: 18,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    // Couche OpenStreetMap standard
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 19,
    }).addTo(map);

    // Marker rouge personnalisé
    const redIcon = window.L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    // Créer marker draggable
    const marker = window.L.marker([lat, lng], {
      draggable: true,
      icon: redIcon,
      title: '🎯 Glissez-moi sur votre position exacte',
    }).addTo(map);

    // Popup
    marker.bindPopup('🎯 Glissez-moi !').openPopup();

    // Event drag
    marker.on('dragend', () => {
      const position = marker.getLatLng();
      onPositionChange(position.lat, position.lng);
    });

    // Cleanup
    return () => {
      map.remove();
    };
  }, [mapLoaded, latitude, longitude, onPositionChange]);

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-[500px] bg-gray-100"
      style={{ minHeight: '500px' }}
    />
  );
}

// Déclaration TypeScript
declare global {
  interface Window {
    L: any;
  }
}
