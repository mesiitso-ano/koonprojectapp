// Page Admin — gestion avancée de l'application
import { useState } from "react";
import { useAppStore } from "../store/appStore";

export default function AdminPage() {
  const { wallet, contacts, accounts, setCurrentPage } = useAppStore();
  const [activeSection, setActiveSection] = useState<"dashboard" | "users" | "system" | "logs">("dashboard");

  return (
    <div className="relative flex flex-col w-full h-full bg-gray-900 text-white">
      {/* Header Admin */}
      <div className="flex items-center justify-between p-6 border-b-2 border-yellow-500 bg-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
            <span className="text-2xl">⚡</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-yellow-500">ADMIN PANEL</h1>
            <p className="text-xs text-gray-400">Section d'administration</p>
          </div>
        </div>
        <button
          onClick={() => setCurrentPage("chat")}
          className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 rounded-full font-bold transition-colors"
        >
          🔙 Retour
        </button>
      </div>

      {/* Navigation Admin */}
      <div className="flex border-b-2 border-gray-700 bg-gray-800 px-6">
        <button
          onClick={() => setActiveSection("dashboard")}
          className={`px-6 py-3 font-medium transition-colors ${
            activeSection === "dashboard"
              ? "bg-yellow-500 text-gray-900"
              : "text-gray-400 hover:text-white hover:bg-gray-700"
          }`}
        >
          📊 Dashboard
        </button>
        <button
          onClick={() => setActiveSection("users")}
          className={`px-6 py-3 font-medium transition-colors ${
            activeSection === "users"
              ? "bg-yellow-500 text-gray-900"
              : "text-gray-400 hover:text-white hover:bg-gray-700"
          }`}
        >
          👥 Utilisateurs
        </button>
        <button
          onClick={() => setActiveSection("system")}
          className={`px-6 py-3 font-medium transition-colors ${
            activeSection === "system"
              ? "bg-yellow-500 text-gray-900"
              : "text-gray-400 hover:text-white hover:bg-gray-700"
          }`}
        >
          ⚙️ Système
        </button>
        <button
          onClick={() => setActiveSection("logs")}
          className={`px-6 py-3 font-medium transition-colors ${
            activeSection === "logs"
              ? "bg-yellow-500 text-gray-900"
              : "text-gray-400 hover:text-white hover:bg-gray-700"
          }`}
        >
          📝 Logs
        </button>
      </div>

      {/* Contenu */}
      <div className="flex-1 overflow-y-auto p-6">
        
        {/* DASHBOARD */}
        {activeSection === "dashboard" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-yellow-500">📊 Dashboard</h2>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-6">
              <div className="bg-gray-800 border-2 border-yellow-500 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Comptes</p>
                    <p className="text-4xl font-bold text-yellow-500">{accounts.length}</p>
                  </div>
                  <div className="text-5xl">👤</div>
                </div>
              </div>
              
              <div className="bg-gray-800 border-2 border-yellow-500 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Contacts</p>
                    <p className="text-4xl font-bold text-yellow-500">{contacts.length}</p>
                  </div>
                  <div className="text-5xl">👥</div>
                </div>
              </div>
              
              <div className="bg-gray-800 border-2 border-green-500 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Wallet Status</p>
                    <p className="text-2xl font-bold text-green-500">Active</p>
                  </div>
                  <div className="text-5xl">✅</div>
                </div>
              </div>
              
              <div className="bg-gray-800 border-2 border-blue-500 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Security Level</p>
                    <p className="text-2xl font-bold text-blue-500">High</p>
                  </div>
                  <div className="text-5xl">🔒</div>
                </div>
              </div>
            </div>

            {/* Wallet Info */}
            <div className="bg-gray-800 border-2 border-yellow-500 rounded-xl p-6">
              <h3 className="text-xl font-bold text-yellow-500 mb-4">🔑 Informations Wallet</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-400">Clé publique</p>
                  <p className="text-sm text-white font-mono bg-gray-900 p-3 rounded-lg break-all border border-gray-700">
                    {wallet?.publicKey}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Profil complet</p>
                  <p className="text-sm text-white">
                    {wallet?.profile ? "✅ Configuré" : "❌ Non configuré"}
                  </p>
                </div>
              </div>
            </div>
            {/* Liste comptes créés */}
            <div className="bg-gray-800 border-2 border-yellow-500 rounded-xl p-6">
              <h3 className="text-xl font-bold text-yellow-500 mb-4">👤 Comptes créés ({accounts.length})</h3>
              {accounts.length === 0 ? (
                <p className="text-gray-400 text-center py-4">Aucun compte créé</p>
              ) : (
                <div className="space-y-3">
                  {accounts.map((account, index) => (
                    <div key={index} className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-bold text-white">
                          {account.profile?.nom} {account.profile?.prenom}
                        </p>
                        <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                          ✅ Actif
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-400">Email:</span>
                          <p className="text-white truncate">{account.profile?.email || "—"}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Ville:</span>
                          <p className="text-white">{account.profile?.ville || "—"}</p>
                        </div>
                        <div className="col-span-2">
                          <span className="text-gray-400">Clé publique:</span>
                          <p className="text-white font-mono text-xs truncate">{account.publicKey}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* UTILISATEURS */}
        {activeSection === "users" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-yellow-500">👥 Gestion Utilisateurs</h2>
            
            {/* Tous les comptes */}
            <div className="bg-gray-800 border-2 border-yellow-500 rounded-xl p-6">
              <h3 className="text-xl font-bold text-yellow-500 mb-4">Liste complète des comptes ({accounts.length})</h3>
              {accounts.length === 0 ? (
                <p className="text-gray-400 text-center py-8">Aucun compte enregistré</p>
              ) : (
                <div className="space-y-4">
                  {accounts.map((account, index) => (
                    <div key={index} className="bg-gray-900 p-6 rounded-xl border-2 border-gray-700">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-bold text-white">
                            {account.profile?.nom} {account.profile?.prenom} {account.profile?.deuxiemePrenom}
                          </h4>
                          <p className="text-sm text-gray-400">{account.profile?.age} ans • {account.profile?.sexe}</p>
                        </div>
                        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                          Compte #{index + 1}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400">📧 Email</p>
                          <p className="text-white">{account.profile?.email}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">📞 Téléphone</p>
                          <p className="text-white">{account.profile?.telephone}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">🌍 Pays</p>
                          <p className="text-white capitalize">{account.profile?.pays}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">🏙️ Ville</p>
                          <p className="text-white">{account.profile?.ville}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-gray-400">📍 Adresse</p>
                          <p className="text-white">{account.profile?.adressePostale}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-gray-400">🗺️ Coordonnées GPS</p>
                          <p className="text-white font-mono text-xs">
                            {account.profile?.latitude && account.profile?.longitude
                              ? `${account.profile.latitude}, ${account.profile.longitude}`
                              : "Non renseigné"}
                          </p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-gray-400">🔑 Clé publique</p>
                          <p className="text-white font-mono text-xs break-all">{account.publicKey}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Profile Admin */}
            <div className="bg-gray-800 border-2 border-yellow-500 rounded-xl p-6">
              <h3 className="text-xl font-bold text-yellow-500 mb-4">Profil Utilisateur Actif</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Nom</p>
                  <p className="text-white">{wallet?.profile?.nom || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Prénom</p>
                  <p className="text-white">{wallet?.profile?.prenom || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="text-white">{wallet?.profile?.email || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Téléphone</p>
                  <p className="text-white">{wallet?.profile?.telephone || "—"}</p>
                </div>
              </div>
            </div>

            {/* Liste contacts */}
            <div className="bg-gray-800 border-2 border-yellow-500 rounded-xl p-6">
              <h3 className="text-xl font-bold text-yellow-500 mb-4">Contacts ({contacts.length})</h3>
              {contacts.length === 0 ? (
                <p className="text-gray-400 text-center py-4">Aucun contact</p>
              ) : (
                <div className="space-y-2">
                  {contacts.map((contact) => (
                    <div key={contact.id} className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                      <p className="font-medium text-white">{contact.name}</p>
                      <p className="text-xs text-gray-400 font-mono truncate">{contact.publicKey}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* SYSTÈME */}
        {activeSection === "system" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-yellow-500">⚙️ Configuration Système</h2>
            
            <div className="bg-gray-800 border-2 border-yellow-500 rounded-xl p-6">
              <h3 className="text-xl font-bold text-yellow-500 mb-4">Informations Système</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Version</span>
                  <span className="text-white font-mono">1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Plateforme</span>
                  <span className="text-white">Tauri + React</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Chiffrement</span>
                  <span className="text-green-500 font-bold">✅ Activé</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Auto-Update</span>
                  <span className="text-green-500 font-bold">✅ Activé</span>
                </div>
              </div>
            </div>

            {/* Actions système */}
            <div className="bg-gray-800 border-2 border-red-500 rounded-xl p-6">
              <h3 className="text-xl font-bold text-red-500 mb-4">⚠️ Actions Système</h3>
              <div className="space-y-3">
                <button className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors">
                  🔄 Recharger l'application
                </button>
                <button className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors">
                  🗑️ Vider le cache
                </button>
                <button className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-colors">
                  ⚠️ Réinitialiser l'application
                </button>
              </div>
            </div>
          </div>
        )}

        {/* LOGS */}
        {activeSection === "logs" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-yellow-500">📝 Logs Système</h2>
            
            <div className="bg-gray-800 border-2 border-yellow-500 rounded-xl p-6">
              <div className="bg-gray-900 p-4 rounded-lg font-mono text-sm h-96 overflow-y-auto border border-gray-700">
                <div className="text-green-400">[INFO] Application démarrée</div>
                <div className="text-blue-400">[DEBUG] Wallet chargé avec succès</div>
                <div className="text-green-400">[INFO] {contacts.length} contacts chargés</div>
                <div className="text-yellow-400">[WARN] Section Admin déverrouillée</div>
                <div className="text-blue-400">[DEBUG] Rendu AdminPage</div>
                <div className="text-gray-500">...</div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
