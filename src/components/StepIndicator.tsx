// Indicateur d'étapes avec remplissage progressif et animations
import { memo, useState, useEffect } from "react";

interface StepIndicatorProps {
  currentStep: number;
  stepProgress: number; // 0-100
  stepStatus: "progress" | "validating" | "success" | "error";
  totalSteps: number;
}

interface CompletedStep {
  step: number;
  fillProgress: number; // 0-100 pour l'animation de remplissage de la tige
}

const StepIndicator = memo(({ currentStep, stepProgress, stepStatus, totalSteps }: StepIndicatorProps) => {
  const [completedSteps, setCompletedSteps] = useState<CompletedStep[]>([]);
  const [showCheckIcon, setShowCheckIcon] = useState(false);
  
  // Détecter quand un step passe à "success" pour déclencher l'animation
  useEffect(() => {
    if (stepStatus === "success") {
      // 1. Afficher l'icône check en fade-in (immédiat)
      setShowCheckIcon(true);
      
      // 2. Après 500ms, commencer à remplir la tige
      setTimeout(() => {
        const newCompleted: CompletedStep = { step: currentStep, fillProgress: 0 };
        setCompletedSteps(prev => [...prev, newCompleted]);
        
        // Animation de remplissage de la tige (0 à 100% en 1.5s)
        let progress = 0;
        const interval = setInterval(() => {
          progress += 2; // Incréments de 2%
          if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
          }
          setCompletedSteps(prev => 
            prev.map(cs => cs.step === currentStep ? { ...cs, fillProgress: progress } : cs)
          );
        }, 30); // 30ms * 50 itérations = 1.5s
        
      }, 500);
    } else {
      setShowCheckIcon(false);
    }
  }, [stepStatus, currentStep]);
  
  const renderStepContent = (step: number) => {
    const isCurrentStep = step === currentStep;
    const isPastStep = step < currentStep;
    const completedStep = completedSteps.find(cs => cs.step === step);

    if (isCurrentStep) {
      // Étape en cours
      if (stepStatus === "validating") {
        // Loader à 4 cercles
        return (
          <div className="step-loader-4circles">
            <div className="loader-square">
              <div className="loader-circle" />
              <div className="loader-circle" />
              <div className="loader-circle" />
              <div className="loader-circle" />
            </div>
          </div>
        );
      } else if (stepStatus === "success") {
        // Check blanc avec fade-in
        return (
          <svg 
            className={`w-6 h-6 text-white transition-opacity duration-300 ${showCheckIcon ? 'opacity-100' : 'opacity-0'}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        );
      } else if (stepStatus === "error") {
        // Croix rouge
        return (
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      } else {
        // Afficher le numéro avec progression
        return <span className="text-sm font-bold">{step}</span>;
      }
    } else if (isPastStep || completedStep) {
      // Étape complétée - Check blanc sur fond noir
      return (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      );
    } else {
      // Étape future
      return <span className="text-sm font-bold text-gray-400">{step}</span>;
    }
  };

  const getStepClasses = (step: number) => {
    const isCurrentStep = step === currentStep;
    const isPastStep = step < currentStep;
    const completedStep = completedSteps.find(cs => cs.step === step);

    if (isCurrentStep) {
      if (stepStatus === "success") {
        // Boule devient noire instantanément
        return "bg-gray-900 text-white scale-110 transition-all duration-300";
      } else if (stepStatus === "validating") {
        // Fond noir pendant validation (pour contraster avec les cercles blancs)
        return "bg-gray-900 text-white";
      } else if (stepStatus === "error") {
        return "bg-red-600 text-white scale-110";
      } else {
        return "bg-white border-2 border-gray-400 text-gray-900";
      }
    } else if (isPastStep || completedStep) {
      // Étapes complétées - fond noir
      return "bg-gray-900 text-white";
    } else {
      return "bg-gray-200 text-gray-400";
    }
  };

  // Calculer le décalage vertical : chaque step complété monte de 30px individuellement
  const getStepOffset = (step: number) => {
    const completedStep = completedSteps.find(cs => cs.step === step);
    if (completedStep && completedStep.fillProgress === 100) {
      return -30; // Monte de 30px
    }
    return 0;
  };

  return (
    <div 
      id="StepIndicator6" 
      title="StepIndicator6 - Step Progress"
      className="fixed left-[50px] top-1/2 -translate-y-1/2 flex flex-col gap-4 z-20"
    >
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => {
        const isCurrentStep = step === currentStep;
        const completedStep = completedSteps.find(cs => cs.step === step);
        const stepOffset = getStepOffset(step);
        
        return (
          <div
            key={step}
            id={`Step${step}`}
            title={`Step${step}`}
            className="flex flex-col items-center transition-all duration-1000 ease-out"
            style={{ transform: `translateY(${stepOffset}px)` }}
          >
            <div className="relative w-12 h-12 z-10">
              {/* Cercle de fond */}
              <div
                className={`absolute inset-0 rounded-full flex items-center justify-center font-bold text-sm transition-all ${getStepClasses(step)}`}
              >
                {renderStepContent(step)}
              </div>
              
              {/* Remplissage progressif (uniquement pour step en cours) */}
              {isCurrentStep && stepStatus === "progress" && (
                <svg className="absolute inset-0 -rotate-90 w-12 h-12" viewBox="0 0 48 48" style={{ overflow: 'visible' }}>
                  {/* Cercle de progression noir - centré sur le bord */}
                  <circle
                    cx="24"
                    cy="24"
                    r="23"
                    fill="none"
                    stroke="#000"
                    strokeWidth="4"
                    strokeDasharray={`${2 * Math.PI * 23}`}
                    strokeDashoffset={`${2 * Math.PI * 23 * (1 - stepProgress / 100)}`}
                    className="transition-all duration-300"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </div>
            
            {/* Ligne de connexion avec animation de remplissage - derrière la boule (z-index inférieur) */}
            {step < totalSteps && (
              <div className="relative w-[2px] h-8 bg-gray-200 overflow-hidden -mt-2 z-0">
                {/* Remplissage noir qui "coule" */}
                {completedStep && (
                  <div 
                    className="absolute top-0 left-0 w-full bg-gray-900 transition-all duration-300 ease-linear"
                    style={{ height: `${completedStep.fillProgress}%` }}
                  />
                )}
                {/* Ligne noire pour steps déjà complétés */}
                {step < currentStep && !completedStep && (
                  <div className="absolute inset-0 bg-gray-900" />
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
});

StepIndicator.displayName = "StepIndicator";

export default StepIndicator;
