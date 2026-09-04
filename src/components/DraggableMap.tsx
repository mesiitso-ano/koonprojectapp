// Carte Google Maps avec marker déplaçable
import { useEffect, useRef } from "react";

interface DraggableMapProps {
  latitude: string;
  longitude: string;
  onPositionChange: (lat: number, lng: number) => void;
}

export default function DraggableMap({ latitude, longitude, onPositionChange }: DraggableMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Charger l'API Google Maps dynamiquement
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8`;
      script.async = true;
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }

    function initMap() {
      if (!mapRef.current || !window.google) return;

      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);

      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat, lng },
        zoom: 18,
        mapTypeId: 'satellite',
        disableDefaultUI: false,
        zoomControl: true,
        gestureHandling: 'greedy',
      });

      const marker = new window.google.maps.Marker({
        position: { lat, lng },
        map: map,
        draggable: true,
        title: 'Déplacez-moi à votre position exacte',
      });

      // Écouter le drag du marker
      marker.addListener('dragend', () => {
        const position = marker.getPosition();
        if (position) {
          const newLat = position.lat();
          const newLng = position.lng();
          onPositionChange(newLat, newLng);
        }
      });
    }
  }, [latitude, longitude, onPositionChange]);

  return (
    <div
      ref={mapRef}
      className="w-full h-[500px] bg-gray-100 rounded-xl"
      style={{ minHeight: '500px' }}
    />
  );
}

// Déclaration TypeScript pour Google Maps
declare global {
  interface Window {
    google: any;
  }
}
