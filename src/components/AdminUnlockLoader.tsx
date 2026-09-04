// Animation de déverrouillage Admin (FN + Enter)

export default function AdminUnlockLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="text-center">
        {/* Loader animé */}
        <div className="loader-container">
          <div className="loader" />
        </div>
        
        {/* Texte */}
        <p className="mt-8 text-white text-xl font-bold animate-pulse">
          🔓 Déverrouillage Admin...
        </p>
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
          animation: push_unlock 3s infinite ease-in; /* 3s au lieu de 2s */
        }

        .loader:after {
          animation-delay: 1.5s; /* 1.5s au lieu de 1s */
        }

        @keyframes push_unlock {
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
      `}</style>
    </div>
  );
}
