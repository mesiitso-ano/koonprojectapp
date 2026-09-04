// Composant de sélection de localisation avec géolocalisation + Vue 3D
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
  const [viewMode, setViewMode] = useState<"2d" | "3d">("2d");
  const [mapStyle, setMapStyle] = useState<"standard" | "dark">("standard");

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

  // URL pour afficher la carte OpenStreetMap 2D
  const map2DUrl = latitude && longitude
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(longitude)-0.01},${parseFloat(latitude)-0.01},${parseFloat(longitude)+0.01},${parseFloat(latitude)+0.01}&layer=mapnik&marker=${latitude},${longitude}`
    : "";

  // URL pour Google Maps 3D (Earth View)
  const map3DUrl = latitude && longitude
    ? `https://www.google.com/maps/embed/v1/view?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&center=${latitude},${longitude}&zoom=18&maptype=satellite`
    : "";

  return (
    <div className="space-y-4">
      
      {/* Header avec contrôles */}
      <div className="bg-white border-2 border-gray-900 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">🗺️ Carte de localisation</h3>
          
          <div className="flex items-center gap-2">
            {/* Toggle Style Carte */}
            <button
              onClick={() => setMapStyle(mapStyle === "standard" ? "dark" : "standard")}
              className="px-3 py-1.5 border-2 border-gray-900 rounded-full text-xs font-medium hover:bg-gray-100 transition-colors"
              title="Changer le style de carte"
            >
              {mapStyle === "standard" ? "🌙 Mode sombre" : "☀️ Mode standard"}
            </button>
            
            {/* Toggle 2D/3D */}
            <button
              onClick={() => setViewMode(viewMode === "2d" ? "3d" : "2d")}
              className="px-3 py-1.5 bg-gray-900 text-white rounded-full text-xs font-bold hover:bg-gray-800 transition-colors"
            >
              {viewMode === "2d" ? "🌍 Vue 3D" : "🗺️ Vue 2D"}
            </button>
          </div>
        </div>

        {/* Bouton géolocalisation */}
        <button
          type="button"
          onClick={getCurrentLocation}
          disabled={isLocating}
          className="w-full py-3 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white rounded-full font-medium transition-colors flex items-center justify-center gap-2"
        >
          {isLocating ? (
            <>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>🔄 Localisation en cours...</span>
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
      </div>

      {error && (
        <div className="bg-red-50 border-2 border-red-500 rounded-xl p-3">
          <p className="text-sm text-red-700">⚠️ {error}</p>
        </div>
      )}

      {/* Coordonnées manuelles */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">🌐 Latitude</label>
          <input
            type="text"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            className="w-full px-4 py-3 bg-white border-2 border-gray-900 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900 font-mono"
            placeholder="48.8566"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">🌐 Longitude</label>
          <input
            type="text"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            className="w-full px-4 py-3 bg-white border-2 border-gray-900 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900 font-mono"
            placeholder="2.3522"
          />
        </div>
      </div>

      {/* Adresse décodée */}
      {address && (
        <div className="bg-gray-900 border-2 border-gray-900 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xl">📍</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-white mb-1">Adresse détectée</p>
              <p className="text-sm text-gray-300 leading-relaxed">{address}</p>
            </div>
          </div>
        </div>
      )}

      {/* Carte OpenStreetMap 2D ou 3D */}
      {(map2DUrl || map3DUrl) ? (
        <div className="bg-white border-4 border-gray-900 rounded-2xl overflow-hidden shadow-2xl">
          <div className="bg-gray-900 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <p className="text-xs text-white font-mono">
              {viewMode === "2d" ? "OpenStreetMap 2D" : "Satellite 3D"} • {latitude}, {longitude}
            </p>
          </div>
          <div className="relative h-[500px] bg-gray-100">
            {viewMode === "2d" ? (
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                src={map2DUrl}
                title="Carte 2D de localisation"
                className={mapStyle === "dark" ? "filter invert hue-rotate-180" : ""}
              />
            ) : (
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                src={`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d10000!2d${longitude}!3d${latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2s!4v1234567890`}
                title="Carte 3D Satellite"
                allowFullScreen
              />
            )}
          </div>
          <div className="bg-gray-900 px-4 py-2 flex items-center justify-between">
            <p className="text-xs text-gray-400">
              Précision: ±10m • Dernière mise à jour: maintenant
            </p>
            <p className="text-xs text-white font-bold">
              {viewMode === "2d" ? "📍 Plan" : "🛰️ Satellite"}
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white border-4 border-gray-900 rounded-2xl p-8 h-[500px] flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-100 border-4 border-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-lg font-bold text-gray-900 mb-2">Carte non disponible</p>
            <p className="text-sm text-gray-600">
              Activez votre localisation ou entrez les coordonnées<br />
              pour afficher la carte {viewMode === "2d" ? "2D" : "3D"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
