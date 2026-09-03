// Indicateur d'étapes avec remplissage progressif et animations
import { memo } from "react";

interface StepIndicatorProps {
  currentStep: number;
  stepProgress: number; // 0-100
  stepStatus: "progress" | "validating" | "success" | "error";
  totalSteps: number;
}

const StepIndicator = memo(({ currentStep, stepProgress, stepStatus, totalSteps }: StepIndicatorProps) => {
  const renderStepContent = (step: number) => {
    const isCurrentStep = step === currentStep;
    const isPastStep = step < currentStep;

    if (isCurrentStep) {
      // Étape en cours
      if (stepStatus === "validating") {
        // Loader tournant
        return (
          <div className="step-loader">
            <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        );
      } else if (stepStatus === "success") {
        // Check vert
        return (
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    } else if (isPastStep) {
      // Étape complétée
      return (
        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

    if (isCurrentStep) {
      if (stepStatus === "success") {
        return "bg-green-600 text-white scale-110";
      } else if (stepStatus === "error") {
        return "bg-red-600 text-white scale-110";
      } else {
        return "bg-white border-4 border-gray-900 text-gray-900";
      }
    } else if (isPastStep) {
      return "bg-green-600 text-white";
    } else {
      return "bg-gray-200 text-gray-400";
    }
  };

  return (
    <div 
      id="StepIndicator6" 
      title="StepIndicator6 - Step Progress"
      className={`fixed left-[50px] top-1/2 -translate-y-1/2 flex flex-col gap-4 z-20 transition-transform duration-1000 ease-out ${
        stepStatus === "success" && currentStep === 1 ? "-translate-y-[calc(50%+20px)]" : ""
      }`}
    >
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => {
        const isCurrentStep = step === currentStep;
        
        return (
          <div
            key={step}
            id={`Step${step}`}
            title={`Step${step}`}
            className="flex flex-col items-center transition-all duration-500"
          >
            <div className="relative w-12 h-12">
              {/* Cercle de fond */}
              <div
                className={`absolute inset-0 rounded-full flex items-center justify-center font-bold text-sm transition-all ${getStepClasses(step)}`}
              >
                {renderStepContent(step)}
              </div>
              
              {/* Remplissage progressif (uniquement pour step en cours) */}
              {isCurrentStep && stepStatus === "progress" && (
                <svg className="absolute inset-0 -rotate-90 w-12 h-12" viewBox="0 0 48 48">
                  <circle
                    cx="24"
                    cy="24"
                    r="22"
                    fill="none"
                    stroke="#000"
                    strokeWidth="4"
                    strokeDasharray={`${2 * Math.PI * 22}`}
                    strokeDashoffset={`${2 * Math.PI * 22 * (1 - stepProgress / 100)}`}
                    className="transition-all duration-300"
                  />
                </svg>
              )}
            </div>
            
            {/* Ligne de connexion */}
            {step < totalSteps && (
              <div
                className={`w-0.5 h-8 transition-colors ${
                  step < currentStep ? "bg-green-600" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
});

StepIndicator.displayName = "StepIndicator";

export default StepIndicator;
