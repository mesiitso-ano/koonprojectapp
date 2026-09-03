// Page principale de chat — UI de messagerie optimisée
import { useState, useMemo, memo } from "react";
import { useAppStore } from "../store/appStore";
import ContactList from "../components/ContactList";
import ChatWindow from "../components/ChatWindow";
import AddContactModal from "../components/AddContactModal";

// Mémoïser le placeholder vide pour éviter re-renders
const EmptyStatePlaceholder = memo(() => (
  <div id="EmptyState2" title="EmptyState2 - Empty Chat Placeholder" className="flex-1 flex items-center justify-center text-koon-text-secondary">
    <div id="EmptyContent2" title="EmptyContent2 - Empty State Content" className="text-center">
      <svg className="w-16 h-16 mx-auto mb-4 opacity-50 text-koon-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
      <p id="EmptyText2" title="EmptyText2 - Empty State Text">Sélectionnez une conversation</p>
    </div>
  </div>
));

EmptyStatePlaceholder.displayName = "EmptyStatePlaceholder";

export default function ChatPage() {
  // Sélecteurs optimisés
  const wallet = useAppStore((state) => state.wallet);
  const contacts = useAppStore((state) => state.contacts);
  const selectedContactId = useAppStore((state) => state.selectedContactId);
  
  const [showAddContact, setShowAddContact] = useState(false);

  // Mémoïser le contact sélectionné
  const selectedContact = useMemo(
    () => contacts.find((c) => c.id === selectedContactId),
    [contacts, selectedContactId]
  );

  if (!wallet) return null;

  return (
    <div id="Page2" title="Page2 - ChatPage Container" className="flex h-full bg-koon-50">
      {/* Sidebar gauche : liste des contacts */}
      <div id="Sidebar2" title="Sidebar2 - Contacts Sidebar" className="w-80 border-r border-koon-border-light flex flex-col bg-koon-100">
        <div id="SidebarHeader2" title="SidebarHeader2 - Sidebar Header" className="p-4 border-b border-koon-border-light">
          <div id="HeaderTop2" title="HeaderTop2 - Header Top Section" className="flex items-center justify-between mb-4">
            <h2 id="TitreConv2" title="TitreConv2 - Conversations Title" className="text-xl font-bold text-koon-900">Conversations</h2>
            <button
              id="BtnAddContact2"
              title="BtnAddContact2 - Add Contact Button"
              onClick={() => setShowAddContact(true)}
              className="p-2 hover:bg-koon-200 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-koon-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
          <div id="PublicKeyDisplay2" title="PublicKeyDisplay2 - Wallet Public Key" className="text-xs text-koon-text-secondary font-mono truncate flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            {wallet.publicKey.slice(0, 16)}...
          </div>
        </div>
        <ContactList />
      </div>

      {/* Zone principale : fenêtre de chat */}
      <div id="MainChat2" title="MainChat2 - Main Chat Area" className="flex-1 flex flex-col">
        {selectedContact ? (
          <ChatWindow contact={selectedContact} />
        ) : (
          <EmptyStatePlaceholder />
        )}
      </div>

      {showAddContact && (
        <AddContactModal onClose={() => setShowAddContact(false)} />
      )}
    </div>
  );
}
