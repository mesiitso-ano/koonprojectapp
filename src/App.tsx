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

  // Gestion du double Ctrl pour Admin
  useEffect(() => {
    let ctrlPressCount = 0;
    let ctrlTimeout: number | null = null;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Control") {
        ctrlPressCount++;
        
        // Si déjà 2 appuis sur Ctrl
        if (ctrlPressCount === 2) {
          e.preventDefault();
          console.log("🔓 Double Ctrl détecté ! Déverrouillage Admin...");
          
          // Afficher l'animation
          setShowAdminUnlock(true);
          
          // Après 2s, rediriger vers AdminPage
          setTimeout(() => {
            setShowAdminUnlock(false);
            setCurrentPage("admin");
          }, 2000);
          
          // Reset
          ctrlPressCount = 0;
          if (ctrlTimeout) clearTimeout(ctrlTimeout);
        } else {
          // Reset après 500ms si pas de 2ème appui
          if (ctrlTimeout) clearTimeout(ctrlTimeout);
          ctrlTimeout = setTimeout(() => {
            ctrlPressCount = 0;
          }, 500);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (ctrlTimeout) clearTimeout(ctrlTimeout);
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
