import { useEffect, useCallback } from 'react'
import { useMessageStore } from '../store/messageStore'

/**
 * Hook pour charger et accéder aux messages d'un contact.
 * Charge automatiquement les messages au montage et quand contactPubkey change.
 */
export function useMessages(contactPubkey: string | null) {
  const { messagesByContact, loadMessages, sendMessage, isContactLoading } = useMessageStore()

  useEffect(() => {
    if (contactPubkey) {
      loadMessages(contactPubkey)
    }
  }, [contactPubkey, loadMessages])

  const messages: Message[] = contactPubkey ? (messagesByContact[contactPubkey] ?? []) : []
  const isLoading = contactPubkey ? isContactLoading(contactPubkey) : false

  const send = useCallback(
    (text: string) => {
      if (!contactPubkey) return Promise.reject(new Error('Aucun contact sélectionné'))
      return sendMessage(contactPubkey, text)
    },
    [contactPubkey, sendMessage]
  )

  return { messages, isLoading, sendMessage: send }
}
