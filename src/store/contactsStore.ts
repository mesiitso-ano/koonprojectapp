import { create } from 'zustand'

interface ContactsState {
  contacts: Contact[]
  selectedPubkey: string | null
  isLoading: boolean
  loadContacts: () => Promise<void>
  addContact: (pubkey: string, nickname: string) => Promise<void>
  removeContact: (pubkey: string) => Promise<void>
  selectContact: (pubkey: string | null) => void
}

export const useContactsStore = create<ContactsState>((set) => ({
  contacts: [],
  selectedPubkey: null,
  isLoading: false,

  loadContacts: async () => {
    set({ isLoading: true })
    const contacts = await window.koon.contacts.list()
    set({ contacts, isLoading: false })
  },

  addContact: async (pubkey: string, nickname: string) => {
    const contacts = await window.koon.contacts.add(pubkey, nickname)
    set({ contacts })
  },

  removeContact: async (pubkey: string) => {
    const contacts = await window.koon.contacts.remove(pubkey)
    set({ contacts, selectedPubkey: null })
  },

  selectContact: (pubkey: string | null) => {
    set({ selectedPubkey: pubkey })
  },
}))
