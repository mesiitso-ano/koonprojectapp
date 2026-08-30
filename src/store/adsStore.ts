import { create } from 'zustand'

interface AdsState {
  ads: Ad[]
  selectedAdId: string | null
  filters: AdsFilters
  isLoading: boolean
  error: string | null
  fetchAds: () => Promise<void>
  selectAd: (id: string | null) => void
  setFilters: (partial: Partial<AdsFilters>) => void
  interact: (adId: string, type: AdInteractionType, active: boolean, snoozeUntil?: number) => Promise<void>
  optimisticLike: (adId: string, active: boolean) => void
}

const DEFAULT_FILTERS: AdsFilters = {
  language: null,
  sector: null,
  sort: 'date_desc',
  showSaved: false,
  showFollowedOnly: false,
}

export const useAdsStore = create<AdsState>((set, get) => ({
  ads: [],
  selectedAdId: null,
  filters: { ...DEFAULT_FILTERS },
  isLoading: false,
  error: null,

  fetchAds: async () => {
    set({ isLoading: true, error: null })
    try {
      const ads = await window.koon.ads.list({ filters: get().filters })
      set({ ads, isLoading: false })
    } catch (e) {
      set({ error: String(e), isLoading: false })
    }
  },

  selectAd: (id) => set({ selectedAdId: id }),

  setFilters: (partial) => {
    set((state) => ({ filters: { ...state.filters, ...partial } }))
    get().fetchAds()
  },

  interact: async (adId, type, active, snoozeUntil) => {
    // Optimistic update for likes
    if (type === 'like') get().optimisticLike(adId, active)
    try {
      if (type === 'snooze' && snoozeUntil) {
        await window.koon.ads.snooze(adId, snoozeUntil)
      } else {
        await window.koon.ads.interact({ ad_id: adId, type, active, snooze_until: snoozeUntil })
      }
    } catch (e) {
      // Revert on failure
      if (type === 'like') get().optimisticLike(adId, !active)
      console.error('[adsStore] interact error:', e)
    }
  },

  optimisticLike: (adId, active) => {
    set((state) => ({
      ads: state.ads.map((ad) =>
        ad.id === adId
          ? { ...ad, likes_count: ad.likes_count + (active ? 1 : -1) }
          : ad
      ),
    }))
  },
}))
