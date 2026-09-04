// Composant de sélection de localisation avec géolocalisation 3D
import { useState, useEffect } from "react";
import DraggableMap from "./DraggableMap";

interface LocationPickerProps {
  onLocationChange: (lat: number, lng: number, address: string) => void;
  initialLat?: string;
  initialLng?: string;
}

export default function LocationPicker({ onLocationChange, initialLat, initialLng }: LocationPickerProps) {
  const [latitude, setLatitude] = useState(initialLat || "");
  const [longitude, setLongitude] = useState(initialLng || "");
  const [address, setAddress] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState("");

  // Fonction pour obtenir la position actuelle
  const getCurrentLocation = () => {
    setIsLocating(true);
    setError("");

    if (!navigator.geolocation) {
      setError("❌ Géolocalisation non supportée");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude.toFixed(8); // Précision maximale 8 décimales (~1mm)
        const lng = position.coords.longitude.toFixed(8);
        
        setLatitude(lat);
        setLongitude(lng);
        
        // Géocodage inversé pour obtenir l'adresse
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
            {
              headers: {
                'User-Agent': 'Koon App'
              }
            }
          );
          const data = await response.json();
          const fullAddress = data.display_name || `${lat}, ${lng}`;
          setAddress(fullAddress);
          
          onLocationChange(parseFloat(lat), parseFloat(lng), fullAddress);
        } catch (err) {
          console.error("Erreur géocodage:", err);
          setAddress(`${lat}, ${lng}`);
          onLocationChange(parseFloat(lat), parseFloat(lng), `${lat}, ${lng}`);
        }
        
        setIsLocating(false);
      },
      (error) => {
        setError(`⚠️ ${error.message}`);
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,      // Précision maximale (GPS + WiFi + cellulaire)
        timeout: 30000,                 // Timeout 30s pour laisser le temps au GPS
        maximumAge: 0                   // Aucune mise en cache, toujours une nouvelle position
      }
    );
  };

  // Mettre à jour quand les coordonnées changent
  useEffect(() => {
    if (latitude && longitude) {
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        onLocationChange(lat, lng, address || `${lat}, ${lng}`);
      }
    }
  }, [latitude, longitude]);

  return (
    <div className="space-y-4">
      
      {/* Header contrôles */}
      <div className="bg-white border-2 border-gray-900 rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">
            🗺️ Localisation
          </h3>
        </div>

        {/* Bouton géolocalisation */}
        <button
          type="button"
          onClick={getCurrentLocation}
          disabled={isLocating}
          className="w-full mt-4 py-3 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white rounded-full font-bold transition-colors flex items-center justify-center gap-3"
        >
          {isLocating ? (
            <>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              🔄
            </>
          ) : (
            <>
              📍 Activer
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-2 border-red-500 rounded-xl p-3 text-center">
          <p className="text-sm text-red-700 font-medium">{error}</p>
        </div>
      )}

      {/* Coordonnées manuelles */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">
            Latitude
          </label>
          <input
            type="text"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            className="w-full px-4 py-3 bg-white border-2 border-gray-900 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900 font-mono text-center"
            placeholder="48.8566"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">
            Longitude
          </label>
          <input
            type="text"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            className="w-full px-4 py-3 bg-white border-2 border-gray-900 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900 font-mono text-center"
            placeholder="2.3522"
          />
        </div>
      </div>

      {/* Adresse détectée */}
      {address && (
        <div className="bg-gray-900 border-2 border-gray-900 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0 text-xl">
              📍
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-400 mb-1">Adresse</p>
              <p className="text-sm text-white leading-relaxed">{address}</p>
            </div>
          </div>
        </div>
      )}

      {/* Carte 3D Satellite avec marker déplaçable */}
      {latitude && longitude ? (
        <div className="bg-white border-2 border-gray-900 rounded-2xl overflow-hidden">
          <DraggableMap
            latitude={latitude}
            longitude={longitude}
            onPositionChange={(lat, lng) => {
              setLatitude(lat.toFixed(8));
              setLongitude(lng.toFixed(8));
            }}
          />
        </div>
      ) : (
        <div className="bg-white border-2 border-gray-900 rounded-2xl p-8 h-[500px] flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-100 border-4 border-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 text-5xl">
              🌍
            </div>
            <p className="text-lg font-bold text-gray-900 mb-2">Carte non disponible</p>
            <p className="text-sm text-gray-600">
              Activez votre localisation
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
