import { useEffect, useState } from 'react'
import { useContactsStore } from '../store/contactsStore'
import { useIdentityStore } from '../store/identityStore'
import { shortPubkey, copyToClipboard } from '../lib/utils'
import AddContactModal from './AddContactModal'
import IdentityPanel from './IdentityPanel'
import { cn } from '../lib/utils'

export default function Sidebar() {
  const { contacts, selectedPubkey, loadContacts, selectContact, removeContact } = useContactsStore()
  const { identity } = useIdentityStore()
  const [showAdd, setShowAdd] = useState(false)
  const [showIdentity, setShowIdentity] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    loadContacts()
  }, [loadContacts])

  const handleCopyPubkey = async () => {
    if (identity) {
      await copyToClipboard(identity.pubkey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="flex flex-col w-72 bg-koon-surface border-r border-koon-border h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-koon-border">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-koon-text">Contacts</h2>
          <button
            onClick={() => setShowAdd(true)}
            className="w-7 h-7 flex items-center justify-center rounded bg-koon-accent hover:bg-koon-accent-hover text-white transition-colors"
            title="Ajouter un contact"
            aria-label="Ajouter un contact"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 1v10M1 6h10" />
            </svg>
          </button>
        </div>
      </div>

      {/* Contact list */}
      <div className="flex-1 overflow-y-auto py-1">
        {contacts.length === 0 ? (
          <div className="text-center text-koon-muted text-xs py-8 px-4">
            <p>Aucun contact.</p>
            <p className="mt-1">Ajoute une pubkey pour commencer.</p>
          </div>
        ) : (
          contacts.map((contact) => (
            <ContactItem
              key={contact.pubkey}
              contact={contact}
              selected={selectedPubkey === contact.pubkey}
              onSelect={() => selectContact(contact.pubkey)}
              onRemove={() => removeContact(contact.pubkey)}
            />
          ))
        )}
      </div>

      {/* Identity footer */}
      <div className="border-t border-koon-border p-3">
        <button
          onClick={() => setShowIdentity(true)}
          className="w-full text-left"
          aria-label="Voir mon identité"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-koon-accent/20 flex items-center justify-center text-koon-accent text-xs font-bold shrink-0">
              {identity?.pubkey.slice(0, 2).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-medium text-koon-text truncate">Moi</p>
              <p className="text-xs text-koon-muted truncate">{shortPubkey(identity?.pubkey ?? '')}</p>
            </div>
          </div>
        </button>
        <button
          onClick={handleCopyPubkey}
          className="mt-2 w-full text-xs text-koon-muted hover:text-koon-text transition-colors text-center"
        >
          {copied ? '✓ Copié !' : 'Copier ma pubkey'}
        </button>
      </div>

      {showAdd && <AddContactModal onClose={() => setShowAdd(false)} />}
      {showIdentity && <IdentityPanel onClose={() => setShowIdentity(false)} />}
    </div>
  )
}

function ContactItem({
  contact,
  selected,
  onSelect,
  onRemove,
}: {
  contact: Contact
  selected: boolean
  onSelect: () => void
  onRemove: () => void
}) {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-3 py-2 mx-1 rounded cursor-pointer group relative',
        selected ? 'bg-koon-accent/20' : 'hover:bg-koon-border'
      )}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect()}
    >
      <div className={cn(
        'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0',
        selected ? 'bg-koon-accent text-white' : 'bg-koon-border text-koon-muted'
      )}>
        {contact.nickname.slice(0, 2).toUpperCase()}
      </div>
      <div className="flex-1 overflow-hidden">
        <p className="text-sm font-medium text-koon-text truncate">{contact.nickname}</p>
        <p className="text-xs text-koon-muted truncate">{shortPubkey(contact.pubkey)}</p>
      </div>
      <button
        className="opacity-0 group-hover:opacity-100 text-koon-muted hover:text-koon-danger transition-all p-1"
        onClick={(e) => { e.stopPropagation(); onRemove() }}
        aria-label="Supprimer le contact"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M2 2l8 8M10 2l-8 8" />
        </svg>
      </button>
    </div>
  )
}
