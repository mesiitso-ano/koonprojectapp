// Liste des contacts dans la sidebar - Optimisée
import { memo, useCallback } from "react";
import { useAppStore } from "../store/appStore";
import type { Contact } from "../types";

// Composant Contact individuel mémoïsé
const ContactItem = memo(({ 
  contact, 
  isSelected, 
  onSelect 
}: { 
  contact: Contact; 
  isSelected: boolean; 
  onSelect: (id: string) => void;
}) => {
  const handleClick = useCallback(() => {
    onSelect(contact.id);
  }, [contact.id, onSelect]);

  return (
    <button
      id={`ContactItem${contact.id}`}
      title={`ContactItem${contact.id} - ${contact.name}`}
      onClick={handleClick}
      className={`w-full p-4 text-left border-b border-koon-border-light transition-colors ${
        isSelected ? "bg-koon-200" : "hover:bg-koon-100"
      }`}
    >
      <div id={`ContactHeader${contact.id}`} title={`ContactHeader${contact.id}`} className="flex items-center justify-between mb-1">
        <span id={`ContactName${contact.id}`} title={`ContactName${contact.id}`} className="font-medium text-koon-900">{contact.name}</span>
        {contact.unreadCount > 0 && (
          <span id={`UnreadBadge${contact.id}`} title={`UnreadBadge${contact.id}`} className="px-2 py-0.5 text-xs bg-koon-900 text-white rounded-full font-medium">
            {contact.unreadCount}
          </span>
        )}
      </div>
      {contact.lastMessage && (
        <p id={`LastMsg${contact.id}`} title={`LastMsg${contact.id}`} className="text-sm text-koon-text-secondary truncate">
          {contact.lastMessage.content}
        </p>
      )}
    </button>
  );
});

ContactItem.displayName = "ContactItem";

export default function ContactList() {
  // Sélecteurs optimisés - ne subscribe qu'aux données nécessaires
  const contacts = useAppStore((state) => state.contacts);
  const selectedContactId = useAppStore((state) => state.selectedContactId);
  const selectContact = useAppStore((state) => state.selectContact);

  if (contacts.length === 0) {
    return (
      <div id="EmptyContactList3" title="EmptyContactList3 - No Contacts Message" className="flex-1 flex items-center justify-center p-8 text-center text-koon-text-secondary text-sm">
        Aucun contact. Cliquez sur + pour en ajouter.
      </div>
    );
  }

  return (
    <div id="ContactListScroll3" title="ContactListScroll3 - Contacts Scroll Container" className="flex-1 overflow-y-auto">
      {contacts.map((contact) => (
        <ContactItem
          key={contact.id}
          contact={contact}
          isSelected={selectedContactId === contact.id}
          onSelect={selectContact}
        />
      ))}
    </div>
  );
}
