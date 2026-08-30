import { create } from 'zustand'

interface NetworkState {
  status: 'connected' | 'disconnected' | 'connecting'
  setStatus: (status: 'connected' | 'disconnected' | 'connecting') => void
}

export const useNetworkStore = create<NetworkState>((set) => ({
  status: 'disconnected',
  setStatus: (status) => set({ status }),
}))
