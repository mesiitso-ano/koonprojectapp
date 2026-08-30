import { create } from 'zustand'

interface AdsSettingsState {
  settings: AdsSettings
  isLoaded: boolean
  load: () => Promise<void>
  save: (partial: Partial<AdsSettings>) => Promise<void>
}

const DEFAULT: AdsSettings = {
  preferred_language: 'fr',
  alert_new_ads: true,
  alert_followed_enterprises: true,
  hidden_enterprise_pubkeys: [],
}

export const useAdsSettingsStore = create<AdsSettingsState>((set, get) => ({
  settings: { ...DEFAULT },
  isLoaded: false,

  load: async () => {
    try {
      const settings = await window.koon.ads.getSettings()
      set({ settings, isLoaded: true })
    } catch {
      set({ isLoaded: true })
    }
  },

  save: async (partial) => {
    const merged = { ...get().settings, ...partial }
    set({ settings: merged }) // optimistic
    try {
      await window.koon.ads.saveSettings(partial)
    } catch (e) {
      console.error('[adsSettingsStore] save error:', e)
    }
  },
}))
