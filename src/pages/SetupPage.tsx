// Page d'initialisation — création ou restauration de wallet
import { useState } from "react";
import { useAppStore } from "../store/appStore";
import { generateMnemonic, validateMnemonic } from "bip39";
import { generateKeypairFromMnemonic } from "../lib/crypto";

export default function SetupPage() {
  const { setWallet, setCurrentPage } = useAppStore();
  const [mode, setMode] = useState<"create" | "restore" | null>(null);
  const [mnemonic, setMnemonic] = useState("");
  const [error, setError] = useState("");

  const handleCreateWallet = () => {
    const newMnemonic = generateMnemonic(256); // 24 mots
    setMnemonic(newMnemonic);
    setMode("create");
  };

  const handleConfirmWallet = () => {
    if (!validateMnemonic(mnemonic)) {
      setError("Phrase mnémonique invalide");
      return;
    }

    const keypair = generateKeypairFromMnemonic(mnemonic);
    setWallet({
      mnemonic,
      publicKey: keypair.publicKey,
      privateKey: keypair.privateKey,
    });
    setCurrentPage("chat");
  };

  const handleRestoreWallet = () => {
    if (!validateMnemonic(mnemonic)) {
      setError("Phrase mnémonique invalide");
      return;
    }
    handleConfirmWallet();
  };

  return (
    <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-koon-950 via-koon-900 to-koon-800">
      <div className="w-full max-w-md p-8 space-y-6 bg-koon-900 rounded-2xl shadow-2xl border border-koon-700">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-koon-accent mb-2">Koon</h1>
          <p className="text-koon-muted">Messagerie chiffrée de bout en bout</p>
        </div>

        {!mode && (
          <div className="space-y-4">
            <button
              onClick={handleCreateWallet}
              className="w-full py-3 px-4 bg-koon-accent hover:bg-koon-accent2 rounded-lg font-medium transition-colors"
            >
              Créer un nouveau wallet
            </button>
            <button
              onClick={() => setMode("restore")}
              className="w-full py-3 px-4 bg-koon-800 hover:bg-koon-700 rounded-lg font-medium transition-colors"
            >
              Restaurer un wallet existant
            </button>
          </div>
        )}

        {mode === "create" && (
          <div className="space-y-4 animate-fadeIn">
            <div className="p-4 bg-koon-950 rounded-lg border border-koon-700">
              <p className="text-sm text-koon-muted mb-2">
                Phrase de récupération (24 mots) :
              </p>
              <p className="text-sm font-mono leading-relaxed break-words">
                {mnemonic}
              </p>
            </div>
            <div className="p-3 bg-koon-danger/10 border border-koon-danger/30 rounded-lg">
              <p className="text-xs text-koon-danger">
                ⚠️ Sauvegardez cette phrase en lieu sûr. Elle est la seule façon de récupérer votre wallet.
              </p>
            </div>
            <button
              onClick={handleConfirmWallet}
              className="w-full py-3 px-4 bg-koon-success hover:bg-green-600 rounded-lg font-medium transition-colors"
            >
              J'ai sauvegardé ma phrase
            </button>
          </div>
        )}

        {mode === "restore" && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <label className="block text-sm text-koon-muted mb-2">
                Entrez votre phrase de récupération :
              </label>
              <textarea
                value={mnemonic}
                onChange={(e) => {
                  setMnemonic(e.target.value);
                  setError("");
                }}
                placeholder="word1 word2 word3 ..."
                className="w-full h-32 px-4 py-3 bg-koon-950 border border-koon-700 rounded-lg focus:border-koon-accent focus:outline-none font-mono text-sm resize-none"
              />
            </div>
            {error && (
              <p className="text-sm text-koon-danger">{error}</p>
            )}
            <button
              onClick={handleRestoreWallet}
              className="w-full py-3 px-4 bg-koon-accent hover:bg-koon-accent2 rounded-lg font-medium transition-colors"
            >
              Restaurer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
