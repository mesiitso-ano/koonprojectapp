// Composant Toggle Switch pour activer/désactiver des fonctionnalités
import { useState } from "react";

interface ToggleSwitchProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export default function ToggleSwitch({ enabled, onToggle, label, disabled = false }: ToggleSwitchProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (!disabled) {
      onToggle(!enabled);
    }
  };

  return (
    <div className="flex items-center justify-between gap-4">
      {label && (
        <span className={`text-sm font-medium ${disabled ? "text-gray-500" : "text-gray-900"}`}>
          {label}
        </span>
      )}
      
      <button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        disabled={disabled}
        className={`relative w-20 h-10 rounded-full border-2 border-black transition-all duration-300 ${
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        } ${isHovered && !disabled ? "scale-105" : ""}`}
        style={{
          backgroundColor: "white"
        }}
      >
        {/* Cercle qui glisse */}
        <div
          className="absolute top-1 w-7 h-7 bg-black rounded-full transition-all duration-300 ease-in-out"
          style={{
            left: enabled ? "calc(100% - 32px)" : "4px"
          }}
        />
        
        {/* Indicateur coloré (rouge OFF / vert ON) */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full transition-all duration-300"
          style={{
            backgroundColor: enabled ? "#10b981" : "#ef4444",
            right: enabled ? "6px" : "auto",
            left: enabled ? "auto" : "6px",
            opacity: 0.8
          }}
        />
      </button>
    </div>
  );
}
