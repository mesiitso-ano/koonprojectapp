import { create } from 'zustand'

interface IdentityState {
  identity: { pubkey: string; sigPubkey: string; mnemonic: string } | null
  isLoading: boolean
  error: string | null
  loadIdentity: () => Promise<void>
  generateIdentity: () => Promise<void>
  importIdentity: (mnemonic: string) => Promise<void>
  clearIdentity: () => Promise<void>
}

export const useIdentityStore = create<IdentityState>((set) => ({
  identity: null,
  isLoading: false,
  error: null,

  loadIdentity: async () => {
    set({ isLoading: true, error: null })
    try {
      const id = await window.koon.identity.getCurrent()
      set({ identity: id, isLoading: false })
    } catch (e) {
      set({ error: String(e), isLoading: false })
    }
  },

  generateIdentity: async () => {
    set({ isLoading: true, error: null })
    try {
      const id = await window.koon.identity.generate()
      set({ identity: id, isLoading: false })
    } catch (e) {
      set({ error: String(e), isLoading: false })
    }
  },

  importIdentity: async (mnemonic: string) => {
    set({ isLoading: true, error: null })
    try {
      const id = await window.koon.identity.import(mnemonic)
      set({ identity: id, isLoading: false })
    } catch (e) {
      set({ error: String(e), isLoading: false })
    }
  },

  clearIdentity: async () => {
    await window.koon.identity.clear()
    set({ identity: null })
  },
}))
