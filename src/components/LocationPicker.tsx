// Composant de sélection de localisation avec géolocalisation 3D
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
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            🌍 Localisation 3D
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
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
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
          <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
            </svg>
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
          <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
            </svg>
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
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-400 mb-1">📍 Adresse</p>
              <p className="text-sm text-white leading-relaxed">{address}</p>
            </div>
          </div>
        </div>
      )}

      {/* Carte 3D Satellite uniquement */}
      {latitude && longitude ? (
        <div className="bg-white border-4 border-gray-900 rounded-2xl overflow-hidden shadow-2xl">
          {/* Header style macOS */}
          <div className="bg-gray-900 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs text-white font-mono">
                {latitude}, {longitude}
              </p>
            </div>
          </div>
          
          {/* Carte 3D Google Maps Satellite */}
          <div className="relative h-[500px] bg-gray-100">
            <iframe
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              src={`https://maps.google.com/maps?q=${latitude},${longitude}&z=18&t=k&output=embed&gestureHandling=greedy`}
              title="🛰️ Carte 3D Satellite"
              allowFullScreen
              style={{ border: 0 }}
            />
          </div>
          
          {/* Footer */}
          <div className="bg-gray-900 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs text-gray-400">🎯 GPS haute précision</p>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
              <p className="text-xs text-white font-bold">🛰️ Satellite 3D</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white border-4 border-gray-900 rounded-2xl p-8 h-[500px] flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-100 border-4 border-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-lg font-bold text-gray-900 mb-2">🌍</p>
            <p className="text-sm text-gray-600">
              📍 Activez votre localisation
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
