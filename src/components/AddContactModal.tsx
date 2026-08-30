// Modal pour ajouter un nouveau contact
import { useState } from "react";
import { useAppStore } from "../store/appStore";

interface Props {
  onClose: () => void;
}

export default function AddContactModal({ onClose }: Props) {
  const { addContact } = useAppStore();
  const [name, setName] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [error, setError] = useState("");

  const handleAdd = () => {
    if (!name.trim()) {
      setError("Le nom est requis");
      return;
    }
    if (!publicKey.trim() || publicKey.length !== 64) {
      setError("Clé publique invalide (64 caractères hex attendus)");
      return;
    }

    addContact({
      id: crypto.randomUUID(),
      name: name.trim(),
      publicKey: publicKey.trim(),
      unreadCount: 0,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
      <div className="w-full max-w-md bg-koon-900 rounded-2xl p-6 space-y-4 border border-koon-700 mx-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">Ajouter un contact</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-koon-800 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div>
          <label className="block text-sm text-koon-muted mb-2">
            Nom du contact
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError("");
            }}
            placeholder="Alice"
            className="w-full px-4 py-3 bg-koon-950 border border-koon-700 rounded-lg focus:border-koon-accent focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm text-koon-muted mb-2">
            Clé publique (hex)
          </label>
          <textarea
            value={publicKey}
            onChange={(e) => {
              setPublicKey(e.target.value);
              setError("");
            }}
            placeholder="a1b2c3d4..."
            className="w-full h-24 px-4 py-3 bg-koon-950 border border-koon-700 rounded-lg focus:border-koon-accent focus:outline-none font-mono text-sm resize-none"
          />
        </div>

        {error && (
          <p className="text-sm text-koon-danger">{error}</p>
        )}

        <button
          onClick={handleAdd}
          className="w-full py-3 px-4 bg-koon-accent hover:bg-koon-accent2 rounded-lg font-medium transition-colors"
        >
          Ajouter
        </button>
      </div>
    </div>
  );
}
