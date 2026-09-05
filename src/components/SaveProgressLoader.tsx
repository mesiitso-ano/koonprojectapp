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
        {/* Loader 4 cercles noirs rotatifs */}
        <div className="loader-spin988">
          <div className="circle" />
          <div className="circle" />
          <div className="circle" />
          <div className="circle" />
        </div>
        
        {/* Message */}
        <p className="mt-8 text-gray-900 text-xl font-bold animate-pulse">
          {message}
        </p>
        
        {/* Barre de progression */}
        <div className="mt-4 w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gray-900 rounded-full animate-progress"></div>
        </div>
      </div>

      <style>{`
        .loader-spin988 {
          --dim: 5rem;
          width: var(--dim);
          height: var(--dim);
          position: relative;
          animation: spin988 2s linear infinite;
          margin: 0 auto;
        }

        .loader-spin988 .circle {
          --color: #000;
          --dim: 2rem;
          width: var(--dim);
          height: var(--dim);
          background-color: var(--color);
          border-radius: 50%;
          position: absolute;
        }

        .loader-spin988 .circle:nth-child(1) {
          top: 0;
          left: 0;
        }

        .loader-spin988 .circle:nth-child(2) {
          top: 0;
          right: 0;
        }

        .loader-spin988 .circle:nth-child(3) {
          bottom: 0;
          left: 0;
        }

        .loader-spin988 .circle:nth-child(4) {
          bottom: 0;
          right: 0;
        }

        @keyframes spin988 {
          0% {
            transform: scale(1) rotate(0);
          }
          20%, 25% {
            transform: scale(1.3) rotate(90deg);
          }
          45%, 50% {
            transform: scale(1) rotate(180deg);
          }
          70%, 75% {
            transform: scale(1.3) rotate(270deg);
          }
          95%, 100% {
            transform: scale(1) rotate(360deg);
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
