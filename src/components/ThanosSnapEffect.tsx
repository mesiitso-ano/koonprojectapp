// Composant Loader avec 4 cercles rotatifs — remplace ThanosSnapEffect
import { ReactNode } from "react";

interface ThanosSnapEffectProps {
  children?: ReactNode;
  triggerDissolve?: boolean;
  onDissolveComplete?: () => void;
}

export function ThanosSnapEffect({
  children,
  triggerDissolve = false,
}: ThanosSnapEffectProps) {
  // Si pas de dissolution déclenchée, afficher children normalement
  if (!triggerDissolve) {
    return <>{children}</>;
  }

  // Afficher le loader pendant la dissolution
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="loader-spin">
        <div className="circle" />
        <div className="circle" />
        <div className="circle" />
        <div className="circle" />
      </div>

      <style>{`
        .loader-spin {
          --dim: 5rem;
          width: var(--dim);
          height: var(--dim);
          position: relative;
          animation: spin988 2s linear infinite;
        }

        .loader-spin .circle {
          --color: #000;
          --dim: 2rem;
          width: var(--dim);
          height: var(--dim);
          background-color: var(--color);
          border-radius: 50%;
          position: absolute;
        }

        .loader-spin .circle:nth-child(1) {
          top: 0;
          left: 0;
        }

        .loader-spin .circle:nth-child(2) {
          top: 0;
          right: 0;
        }

        .loader-spin .circle:nth-child(3) {
          bottom: 0;
          left: 0;
        }

        .loader-spin .circle:nth-child(4) {
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
      `}</style>
    </div>
  );
}

// Export par défaut pour compatibilité
export default ThanosSnapEffect;
