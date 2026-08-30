import { create } from 'zustand'

interface MessageState {
  // messages par contact_pubkey
  messagesByContact: Record<string, Message[]>
  isLoading: boolean
  loadMessages: (contactPubkey: string) => Promise<void>
  sendMessage: (contactPubkey: string, plaintext: string) => Promise<void>
  receiveMessage: (msg: Message) => void
}

export const useMessageStore = create<MessageState>((set, get) => ({
  messagesByContact: {},
  isLoading: false,

  loadMessages: async (contactPubkey: string) => {
    set({ isLoading: true })
    const msgs = await window.koon.messages.list(contactPubkey)
    set((state) => ({
      messagesByContact: { ...state.messagesByContact, [contactPubkey]: msgs },
      isLoading: false,
    }))
  },

  sendMessage: async (contactPubkey: string, plaintext: string) => {
    const msg = await window.koon.messages.send(contactPubkey, plaintext)
    set((state) => {
      const prev = state.messagesByContact[contactPubkey] ?? []
      return {
        messagesByContact: {
          ...state.messagesByContact,
          [contactPubkey]: [...prev, msg],
        },
      }
    })
  },

  receiveMessage: (msg: Message) => {
    set((state) => {
      const prev = state.messagesByContact[msg.contact_pubkey] ?? []
      // Évite les doublons
      if (prev.find((m) => m.id === msg.id)) return state
      return {
        messagesByContact: {
          ...state.messagesByContact,
          [msg.contact_pubkey]: [...prev, msg],
        },
      }
    })
  },
}))
