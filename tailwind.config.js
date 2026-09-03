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
      // Palette de couleurs personnalisée Koon - Thème professionnel blanc/noir
      colors: {
        koon: {
          // Fonds et surfaces
          50: "#FFFFFF",        // Blanc pur - fond principal
          100: "#F7F7F8",       // Gris très clair - fond secondaire
          200: "#E5E5E5",       // Gris clair - bordures
          300: "#D1D1D1",       // Gris - bordures hover
          400: "#A0A0A0",       // Gris moyen - icônes désactivées
          500: "#6B6B6B",       // Gris - texte secondaire
          600: "#4A4A4A",       // Gris foncé - texte tertiaire
          700: "#2D2D2D",       // Noir doux - boutons secondaires
          800: "#1A1A1A",       // Noir - texte principal
          900: "#000000",       // Noir pur - boutons primaires
          
          // Couleurs fonctionnelles
          success: "#10b981",   // Vert - succès et validations
          danger: "#ef4444",    // Rouge - erreurs et alertes
          warning: "#f59e0b",   // Orange - avertissements
          
          // Textes
          text: {
            primary: "#1A1A1A",
            secondary: "#6B6B6B",
            tertiary: "#A0A0A0",
          },
          
          // Bordures
          border: {
            light: "#E5E5E5",
            medium: "#D1D1D1",
            dark: "#2D2D2D",
          },
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
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        slideIn: "slideIn 0.1s ease-out",
        fadeIn: "fadeIn 0.15s ease-out",
      },
    },
  },
  plugins: [],
};
