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

// ⚡ Paramètres optimisés pour FLUIDITÉ MAXIMALE et particules visibles
const DURATION_SECONDS = 1.5; // Plus long = plus fluide et visible
const MAX_DISPLACEMENT = 500; // Dispersion large pour effet dramatique

const transition = {
  duration: DURATION_SECONDS,
  ease: (time: number) => 1 - Math.pow(1 - time, 3), // Courbe fluide
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

    await Promise.all([
      animate(
        dissolveTargetRef.current!,
        { 
          scale: 1.1,
          opacity: 0
        },
        transition
      ),
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
    if (triggerDissolve && !hasDissolvedRef.current) {
      console.log("⚡⚡⚡ LANCEMENT DISSOLUTION THANOS !");
      handleDissolve();
    }
  }, [triggerDissolve]);

  return (
    <div ref={scope}>
      <m.div
        ref={dissolveTargetRef}
        style={{ 
          filter: 'url(#dissolve-filter)',
          willChange: 'transform, opacity', // Force l'accélération GPU
          backfaceVisibility: 'hidden', // Optimisation rendering
          transform: 'translateZ(0)' // Force layer GPU
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
            {/* Bruit principal pour grandes particules TRÈS VISIBLES */}
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.015" // Particules plus grandes
              numOctaves="2"
              result="bigNoise"
            />
            <feComponentTransfer
              in="bigNoise"
              result="bigNoiseAdjusted"
            >
              <feFuncR type="linear" slope="1" intercept="-0.3" />
              <feFuncG type="linear" slope="4" intercept="-0.8" />
            </feComponentTransfer>
            {/* Bruit fin pour texture de poussière */}
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.5" // Texture plus visible
              numOctaves="2"
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
