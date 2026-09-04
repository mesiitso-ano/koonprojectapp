// Page d'initialisation — création ou restauration de wallet
import { useState, useEffect } from "react";
import { useAppStore } from "../store/appStore";
import { generateMnemonic, validateMnemonic } from "bip39";
import { generateKeypairFromMnemonic } from "../lib/crypto";
import Loader from "../components/Loader";
import StepIndicator from "../components/StepIndicator";
import { ThanosSnapEffect } from "../components/ThanosSnapEffect";
import { Buffer } from "buffer";

// Polyfill Buffer pour bip39
if (typeof window !== 'undefined') {
  (window as any).Buffer = Buffer;
}

export default function SetupPage() {
  const { setWallet, setCurrentPage } = useAppStore();
  
  // États principaux
  const [isLoading, setIsLoading] = useState(false);
  const [currentView, setCurrentView] = useState<"initial" | "signup-flow" | "restore-flow">("initial");
  
  // États Step Indicator
  const [currentStep, setCurrentStep] = useState(1);
  const [stepProgress, setStepProgress] = useState(0);
  const [stepStatus, setStepStatus] = useState<"progress" | "validating" | "success" | "error">("progress");
  
  // États inscription (Step 1: 24 mots)
  const [signupSubStep, setSignupSubStep] = useState<"display" | "validate">("display");
  const [mnemonic, setMnemonic] = useState("");
  const [copiedMnemonic, setCopiedMnemonic] = useState(false);
  
  // État pour les 24 mots de validation (tableau)
  const [validationWords, setValidationWords] = useState<string[]>(Array(24).fill(""));
  
  // État pour déclencher l'effet Thanos
  const [triggerThanos, setTriggerThanos] = useState(false);
  
  // DEBUG : Logger quand triggerThanos change
  useEffect(() => {
    console.log("🎯 STATE triggerThanos changé:", triggerThanos);
  }, [triggerThanos]);
  
  // États Step2 (formulaire)
  const [step2Data, setStep2Data] = useState({
    nom: "",
    prenom: "",
    deuxiemePrenom: "",
    age: "",
    sexe: ""
  });
  
  // États restauration
  const [restoreMnemonic, setRestoreMnemonic] = useState("");
  const [error, setError] = useState("");

  // Reset au montage
  useEffect(() => {
    console.log("🔄 SetupPage: Montage initial");
    setCurrentView("initial");
    setIsLoading(false);
  }, []);

  // Debug: Observer les changements de isLoading
  useEffect(() => {
    console.log("🔔 isLoading a changé:", isLoading);
  }, [isLoading]);

  // Debug: Observer les changements de currentView
  useEffect(() => {
    console.log("🔔 currentView a changé:", currentView);
  }, [currentView]);

  console.log("🔧 SetupPage: Rendu | currentView =", currentView, "| isLoading =", isLoading, "| Step =", currentStep, "| Progress =", stepProgress, "| SubStep =", signupSubStep);

  // ====== HANDLERS ======

  // Clic sur "Inscription"
  const handleClickInscription = () => {
    console.log("🔵 Clic Inscription - Début loader");
    setIsLoading(true);
    
    setTimeout(() => {
      console.log("⏱️ Timeout 4s terminé - Génération mnémonique");
      
      try {
        // Générer le mnémonique
        const newMnemonic = generateMnemonic(256); // 24 mots
        setMnemonic(newMnemonic);
        
        // Basculer vers le flow d'inscription
        setIsLoading(false);
        setCurrentView("signup-flow");
        setCurrentStep(1);
        setStepProgress(33); // Affichage des mots = 33%
        setStepStatus("progress");
        setSignupSubStep("display");
        setCopiedMnemonic(false);
        setError("");
        
        console.log("✅ Flow inscription activé - Loader arrêté");
      } catch (err) {
        console.error("❌ Erreur génération mnémonique:", err);
        setError("Erreur lors de la génération de la phrase");
        setIsLoading(false);
      }
    }, 4000); // Loader 4 secondes
  };

  // Clic sur "Connexion"
  const handleClickConnexion = () => {
    setCurrentView("restore-flow");
    setRestoreMnemonic("");
    setError("");
  };

  // Callback après dissolution Thanos
  const handleThanosComplete = () => {
    console.log("✅ Désintégration terminée - Passage immédiat au Step2");
    
    // D'ABORD masquer Carte1 en changeant signupSubStep
    setSignupSubStep("display"); // Retour au substep display
    
    // PUIS passer au Step2 après un court délai
    setTimeout(() => {
      setTriggerThanos(false);
      setCurrentStep(2);
      setStepProgress(0);
      setStepStatus("progress");
    }, 100); // Délai minimal pour que Carte1 disparaisse
  };

  // Retour à la page initiale
  const handleGoBack = () => {
    setCurrentView("initial");
    setMnemonic("");
    setRestoreMnemonic("");
    setCopiedMnemonic(false);
    setError("");
    setStepProgress(0);
    setSignupSubStep("display");
  };

  // Copier les mots
  const handleCopyMnemonic = async () => {
    try {
      await navigator.clipboard.writeText(mnemonic);
      setCopiedMnemonic(true);
      setStepProgress(66); // Progression à 66%
      console.log("✅ Mnémonique copié");
    } catch (err) {
      console.error("❌ Erreur copie:", err);
      setError("Erreur lors de la copie");
    }
  };

  // Passer à l'étape de validation
  const handleNextToValidation = () => {
    if (!copiedMnemonic) {
      setError("Veuillez d'abord copier la phrase");
      return;
    }
    setSignupSubStep("validate");
    setValidationWords(Array(24).fill("")); // Reset des 24 cellules
    setError("");
  };

  // Mettre à jour un mot de validation
  const handleWordChange = (index: number, value: string) => {
    const newWords = [...validationWords];
    newWords[index] = value;
    setValidationWords(newWords);
    setError("");
  };

  // Coller tous les mots depuis le presse-papier
  const handlePasteAllWords = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const words = text.trim().split(/\s+/);
      
      if (words.length !== 24) {
        setError(`Vous devez coller exactement 24 mots (${words.length} détectés)`);
        return;
      }
      
      setValidationWords(words);
      setError("");
      console.log("✅ 24 mots collés");
    } catch (err) {
      console.error("❌ Erreur collage:", err);
      setError("Erreur lors du collage depuis le presse-papier");
    }
  };

  // Retour vers affichage des mots (depuis validation)
  const handleBackToDisplay = () => {
    setSignupSubStep("display");
    setValidationWords(Array(24).fill("")); // Reset des 24 cellules
    setError("");
  };

  // Valider la phrase collée
  const handleValidateMnemonic = () => {
    // Reconstituer la phrase depuis les 24 cellules
    const reconstructedMnemonic = validationWords.join(" ").trim();
    
    if (!reconstructedMnemonic) {
      setError("Veuillez remplir tous les mots");
      return;
    }
    
    setStepProgress(100); // 100% atteint
    setStepStatus("validating"); // Loader tournant
    
    // Validation après 3 secondes
    setTimeout(() => {
      if (reconstructedMnemonic === mnemonic.trim()) {
        // Succès - Animation Step1 va démarrer
        setStepStatus("success");
        setError("");
        console.log("✅ Validation réussie - Animation Step1 démarre (3s)");
        // Note: Pas de déclenchement automatique Thanos
        // L'utilisateur doit cliquer "Suivant" après l'animation
      } else {
        // Erreur
        setStepStatus("error");
        setError("La phrase ne correspond pas !");
        
        // Revenir à l'étape de copie après 2 secondes
        setTimeout(() => {
          setStepStatus("progress");
          setStepProgress(33);
          setSignupSubStep("display");
          setValidationWords(Array(24).fill(""));
          setCopiedMnemonic(false);
        }, 2000);
      }
    }, 3000);
  };

  // Passer au Step2 avec effet Thanos
  const handleGoToStep2 = () => {
    console.log("🔥 Clic 'Suivant' - Déclenchement Thanos !");
    setTriggerThanos(true);
    // handleThanosComplete sera appelé automatiquement après la désintégration
  };

  // Restaurer un wallet existant
  const handleRestoreWallet = () => {
    if (!validateMnemonic(restoreMnemonic)) {
      setError("Phrase mnémonique invalide");
      return;
    }

    const keypair = generateKeypairFromMnemonic(restoreMnemonic);
    setWallet({
      mnemonic: restoreMnemonic,
      publicKey: keypair.publicKey,
      privateKey: keypair.privateKey,
    });
    setCurrentPage("chat");
  };

  // ====== RENDER ======

  return (
    <div 
      id="Page1" 
      title="Page1 - SetupPage Container"
      className="relative flex items-center justify-center w-full h-full bg-white overflow-hidden"
    >
      
      {/* Step Indicator - visible uniquement pendant signup-flow */}
      {currentView === "signup-flow" && (
        <StepIndicator 
          currentStep={currentStep} 
          stepProgress={stepProgress}
          stepStatus={stepStatus}
          totalSteps={3} 
        />
      )}
      
      {/* Loader - affiché pendant 4 secondes */}
      {isLoading && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-white/90 backdrop-blur-sm">
          <Loader />
        </div>
      )}
      
      {/* Bouton retour - SUR LA PAGE (pas sur la carte) - caché pendant loader et page initiale */}
      {!isLoading && currentView !== "initial" && (
        <button
          id="BtnRetour1"
          title="BtnRetour1 - Back Button"
          onClick={signupSubStep === "validate" ? handleBackToDisplay : handleGoBack}
          className="absolute top-8 left-8 p-3 bg-gray-900 hover:bg-gray-800 rounded-full transition-colors group z-30 shadow-lg border-2 border-gray-900"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
      )}
      
      <div 
        id="Carte1" 
        title="Carte1 - Main Setup Card"
        className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 space-y-6 bg-white rounded-2xl"
      >
        <div id="Header1" title="Header1 - Title Section" className="text-center">
          <h1 id="Titre1" title="Titre1 - App Title" className="text-4xl font-bold text-gray-900 mb-2">Koon</h1>
        </div>

        {/* PAGE INITIALE - Boutons Inscription/Connexion */}
        {currentView === "initial" && (
          <div id="BtnsInitial1" title="BtnsInitial1 - Initial Buttons Container" className="space-y-4">
            <button
              id="BtnCreer1"
              title="BtnCreer1 - Create Wallet Button"
              onClick={handleClickInscription}
              className="w-full py-3 px-4 bg-gray-900 hover:bg-gray-800 text-white rounded-full font-medium transition-colors"
            >
              Inscription
            </button>
            <button
              id="BtnRestaurer1"
              title="BtnRestaurer1 - Restore Wallet Button"
              onClick={handleClickConnexion}
              className="w-full py-3 px-4 bg-gray-900 hover:bg-gray-800 text-white rounded-full font-medium transition-colors border-2 border-gray-900"
            >
              Connexion
            </button>
          </div>
        )}

        {/* FLOW INSCRIPTION - Step 1 : Affichage des 24 mots */}
        {currentView === "signup-flow" && signupSubStep === "display" && (
          <div id="CreateMode1" title="CreateMode1 - Display Mnemonic" className="space-y-4 animate-fadeIn">
            <p id="MnemonicLabel1" title="MnemonicLabel1 - Mnemonic Label" className="text-sm text-gray-600 mb-3">
              Phrase de récupération (24 mots) :
            </p>
            
            {/* Grille de mots avec numérotation - 4 colonnes fixes */}
            <div id="MnemonicGrid1" title="MnemonicGrid1 - Mnemonic Grid" className="grid grid-cols-4 gap-y-5 gap-x-[30px]">
              {mnemonic.split(" ").map((word, index) => (
                <div
                  key={index}
                  id={`Word${index + 1}`}
                  title={`Word${index + 1}`}
                  className="flex items-center gap-2 px-3 py-2 bg-white border-2 border-gray-900 rounded-full w-fit"
                >
                  {/* Numéro simple (sans cercle) */}
                  <span className="flex-shrink-0 text-xs font-bold text-gray-900">
                    {index + 1}.
                  </span>
                  {/* Mot */}
                  <span className="text-sm font-medium text-gray-900 pr-2">
                    {word}
                  </span>
                </div>
              ))}
            </div>
            
            {/* Notification push - apparaît après copie */}
            {copiedMnemonic && (
              <div 
                id="NotificationPush1" 
                title="NotificationPush1 - Copy Success Notification"
                className="fixed top-4 right-4 z-50 p-4 bg-gray-900 text-white rounded-lg shadow-2xl flex items-start gap-3 animate-slideIn max-w-sm border-2 border-gray-900"
              >
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-semibold text-sm">Phrase copiée !</p>
                  <p className="text-xs mt-1 opacity-90">
                    Sauvegardez-la en lieu sûr. C'est la seule façon de récupérer votre compte.
                  </p>
                </div>
              </div>
            )}
            
            {error && (
              <p id="ErrorDisplay1" title="ErrorDisplay1 - Error Message" className="text-sm text-red-600">{error}</p>
            )}
            
            {/* Boutons Copier et Suivant sur la même ligne - centrés et descendus */}
            <div className="flex justify-center gap-3 mt-8">
              <button
                id="BtnCopy1"
                title="BtnCopy1 - Copy Mnemonic Button"
                onClick={handleCopyMnemonic}
                className="py-3 px-8 rounded-full font-medium transition-colors border-2 border-gray-900 bg-gray-900 hover:bg-gray-800 text-white"
              >
                {copiedMnemonic ? "✓ Copié" : "📋 Copier"}
              </button>
              <button
                id="BtnNext1"
                title="BtnNext1 - Next Step Button"
                onClick={handleNextToValidation}
                disabled={!copiedMnemonic}
                className="py-3 px-8 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full font-medium transition-colors border-2 border-gray-900"
              >
                Suivant
              </button>
            </div>
          </div>
        )}

        {/* FLOW INSCRIPTION - Step 1 : Validation des 24 mots */}
        {currentView === "signup-flow" && signupSubStep === "validate" && currentStep === 1 && (
          <ThanosSnapEffect triggerDissolve={triggerThanos} onDissolveComplete={handleThanosComplete}>
            <div id="ValidateMode1" title="ValidateMode1 - Validate Mnemonic" className="space-y-4 animate-fadeIn">
            <p id="ValidateLabel1" title="ValidateLabel1" className="text-sm text-gray-600 mb-3">
              Entrez les 24 mots pour valider :
            </p>
            
            {/* Grille de 24 cellules éditables - gap responsive selon contenu */}
            <div 
              id="ValidateGrid1" 
              title="ValidateGrid1 - Validation Grid" 
              className={`grid grid-cols-4 gap-y-5 transition-all ${
                validationWords.some(w => w) ? "gap-x-[30px]" : "gap-x-3"
              }`}
            >
              {Array.from({ length: 24 }, (_, index) => (
                <div
                  key={index}
                  id={`ValidWord${index + 1}`}
                  title={`ValidWord${index + 1}`}
                  className="flex items-center gap-2 px-3 py-2 bg-white border-2 border-gray-900 rounded-full w-fit cursor-pointer hover:bg-gray-50 transition-all"
                  style={{ minWidth: validationWords[index] ? 'auto' : '2.5cm' }}
                  onClick={() => {
                    if (!validationWords[index] && stepStatus !== "validating") {
                      const newWord = prompt("Entrez le mot:");
                      if (newWord) handleWordChange(index, newWord.trim());
                    }
                  }}
                >
                  {/* Numéro simple (sans cercle) */}
                  <span className="flex-shrink-0 text-xs font-bold text-gray-900">
                    {index + 1}.
                  </span>
                  {/* Mot si présent */}
                  {validationWords[index] && (
                    <span className="text-sm font-medium text-gray-900 pr-2">
                      {validationWords[index]}
                    </span>
                  )}
                </div>
              ))}
            </div>
            
            {error && (
              <p id="ErrorValidate1" title="ErrorValidate1 - Validation Error" className="text-sm text-red-600">{error}</p>
            )}
            
            {/* Boutons Valider/Suivant et icône Coller - centrés et descendus */}
            <div className="flex items-center justify-center gap-3 mt-8">
              <button
                id="BtnValidate1"
                title="BtnValidate1 - Validate/Next Button"
                onClick={() => {
                  console.log("🔥🔥 CLIC BOUTON ! stepStatus:", stepStatus);
                  if (stepStatus === "success") {
                    console.log("✅ Appel handleGoToStep2");
                    handleGoToStep2();
                  } else {
                    console.log("✅ Appel handleValidateMnemonic");
                    handleValidateMnemonic();
                  }
                }}
                disabled={
                  stepStatus === "validating" || 
                  (stepStatus !== "success" && validationWords.some(w => !w.trim()))
                }
                className="py-3 px-8 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full font-medium transition-colors border-2 border-gray-900"
              >
                {stepStatus === "validating" 
                  ? "Validation..." 
                  : stepStatus === "success" 
                    ? "Suivant" 
                    : "Valider"}
              </button>
              
              {/* Icône Coller - masquée après succès */}
              {stepStatus !== "success" && (
                <button
                  id="BtnPasteIcon1"
                  title="BtnPasteIcon1 - Paste Icon Button"
                  onClick={handlePasteAllWords}
                  disabled={stepStatus === "validating"}
                  className="p-3 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full transition-colors border-2 border-gray-900"
                >
                  📋
                </button>
              )}
            </div>
          </div>
          </ThanosSnapEffect>
        )}

        {/* FLOW INSCRIPTION - Step 2 : Formulaire informations personnelles */}
        {currentView === "signup-flow" && currentStep === 2 && (
          <div id="Step2Form1" title="Step2Form1 - Personal Info Form" className="space-y-4 animate-fadeIn">
            <p id="Step2Label1" title="Step2Label1" className="text-sm text-gray-600 mb-3">
              Informations personnelles :
            </p>
            
            <div className="space-y-4">
              {/* Nom */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Nom</label>
                <input
                  type="text"
                  value={step2Data.nom}
                  onChange={(e) => setStep2Data({...step2Data, nom: e.target.value})}
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-gray-900 rounded-full focus:outline-none text-gray-900"
                  placeholder="Votre nom"
                />
              </div>
              
              {/* Prénom */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Prénom</label>
                <input
                  type="text"
                  value={step2Data.prenom}
                  onChange={(e) => setStep2Data({...step2Data, prenom: e.target.value})}
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-gray-900 rounded-full focus:outline-none text-gray-900"
                  placeholder="Votre prénom"
                />
              </div>
              
              {/* Deuxième prénom */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Deuxième prénom (optionnel)</label>
                <input
                  type="text"
                  value={step2Data.deuxiemePrenom}
                  onChange={(e) => setStep2Data({...step2Data, deuxiemePrenom: e.target.value})}
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-gray-900 rounded-full focus:outline-none text-gray-900"
                  placeholder="Deuxième prénom"
                />
              </div>
              
              {/* Âge */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Âge</label>
                <input
                  type="number"
                  value={step2Data.age}
                  onChange={(e) => setStep2Data({...step2Data, age: e.target.value})}
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-gray-900 rounded-full focus:outline-none text-gray-900"
                  placeholder="Votre âge"
                />
              </div>
              
              {/* Sexe */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Sexe</label>
                <select
                  value={step2Data.sexe}
                  onChange={(e) => setStep2Data({...step2Data, sexe: e.target.value})}
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-gray-900 rounded-full focus:outline-none text-gray-900"
                >
                  <option value="">Sélectionnez</option>
                  <option value="homme">Homme</option>
                  <option value="femme">Femme</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
            </div>
            
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
            
            <div className="flex justify-center mt-8">
              <button
                className="py-3 px-8 bg-gray-900 hover:bg-gray-800 text-white rounded-full font-medium transition-colors border-2 border-gray-900"
                onClick={() => console.log("Step2 Suivant", step2Data)}
              >
                Suivant
              </button>
            </div>
          </div>
        )}

        {/* FLOW RESTAURATION - Connexion avec phrase existante */}
        {currentView === "restore-flow" && (
          <div id="RestoreMode1" title="RestoreMode1 - Restore Wallet Form" className="space-y-4 animate-fadeIn">
            <div id="InputGroup1" title="InputGroup1 - Mnemonic Input Group">
              <label id="InputLabel1" title="InputLabel1 - Input Label" className="block text-sm text-gray-600 mb-2">
                Entrez votre phrase de récupération :
              </label>
              <textarea
                id="InputMnemonic1"
                title="InputMnemonic1 - Mnemonic Input Field"
                value={restoreMnemonic}
                onChange={(e) => {
                  setRestoreMnemonic(e.target.value);
                  setError("");
                }}
                placeholder="word1 word2 word3 ..."
                className="w-full h-32 px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none font-mono text-sm resize-none text-gray-900"
              />
            </div>
            {error && (
              <p id="ErrorMsg1" title="ErrorMsg1 - Error Message" className="text-sm text-red-600">{error}</p>
            )}
            <button
              id="BtnRestaurerSubmit1"
              title="BtnRestaurerSubmit1 - Submit Restore Button"
              onClick={handleRestoreWallet}
              className="w-full py-3 px-4 bg-gray-900 hover:bg-gray-800 text-white rounded-full font-medium transition-colors"
            >
              Restaurer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
 