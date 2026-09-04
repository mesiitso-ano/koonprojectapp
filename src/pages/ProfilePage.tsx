// Page de profil utilisateur — affichage et édition des informations
import { useState } from "react";
import { useAppStore } from "../store/appStore";

type TabType = "profil" | "parametres" | "contacts";

export default function ProfilePage() {
  const { wallet, setCurrentPage, contacts, addContact, updateProfile } = useAppStore();
  const [activeTab, setActiveTab] = useState<TabType>("profil");
  const [isEditing, setIsEditing] = useState(false);
  const [showMnemonic, setShowMnemonic] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPIN, setShowPIN] = useState(false);

  // États pour l'édition
  const [editData, setEditData] = useState({
    // Step2
    nom: wallet?.profile?.nom || "",
    prenom: wallet?.profile?.prenom || "",
    deuxiemePrenom: wallet?.profile?.deuxiemePrenom || "",
    age: wallet?.profile?.age || "",
    sexe: wallet?.profile?.sexe || "",
    // Step3
    pays: wallet?.profile?.pays || "",
    telephone: wallet?.profile?.telephone || "",
    email: wallet?.profile?.email || "",
    emailSecondaire: wallet?.profile?.emailSecondaire || "",
    region: wallet?.profile?.region || "",
    ville: wallet?.profile?.ville || "",
    quartier: wallet?.profile?.quartier || "",
    adressePostale: wallet?.profile?.adressePostale || "",
    latitude: wallet?.profile?.latitude || "",
    longitude: wallet?.profile?.longitude || "",
  });

  // État nouveau contact
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContact, setNewContact] = useState({
    name: "",
    publicKey: ""
  });

  if (!wallet) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-white">
        <p className="text-gray-600">Aucun wallet trouvé</p>
      </div>
    );
  }

  const handleSaveEdit = () => {
    // Mettre à jour le profil dans le store
    updateProfile(editData);
    setIsEditing(false);
  };

  const handleAddContact = () => {
    if (!newContact.name.trim() || !newContact.publicKey.trim()) return;
    
    addContact({
      id: crypto.randomUUID(),
      name: newContact.name,
      publicKey: newContact.publicKey,
      unreadCount: 0
    });
    
    setNewContact({ name: "", publicKey: "" });
    setShowAddContact(false);
  };

  return (
    <div className="relative flex flex-col w-full h-full bg-white">
      {/* Header avec navigation */}
      <div className="flex items-center justify-between p-6 border-b-2 border-gray-900">
        <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
        <button
          onClick={() => setCurrentPage("chat")}
          className="px-6 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-full font-medium transition-colors"
        >
          Retour au Chat
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 px-6 pt-6 border-b-2 border-gray-200">
        <button
          onClick={() => setActiveTab("profil")}
          className={`px-6 py-3 font-medium rounded-t-xl transition-colors ${
            activeTab === "profil"
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          📋 Profil
        </button>
        <button
          onClick={() => setActiveTab("parametres")}
          className={`px-6 py-3 font-medium rounded-t-xl transition-colors ${
            activeTab === "parametres"
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          ⚙️ Paramètres
        </button>
        <button
          onClick={() => setActiveTab("contacts")}
          className={`px-6 py-3 font-medium rounded-t-xl transition-colors ${
            activeTab === "contacts"
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          👥 Contacts ({contacts.length})
        </button>
      </div>

      {/* Contenu des onglets */}
      <div className="flex-1 overflow-y-auto p-6">
        
        {/* ONGLET PROFIL */}
        {activeTab === "profil" && (
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Mnémonique */}
            <div className="bg-white border-2 border-gray-900 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">🔐 Phrase de récupération</h2>
                <button
                  onClick={() => setShowMnemonic(!showMnemonic)}
                  className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-full text-sm transition-colors"
                >
                  {showMnemonic ? "Masquer" : "Révéler"}
                </button>
              </div>
              {showMnemonic ? (
                <div className="grid grid-cols-4 gap-3">
                  {wallet.mnemonic.split(" ").map((word, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-3 py-2 bg-gray-50 border-2 border-gray-900 rounded-full"
                    >
                      <span className="text-xs font-bold text-gray-900">{index + 1}.</span>
                      <span className="text-sm font-medium text-gray-900">{word}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">••••••••••••••••••••••••</p>
              )}
            </div>

            {/* Clés cryptographiques */}
            <div className="bg-white border-2 border-gray-900 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">🔑 Clés cryptographiques</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-1">Clé publique</p>
                  <p className="text-xs text-gray-600 font-mono bg-gray-50 p-3 rounded-xl border border-gray-300 break-all">
                    {wallet.publicKey}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-1">Clé privée</p>
                  <p className="text-xs text-gray-600 font-mono bg-gray-50 p-3 rounded-xl border border-gray-300">
                    ••••••••••••••••••••••••
                  </p>
                </div>
              </div>
            </div>

            {/* Informations personnelles */}
            <div className="bg-white border-2 border-gray-900 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">👤 Informations personnelles</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">Nom</p>
                  <p className="text-gray-600">{wallet.profile?.nom || "—"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Prénom</p>
                  <p className="text-gray-600">{wallet.profile?.prenom || "—"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Deuxième prénom</p>
                  <p className="text-gray-600">{wallet.profile?.deuxiemePrenom || "—"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Âge</p>
                  <p className="text-gray-600">{wallet.profile?.age || "—"} ans</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Sexe</p>
                  <p className="text-gray-600 capitalize">{wallet.profile?.sexe || "—"}</p>
                </div>
              </div>
            </div>

            {/* Contact & Localisation */}
            <div className="bg-white border-2 border-gray-900 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">📍 Contact & Localisation</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">Pays</p>
                  <p className="text-gray-600 capitalize">{wallet.profile?.pays || "—"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Téléphone</p>
                  <p className="text-gray-600">{wallet.profile?.telephone || "—"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Email principal</p>
                  <p className="text-gray-600">{wallet.profile?.email || "—"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Email secondaire</p>
                  <p className="text-gray-600">{wallet.profile?.emailSecondaire || "—"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Région</p>
                  <p className="text-gray-600">{wallet.profile?.region || "—"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Ville</p>
                  <p className="text-gray-600">{wallet.profile?.ville || "—"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Quartier</p>
                  <p className="text-gray-600">{wallet.profile?.quartier || "—"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Coordonnées GPS</p>
                  <p className="text-gray-600">
                    {wallet.profile?.latitude && wallet.profile?.longitude
                      ? `${wallet.profile.latitude}, ${wallet.profile.longitude}`
                      : "—"}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-900">Adresse postale</p>
                  <p className="text-gray-600">{wallet.profile?.adressePostale || "—"}</p>
                </div>
              </div>
            </div>

            {/* Sécurité */}
            <div className="bg-white border-2 border-gray-900 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">🔒 Sécurité</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Mot de passe</p>
                    <p className="text-gray-600">
                      {showPassword ? wallet.profile?.password : "••••••••"}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-full text-sm transition-colors"
                  >
                    {showPassword ? "Masquer" : "Révéler"}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Code PIN</p>
                    <p className="text-gray-600">
                      {showPIN ? wallet.profile?.pin : "••••"}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowPIN(!showPIN)}
                    className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-full text-sm transition-colors"
                  >
                    {showPIN ? "Masquer" : "Révéler"}
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ONGLET PARAMÈTRES */}
        {activeTab === "parametres" && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white border-2 border-gray-900 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">✏️ Modifier mes informations</h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-full font-medium transition-colors"
                  >
                    Modifier
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  {/* Formulaire d'édition */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Nom</label>
                      <input
                        type="text"
                        value={editData.nom}
                        onChange={(e) => setEditData({...editData, nom: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-900 rounded-full focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Prénom</label>
                      <input
                        type="text"
                        value={editData.prenom}
                        onChange={(e) => setEditData({...editData, prenom: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-900 rounded-full focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Email</label>
                      <input
                        type="email"
                        value={editData.email}
                        onChange={(e) => setEditData({...editData, email: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-900 rounded-full focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Téléphone</label>
                      <input
                        type="tel"
                        value={editData.telephone}
                        onChange={(e) => setEditData({...editData, telephone: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-900 rounded-full focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 justify-end mt-6">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-full font-medium transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      className="px-6 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-full font-medium transition-colors"
                    >
                      Enregistrer
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600">
                  Cliquez sur "Modifier" pour mettre à jour vos informations personnelles.
                </p>
              )}
            </div>
          </div>
        )}

        {/* ONGLET CONTACTS */}
        {activeTab === "contacts" && (
          <div className="max-w-4xl mx-auto space-y-4">
            
            {/* Bouton ajouter contact */}
            <div className="flex justify-end">
              <button
                onClick={() => setShowAddContact(!showAddContact)}
                className="px-6 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-full font-medium transition-colors"
              >
                {showAddContact ? "Annuler" : "+ Ajouter un contact"}
              </button>
            </div>

            {/* Formulaire ajout contact */}
            {showAddContact && (
              <div className="bg-white border-2 border-gray-900 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Nouveau contact</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Nom</label>
                    <input
                      type="text"
                      value={newContact.name}
                      onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-900 rounded-full focus:outline-none"
                      placeholder="Alice Dupont"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Clé publique</label>
                    <input
                      type="text"
                      value={newContact.publicKey}
                      onChange={(e) => setNewContact({...newContact, publicKey: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-900 rounded-full focus:outline-none font-mono text-sm"
                      placeholder="0x..."
                    />
                  </div>
                  <button
                    onClick={handleAddContact}
                    disabled={!newContact.name.trim() || !newContact.publicKey.trim()}
                    className="w-full py-3 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full font-medium transition-colors"
                  >
                    Ajouter
                  </button>
                </div>
              </div>
            )}

            {/* Liste des contacts */}
            <div className="bg-white border-2 border-gray-900 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Mes contacts ({contacts.length})</h3>
              {contacts.length === 0 ? (
                <p className="text-gray-600 text-center py-8">Aucun contact pour le moment</p>
              ) : (
                <div className="space-y-3">
                  {contacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="flex items-center justify-between p-4 bg-gray-50 border-2 border-gray-300 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{contact.name}</p>
                        <p className="text-xs text-gray-600 font-mono truncate max-w-md">
                          {contact.publicKey}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setCurrentPage("chat");
                            // TODO: Sélectionner ce contact
                          }}
                          className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-full text-sm transition-colors"
                        >
                          💬 Chat
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
