// Configuration Tailwind CSS — définit le thème visuel de Koon
/** @type {import('tailwindcss').Config} */
export default {
  // Analyse uniquement les fichiers du projet pour générer uniquement les classes utilisées
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // Suit le mode sombre du système d'exploitation
  darkMode: "class",
  theme: {
    extend: {
      // Palette de couleurs personnalisée Koon
      colors: {
        // Fond principal sombre
        koon: {
          950: "#0a0a0f",
          900: "#0f0f1a",
          800: "#1a1a2e",
          700: "#16213e",
          600: "#0f3460",
          accent: "#6c63ff",    // Violet — couleur d'accentuation principale
          accent2: "#a78bfa",   // Violet clair — hover et états actifs
          success: "#10b981",   // Vert — message envoyé avec succès
          danger: "#ef4444",    // Rouge — erreurs et alertes
          muted: "#6b7280",     // Gris — texte secondaire
        },
      },
      // Police d'interface — Inter pour la lisibilité
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      // Animation d'apparition des messages
      keyframes: {
        slideIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        slideIn: "slideIn 0.15s ease-out",
        fadeIn: "fadeIn 0.2s ease-out",
      },
    },
  },
  plugins: [],
};
