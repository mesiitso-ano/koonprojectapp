// Composant racine — gestion du routage et de l'état global
import { useEffect } from "react";
import { useAppStore } from "./store/appStore";
import SetupPage from "./pages/SetupPage";
import ChatPage from "./pages/ChatPage";
import UpdateChecker from "./components/UpdateChecker";

export default function App() {
  const { currentPage, initializeApp } = useAppStore();

  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  // Routage simple basé sur l'état
  return (
    <div className="w-full h-full">
      {currentPage === "setup" && <SetupPage />}
      {currentPage === "chat" && <ChatPage />}
      
      {/* Vérificateur de mise à jour automatique */}
      <UpdateChecker />
    </div>
  );
}
