import { create } from 'zustand'

interface MessageState {
  // messages indexed by contact_pubkey
  messagesByContact: Record<string, Message[]>
  // loading state per contact
  loadingByContact: Record<string, boolean>
  loadMessages: (contactPubkey: string) => Promise<void>
  sendMessage: (contactPubkey: string, plaintext: string) => Promise<void>
  receiveMessage: (msg: Message) => void
  isContactLoading: (contactPubkey: string) => boolean
}

export const useMessageStore = create<MessageState>((set, get) => ({
  messagesByContact: {},
  loadingByContact: {},

  isContactLoading: (contactPubkey: string) => {
    return get().loadingByContact[contactPubkey] ?? false
  },

  loadMessages: async (contactPubkey: string) => {
    set((state) => ({
      loadingByContact: { ...state.loadingByContact, [contactPubkey]: true },
    }))
    try {
      const msgs = await window.koon.messages.list(contactPubkey)
      set((state) => ({
        messagesByContact: { ...state.messagesByContact, [contactPubkey]: msgs },
        loadingByContact: { ...state.loadingByContact, [contactPubkey]: false },
      }))
    } catch (err) {
      set((state) => ({
        loadingByContact: { ...state.loadingByContact, [contactPubkey]: false },
      }))
      throw err
    }
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
      // Deduplicate by id
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
