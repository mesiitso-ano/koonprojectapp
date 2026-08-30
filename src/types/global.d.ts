export {}

// ── Shared types (used in renderer + mirrored from adsRepo.ts) ───────────────

declare global {

  type AdInteractionType = 'like' | 'save' | 'history' | 'snooze'
  type BadgeStatus       = 'none' | 'pending' | 'verified' | 'rejected'
  type AdStatus          = 'active' | 'paused' | 'deleted'
  type AdMediaType       = 'image' | 'video' | 'none'
  type AdSortType        = 'date_desc' | 'date_asc' | 'popularity'

  interface Contact {
    pubkey:    string
    nickname:  string
    added_at:  number
  }

  interface Message {
    id:             number
    contact_pubkey: string
    direction:      'in' | 'out'
    plaintext:      string
    nonce:          string | null
    ciphertext:     string | null
    timestamp:      number
  }

  interface Ad {
    id:             string
    author_pubkey:  string
    company_name:   string
    logo_url:       string | null
    media_type:     AdMediaType
    media_url:      string | null
    description:    string
    cta_label:      string
    cta_url:        string
    language:       string
    sector:         string
    created_at:     number
    status:         AdStatus
    views_count:    number
    likes_count:    number
    comments_count: number
  }

  interface AdDetail extends Ad {
    userInteractions: AdInteractionType[]
    enterprise:       EnterpriseProfile | null
  }

  interface AdComment {
    id:             string
    ad_id:          string
    author_pubkey:  string
    content:        string
    created_at:     number
  }

  interface EnterpriseProfile {
    pubkey:        string
    company_name:  string
    logo_url:      string | null
    description:   string
    badge_status:  BadgeStatus
    documents_ref: string | null
    created_at:    number
  }

  interface AdsFilters {
    language?:         string | null
    sector?:           string | null
    sort?:             AdSortType
    showSaved?:        boolean
    showFollowedOnly?: boolean
  }

  interface AdsListParams {
    filters?: AdsFilters
    limit?:   number
    offset?:  number
  }

  interface AdCreatePayload {
    company_name: string
    logo_url?:    string | null
    media_type?:  AdMediaType
    media_url?:   string | null
    description:  string
    cta_label:    string
    cta_url:      string
    language?:    string
    sector?:      string
  }

  interface AdInteractPayload {
    ad_id:        string
    type:         AdInteractionType
    active:       boolean
    snooze_until?: number
  }

  interface AdCommentPayload {
    ad_id:   string
    content: string
  }

  interface EnterpriseRequestPayload {
    company_name:  string
    logo_url?:     string | null
    description:   string
    documents_ref?: string | null
  }

  interface AdsSettings {
    preferred_language:           string
    alert_new_ads:                boolean
    alert_followed_enterprises:   boolean
    hidden_enterprise_pubkeys:    string[]
  }

  // ── Window API (contextBridge) ──────────────────────────────────────────────
  interface Window {
    koon: {
      window: {
        minimize: () => void
        maximize: () => void
        close:    () => void
      }
      identity: {
        generate:   () => Promise<{ pubkey: string; sigPubkey: string; mnemonic: string }>
        import:     (mnemonic: string) => Promise<{ pubkey: string; sigPubkey: string; mnemonic: string }>
        getCurrent: () => Promise<{ pubkey: string; sigPubkey: string; mnemonic: string } | null>
        clear:      () => Promise<boolean>
      }
      contacts: {
        list:   () => Promise<Contact[]>
        add:    (pubkey: string, nickname: string) => Promise<Contact[]>
        remove: (pubkey: string) => Promise<Contact[]>
      }
      messages: {
        list:      (contactPubkey: string) => Promise<Message[]>
        send:      (contactPubkey: string, plaintext: string) => Promise<Message>
        onReceive: (cb: (msg: Message) => void) => () => void
      }
      network: {
        getStatus:      () => Promise<string>
        connect:        (relayUrl: string) => Promise<boolean>
        onStatusChange: (cb: (status: string) => void) => () => void
      }
      ads: {
        list:         (params: AdsListParams) => Promise<Ad[]>
        create:       (payload: AdCreatePayload) => Promise<{ id: string }>
        getDetail:    (id: string) => Promise<AdDetail | null>
        interact:     (payload: AdInteractPayload) => Promise<{ success: boolean }>
        snooze:       (adId: string, scheduledAt: number) => Promise<{ success: boolean }>
        comment:      (payload: AdCommentPayload) => Promise<AdComment>
        getComments:  (adId: string, limit?: number, offset?: number) => Promise<AdComment[]>
        clearHistory: () => Promise<{ success: boolean }>
        getSettings:  () => Promise<AdsSettings>
        saveSettings: (settings: Partial<AdsSettings>) => Promise<{ success: boolean }>
      }
      enterprise: {
        request:    (payload: EnterpriseRequestPayload) => Promise<{ status: BadgeStatus }>
        getProfile: (pubkey: string) => Promise<EnterpriseProfile | null>
        list:       () => Promise<EnterpriseProfile[]>
        follow:     (enterprisePubkey: string) => Promise<{ followed: string[] }>
        unfollow:   (enterprisePubkey: string) => Promise<{ followed: string[] }>
        getFollowed:() => Promise<string[]>
      }
    }
  }
}
