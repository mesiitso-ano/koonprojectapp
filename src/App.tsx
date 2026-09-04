// Composant racine — gestion du routage et de l'état global - Optimisé
import { useEffect, useMemo, useState } from "react";
import { useAppStore } from "./store/appStore";
import SetupPage from "./pages/SetupPage";
import ChatPage from "./pages/ChatPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";
import AdminUnlockLoader from "./components/AdminUnlockLoader";
import UpdateChecker from "./components/UpdateChecker";

export default function App() {
  console.log("🔄 App: Rendu du composant App");
  
  // Sélecteur optimisé - subscribe uniquement à currentPage
  const currentPage = useAppStore((state) => state.currentPage);
  const setCurrentPage = useAppStore((state) => state.setCurrentPage);
  const initializeApp = useAppStore((state) => state.initializeApp);

  // État pour l'animation de déverrouillage Admin
  const [showAdminUnlock, setShowAdminUnlock] = useState(false);

  console.log("📄 App: Current page =", currentPage);

  useEffect(() => {
    console.log("⚡ App: Initialisation de l'app...");
    initializeApp();
  }, [initializeApp]);

  // Gestion du raccourci FN + Enter pour Admin
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Si Ctrl/Cmd + Enter (simule FN + Enter)
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        console.log("🔓 Déverrouillage Admin détecté !");
        
        // Afficher l'animation
        setShowAdminUnlock(true);
        
        // Après 2s, rediriger vers AdminPage
        setTimeout(() => {
          setShowAdminUnlock(false);
          setCurrentPage("admin");
        }, 2000);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [setCurrentPage]);

  // Mémoïser le rendu des pages pour éviter re-renders inutiles
  const pageContent = useMemo(() => {
    console.log("🎨 App: Calcul du pageContent pour:", currentPage);
    if (currentPage === "setup") return <SetupPage />;
    if (currentPage === "chat") return <ChatPage />;
    if (currentPage === "profile") return <ProfilePage />;
    if (currentPage === "admin") return <AdminPage />;
    return null;
  }, [currentPage]);

  console.log("✅ App: Rendu final");

  return (
    <div className="w-full h-full">
      {pageContent}
      <UpdateChecker />
      
      {/* Animation de déverrouillage Admin */}
      {showAdminUnlock && <AdminUnlockLoader />}
    </div>
  );
}
