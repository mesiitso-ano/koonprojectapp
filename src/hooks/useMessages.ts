import { useEffect } from 'react'
import { useMessageStore } from '../store/messageStore'

/**
 * Hook utilitaire pour charger et accéder aux messages d'un contact.
 */
export function useMessages(contactPubkey: string | null) {
  const { messagesByContact, loadMessages, sendMessage, isLoading } = useMessageStore()

  useEffect(() => {
    if (contactPubkey) {
      loadMessages(contactPubkey)
    }
  }, [contactPubkey, loadMessages])

  const messages = contactPubkey ? (messagesByContact[contactPubkey] ?? []) : []

  return {
    messages,
    isLoading,
    sendMessage: (text: string) => {
      if (contactPubkey) return sendMessage(contactPubkey, text)
      return Promise.reject(new Error('Aucun contact sélectionné'))
    },
  }
}
