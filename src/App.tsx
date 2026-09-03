// Composant racine — gestion du routage et de l'état global - Optimisé
import { useEffect, useMemo } from "react";
import { useAppStore } from "./store/appStore";
import SetupPage from "./pages/SetupPage";
import ChatPage from "./pages/ChatPage";
import UpdateChecker from "./components/UpdateChecker";

export default function App() {
  console.log("🔄 App: Rendu du composant App");
  
  // Sélecteur optimisé - subscribe uniquement à currentPage
  const currentPage = useAppStore((state) => state.currentPage);
  const initializeApp = useAppStore((state) => state.initializeApp);

  console.log("📄 App: Current page =", currentPage);

  useEffect(() => {
    console.log("⚡ App: Initialisation de l'app...");
    initializeApp();
  }, [initializeApp]);

  // Mémoïser le rendu des pages pour éviter re-renders inutiles
  const pageContent = useMemo(() => {
    console.log("🎨 App: Calcul du pageContent pour:", currentPage);
    if (currentPage === "setup") return <SetupPage />;
    if (currentPage === "chat") return <ChatPage />;
    return null;
  }, [currentPage]);

  console.log("✅ App: Rendu final");

  return (
    <div className="w-full h-full">
      {pageContent}
      <UpdateChecker />
    </div>
  );
}
