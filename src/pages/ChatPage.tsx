// Page principale de chat — UI de messagerie
import { useState } from "react";
import { useAppStore } from "../store/appStore";
import ContactList from "../components/ContactList";
import ChatWindow from "../components/ChatWindow";
import AddContactModal from "../components/AddContactModal";

export default function ChatPage() {
  const { wallet, contacts, selectedContactId } = useAppStore();
  const [showAddContact, setShowAddContact] = useState(false);

  if (!wallet) return null;

  const selectedContact = contacts.find((c) => c.id === selectedContactId);

  return (
    <div className="flex h-full bg-koon-950">
      {/* Sidebar gauche : liste des contacts */}
      <div className="w-80 border-r border-koon-800 flex flex-col">
        <div className="p-4 border-b border-koon-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Conversations</h2>
            <button
              onClick={() => setShowAddContact(true)}
              className="p-2 hover:bg-koon-800 rounded-lg transition-colors"
              title="Ajouter un contact"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
          <div className="text-xs text-koon-muted font-mono truncate">
            🔑 {wallet.publicKey.slice(0, 16)}...
          </div>
        </div>
        <ContactList />
      </div>

      {/* Zone principale : fenêtre de chat */}
      <div className="flex-1 flex flex-col">
        {selectedContact ? (
          <ChatWindow contact={selectedContact} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-koon-muted">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p>Sélectionnez une conversation</p>
            </div>
          </div>
        )}
      </div>

      {showAddContact && (
        <AddContactModal onClose={() => setShowAddContact(false)} />
      )}
    </div>
  );
}
