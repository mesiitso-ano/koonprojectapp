// Loader d'enregistrement — 6 secondes pour sauvegarder les données
interface SaveProgressLoaderProps {
  onComplete: () => void;
  message?: string;
}

export default function SaveProgressLoader({ onComplete, message = "Enregistrement des données..." }: SaveProgressLoaderProps) {
  // Déclencher onComplete après 6 secondes
  setTimeout(() => {
    onComplete();
  }, 6000);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-sm">
      <div className="text-center">
        {/* Loader animé */}
        <div className="loader-container">
          <div className="loader" />
        </div>
        
        {/* Message */}
        <p className="mt-8 text-gray-900 text-xl font-bold animate-pulse">
          {message}
        </p>
        
        {/* Barre de progression */}
        <div className="mt-4 w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-yellow-500 rounded-full animate-progress"></div>
        </div>
      </div>

      <style>{`
        .loader-container {
          width: 84px;
          height: 84px;
          position: relative;
          overflow: hidden;
          margin: 0 auto;
        }

        .loader:before,
        .loader:after {
          content: "";
          position: absolute;
          left: 50%;
          bottom: 0;
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: #FFD700; /* Jaune doré */
          transform: translate(-50%, 100%) scale(0);
          animation: push_save 3s infinite ease-in; /* 3s (2 cycles en 6s) */
        }

        .loader:after {
          animation-delay: 1.5s;
        }

        @keyframes push_save {
          0% {
            transform: translate(-50%, 100%) scale(1);
          }
          15%, 25% {
            transform: translate(-50%, 50%) scale(1);
          }
          50%, 75% {
            transform: translate(-50%, -30%) scale(0.5);
          }
          80%, 100% {
            transform: translate(-50%, -50%) scale(0);
          }
        }

        @keyframes progress {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }

        .animate-progress {
          animation: progress 6s linear forwards;
        }
      `}</style>
    </div>
  );
}
