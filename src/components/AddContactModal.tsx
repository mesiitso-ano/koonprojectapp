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
    <div id="ModalOverlay5" title="ModalOverlay5 - Add Contact Modal Overlay" className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
      <div id="ModalCard5" title="ModalCard5 - Add Contact Card" className="w-full max-w-md bg-koon-50 rounded-2xl p-6 space-y-4 border border-koon-border-light mx-4 shadow-2xl">
        <div id="ModalHeader5" title="ModalHeader5 - Modal Header" className="flex items-center justify-between">
          <h3 id="ModalTitre5" title="ModalTitre5 - Modal Title" className="text-xl font-bold text-koon-900">Ajouter un contact</h3>
          <button
            id="BtnClose5"
            title="BtnClose5 - Close Modal Button"
            onClick={onClose}
            className="p-1 hover:bg-koon-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-koon-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div id="NameGroup5" title="NameGroup5 - Name Input Group">
          <label id="NameLabel5" title="NameLabel5 - Name Label" className="block text-sm text-koon-text-secondary mb-2">
            Nom du contact
          </label>
          <input
            id="InputName5"
            title="InputName5 - Name Input Field"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError("");
            }}
            placeholder="Alice"
            className="w-full px-4 py-3 bg-koon-50 border border-koon-border-light rounded-lg focus:border-koon-900 focus:outline-none text-koon-text-primary"
          />
        </div>

        <div id="KeyGroup5" title="KeyGroup5 - Public Key Input Group">
          <label id="KeyLabel5" title="KeyLabel5 - Public Key Label" className="block text-sm text-koon-text-secondary mb-2">
            Clé publique (hex)
          </label>
          <textarea
            id="InputKey5"
            title="InputKey5 - Public Key Input Field"
            value={publicKey}
            onChange={(e) => {
              setPublicKey(e.target.value);
              setError("");
            }}
            placeholder="a1b2c3d4..."
            className="w-full h-24 px-4 py-3 bg-koon-50 border border-koon-border-light rounded-lg focus:border-koon-900 focus:outline-none font-mono text-sm resize-none text-koon-text-primary"
          />
        </div>

        {error && (
          <p id="ErrorMsg5" title="ErrorMsg5 - Error Message" className="text-sm text-koon-danger">{error}</p>
        )}

        <button
          id="BtnAdd5"
          title="BtnAdd5 - Add Contact Button"
          onClick={handleAdd}
          className="w-full py-3 px-4 bg-koon-900 hover:bg-koon-800 text-white rounded-lg font-medium transition-colors"
        >
          Ajouter
        </button>
      </div>
    </div>
  );
}
