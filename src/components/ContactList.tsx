// Liste des contacts dans la sidebar
import { useAppStore } from "../store/appStore";

export default function ContactList() {
  const { contacts, selectedContactId, selectContact } = useAppStore();

  if (contacts.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-center text-koon-muted text-sm">
        Aucun contact. Cliquez sur + pour en ajouter.
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {contacts.map((contact) => (
        <button
          key={contact.id}
          onClick={() => selectContact(contact.id)}
          className={`w-full p-4 text-left border-b border-koon-800 transition-colors ${
            selectedContactId === contact.id
              ? "bg-koon-800"
              : "hover:bg-koon-900"
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium">{contact.name}</span>
            {contact.unreadCount > 0 && (
              <span className="px-2 py-0.5 text-xs bg-koon-accent rounded-full">
                {contact.unreadCount}
              </span>
            )}
          </div>
          {contact.lastMessage && (
            <p className="text-sm text-koon-muted truncate">
              {contact.lastMessage.content}
            </p>
          )}
        </button>
      ))}
    </div>
  );
}
