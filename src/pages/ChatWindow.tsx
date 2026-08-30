import { useEffect, useRef } from 'react'
import { useMessages } from '../hooks/useMessages'
import { useContactsStore } from '../store/contactsStore'
import { useNetworkStore } from '../store/networkStore'
import MessageBubble from '../components/MessageBubble'
import MessageInput from '../components/MessageInput'
import { shortPubkey } from '../lib/utils'

interface Props {
  contactPubkey: string
}

export default function ChatWindow({ contactPubkey }: Props) {
  const { messages, isLoading } = useMessages(contactPubkey)
  const { contacts } = useContactsStore()
  const { status } = useNetworkStore()
  const bottomRef = useRef<HTMLDivElement>(null)

  const contact = contacts.find((c) => c.pubkey === contactPubkey)

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-koon-border bg-koon-surface shrink-0">
        <div className="w-9 h-9 rounded-full bg-koon-accent/20 flex items-center justify-center text-koon-accent text-xs font-bold">
          {contact?.nickname.slice(0, 2).toUpperCase() ?? '??'}
        </div>
        <div>
          <h3 className="text-sm font-semibold text-koon-text">
            {contact?.nickname ?? 'Contact inconnu'}
          </h3>
          <p className="text-xs text-koon-muted">{shortPubkey(contactPubkey)}</p>
        </div>
        <div className="ml-auto flex items-center gap-2 text-xs text-koon-muted">
          <span>🔒 E2E</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-5 h-5 border-2 border-koon-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-koon-muted text-sm">
              Aucun message. Dis bonjour à {contact?.nickname ?? 'ce contact'} !
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              contactNickname={contact?.nickname ?? shortPubkey(contactPubkey)}
            />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <MessageInput
        contactPubkey={contactPubkey}
        disabled={status !== 'connected'}
      />
    </div>
  )
}
