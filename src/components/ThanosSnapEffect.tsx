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

// ⚡ Paramètres ULTRA FLUIDES - Poussière légère qui s'envole
const DURATION_SECONDS = 0.8; // Court et vif
const MAX_DISPLACEMENT = 350; // Dispersion rapide et naturelle

const transition = {
  duration: DURATION_SECONDS,
  ease: [0.25, 0.1, 0.25, 1], // easeOutCubic - Accélération naturelle
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
          willChange: 'transform, opacity, filter', // Force GPU
          backfaceVisibility: 'hidden',
          transform: 'translateZ(0) translate3d(0,0,0)', // Force layer GPU
          WebkitFontSmoothing: 'antialiased' // Smooth rendering
        }}
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
            {/* Bruit principal - OPTIMISÉ pour performance */}
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.01" // Réduit pour moins de calculs
              numOctaves="1" // Minimal pour fluidité max
              result="bigNoise"
            />
            <feComponentTransfer
              in="bigNoise"
              result="bigNoiseAdjusted"
            >
              <feFuncR type="linear" slope="1.2" intercept="-0.4" />
              <feFuncG type="linear" slope="4" intercept="-1" />
            </feComponentTransfer>
            {/* Bruit fin - LÉGER */}
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.3" // Réduit pour fluidité
              numOctaves="1" // Minimal
              result="fineNoise"
            />
            <feMerge result="combinedNoise">
              <feMergeNode in="bigNoiseAdjusted" />
              <feMergeNode in="fineNoise" />
            </feMerge>
            <feDisplacementMap
              ref={displacementMapRef}
              in="SourceGraphic"
              in2="combinedNoise"
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
