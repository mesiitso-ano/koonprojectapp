import { create } from 'zustand'

interface EnterpriseState {
  profile: EnterpriseProfile | null
  followedPubkeys: string[]
  isLoading: boolean
  loadProfile: (pubkey: string) => Promise<void>
  requestUpgrade: (payload: EnterpriseRequestPayload) => Promise<BadgeStatus>
  follow: (enterprisePubkey: string) => Promise<void>
  unfollow: (enterprisePubkey: string) => Promise<void>
  loadFollowed: () => Promise<void>
}

export const useEnterpriseStore = create<EnterpriseState>((set, get) => ({
  profile: null,
  followedPubkeys: [],
  isLoading: false,

  loadProfile: async (pubkey) => {
    set({ isLoading: true })
    try {
      const profile = await window.koon.enterprise.getProfile(pubkey)
      set({ profile, isLoading: false })
    } catch {
      set({ isLoading: false })
    }
  },

  requestUpgrade: async (payload) => {
    const result = await window.koon.enterprise.request(payload)
    // Refresh own profile using identity pubkey stored in state
    const currentProfile = (useEnterpriseStore.getState()).profile
    if (currentProfile?.pubkey) {
      const profile = await window.koon.enterprise.getProfile(currentProfile.pubkey)
      if (profile) set({ profile })
    } else {
      // Set a pending profile from the payload
      set({ profile: {
        pubkey: '',
        company_name: payload.company_name,
        logo_url: payload.logo_url ?? null,
        description: payload.description,
        badge_status: result.status,
        documents_ref: payload.documents_ref ?? null,
        created_at: Math.floor(Date.now() / 1000),
      }})
    }
    return result.status
  },

  follow: async (enterprisePubkey) => {
    const result = await window.koon.enterprise.follow(enterprisePubkey)
    set({ followedPubkeys: result.followed })
  },

  unfollow: async (enterprisePubkey) => {
    const result = await window.koon.enterprise.unfollow(enterprisePubkey)
    set({ followedPubkeys: result.followed })
  },

  loadFollowed: async () => {
    try {
      const followed = await window.koon.enterprise.getFollowed()
      set({ followedPubkeys: followed })
    } catch {
      // ignore
    }
  },
}))
