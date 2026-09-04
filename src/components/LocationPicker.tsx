// Composant de sélection de localisation avec géolocalisation
import { useState, useEffect } from "react";

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
      setError("Géolocalisation non supportée par votre navigateur");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude.toFixed(6);
        const lng = position.coords.longitude.toFixed(6);
        
        setLatitude(lat);
        setLongitude(lng);
        
        // Géocodage inversé pour obtenir l'adresse (OpenStreetMap Nominatim)
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
        setError(`Erreur de géolocalisation: ${error.message}`);
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // Mettre à jour la carte quand les coordonnées changent
  useEffect(() => {
    if (latitude && longitude) {
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        onLocationChange(lat, lng, address || `${lat}, ${lng}`);
      }
    }
  }, [latitude, longitude]);

  // URL pour afficher la carte OpenStreetMap statique
  const mapUrl = latitude && longitude
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(longitude)-0.01},${parseFloat(latitude)-0.01},${parseFloat(longitude)+0.01},${parseFloat(latitude)+0.01}&layer=mapnik&marker=${latitude},${longitude}`
    : "";

  return (
    <div className="space-y-4">
      {/* Bouton géolocalisation */}
      <button
        type="button"
        onClick={getCurrentLocation}
        disabled={isLocating}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-full font-medium transition-colors flex items-center justify-center gap-2"
      >
        {isLocating ? (
          <>
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Localisation en cours...</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>📍 Activer ma localisation</span>
          </>
        )}
      </button>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {/* Coordonnées manuelles */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Latitude</label>
          <input
            type="text"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-900 rounded-full focus:outline-none text-gray-900"
            placeholder="48.8566"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Longitude</label>
          <input
            type="text"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-900 rounded-full focus:outline-none text-gray-900"
            placeholder="2.3522"
          />
        </div>
      </div>

      {/* Adresse décodée */}
      {address && (
        <div className="bg-blue-50 border-2 border-blue-500 rounded-xl p-4">
          <p className="text-sm font-medium text-blue-900">📍 Adresse détectée :</p>
          <p className="text-sm text-blue-700 mt-1">{address}</p>
        </div>
      )}

      {/* Carte OpenStreetMap */}
      {mapUrl ? (
        <div className="border-2 border-gray-900 rounded-2xl overflow-hidden h-96">
          <iframe
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
            src={mapUrl}
            title="Carte de localisation"
          />
        </div>
      ) : (
        <div className="bg-gray-100 border-2 border-gray-900 rounded-2xl p-4 h-96 flex items-center justify-center">
          <div className="text-center text-gray-600">
            <svg className="w-16 h-16 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-sm">Activez votre localisation ou entrez les coordonnées</p>
          </div>
        </div>
      )}
    </div>
  );
}
