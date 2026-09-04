/**
 * Thanos Snap Effect - Désintégration en poussière
 * Inspiré par Mikhail Bespalov's codepen
 * https://codepen.io/Mikhail-Bespalov/pen/yLmpxOG
 */

import { useRef, useEffect, type PropsWithChildren } from 'react';
import {
  m,
  useAnimate,
  useMotionValue,
  useMotionValueEvent,
} from 'motion/react';

// ⚡ FLUIDITÉ MAXIMALE - Poussière ultra légère
const DURATION_SECONDS = 0.6; // Très rapide
const MAX_DISPLACEMENT = 300; // Dispersion légère et rapide

const transition = {
  duration: DURATION_SECONDS,
  ease: (t: number) => t * (2 - t), // easeOutQuad - Très fluide et rapide
};

interface ThanosSnapEffectProps extends PropsWithChildren {
  onDissolveComplete?: () => void;
  triggerDissolve?: boolean;
}

export function ThanosSnapEffect({ 
  children, 
  onDissolveComplete,
  triggerDissolve = false 
}: ThanosSnapEffectProps) {
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const displacementMapRef = useRef<SVGFEDisplacementMapElement>(null);
  const dissolveTargetRef = useRef<HTMLDivElement>(null);
  const displacement = useMotionValue(0);
  const hasDissolvedRef = useRef(false);

  useMotionValueEvent(displacement, "change", (latest) => {
    displacementMapRef.current?.setAttribute('scale', latest.toString());
  });

  const handleDissolve = async () => {
    if (!scope.current || scope.current.dataset.isAnimating === 'true' || hasDissolvedRef.current) return;
    
    scope.current.dataset.isAnimating = 'true';
    hasDissolvedRef.current = true;

    console.log("🔥 Thanos Snap Effect démarré !");

    // Animation simultanée pour fluidité maximale
    await Promise.all([
      // Scale léger et disparition progressive
      animate(
        dissolveTargetRef.current!,
        { 
          scale: 1.05, // Expansion subtile
          opacity: 0   // Disparition directe
        },
        transition
      ),
      // Dispersion des particules
      animate(displacement, MAX_DISPLACEMENT, transition)
    ]);

    console.log("✅ Thanos Snap Effect terminé !");

    // Appeler le callback après dissolution
    if (onDissolveComplete) {
      setTimeout(() => {
        onDissolveComplete();
      }, 200);
    }
  };

  // Surveiller triggerDissolve avec useEffect
  useEffect(() => {
    console.log("🎯 ThanosSnapEffect - triggerDissolve:", triggerDissolve, "hasDissolvedRef:", hasDissolvedRef.current);
    
    // Si triggerDissolve passe de false à true, réinitialiser hasDissolvedRef
    if (triggerDissolve && !hasDissolvedRef.current) {
      console.log("⚡⚡⚡ LANCEMENT DISSOLUTION THANOS !");
      handleDissolve();
    }
    
    // Réinitialiser quand triggerDissolve repasse à false
    if (!triggerDissolve && hasDissolvedRef.current) {
      console.log("🔄 Réinitialisation hasDissolvedRef pour prochain déclenchement");
      hasDissolvedRef.current = false;
    }
  }, [triggerDissolve]);

  return (
    <div ref={scope}>
      <m.div
        ref={dissolveTargetRef}
        style={{ 
          filter: 'url(#dissolve-filter)',
          willChange: 'transform, opacity, filter',
          backfaceVisibility: 'hidden',
          transform: 'translateZ(0)',
          WebkitFontSmoothing: 'antialiased'
        } as React.CSSProperties}
      >
        {children}
      </m.div>
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter
            id="dissolve-filter"
            x="-300%"
            y="-300%"
            width="600%"
            height="600%"
            colorInterpolationFilters="sRGB"
          >
            {/* ULTRA OPTIMISÉ - Minimal pour fluidité MAX */}
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.008"
              numOctaves="1"
              result="noise"
            />
            <feComponentTransfer in="noise" result="adjusted">
              <feFuncR type="linear" slope="2" intercept="-0.5" />
              <feFuncG type="linear" slope="5" intercept="-1.2" />
            </feComponentTransfer>
            <feDisplacementMap
              ref={displacementMapRef}
              in="SourceGraphic"
              in2="adjusted"
              scale="0"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
}
