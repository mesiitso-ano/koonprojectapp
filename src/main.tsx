// Point d'entrée React — monte l'application dans le DOM
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

console.log("🚀 Koon: Démarrage de l'application...");

try {
  const root = document.getElementById("root");
  console.log("✅ Root element trouvé:", root);
  
  ReactDOM.createRoot(root!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  
  console.log("✅ React rendu avec succès");
} catch (error) {
  console.error("❌ ERREUR lors du rendu:", error);
}
