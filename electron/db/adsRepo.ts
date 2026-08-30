import crypto from 'crypto'
import { getDb } from './database'

// ── Types ─────────────────────────────────────────────────────────────────────

export type AdInteractionType = 'like' | 'save' | 'history' | 'snooze'
export type BadgeStatus = 'none' | 'pending' | 'verified' | 'rejected'
export type AdStatus = 'active' | 'paused' | 'deleted'
export type AdMediaType = 'image' | 'video' | 'none'
export type AdSortType = 'date_desc' | 'date_asc' | 'popularity'

export interface Ad {
  id: string
  author_pubkey: string
  company_name: string
  logo_url: string | null
  media_type: AdMediaType
  media_url: string | null
  description: string
  cta_label: string
  cta_url: string
  language: string
  sector: string
  created_at: number
  status: AdStatus
  views_count: number
  likes_count: number
  comments_count: number
}

export interface AdComment {
  id: string
  ad_id: string
  author_pubkey: string
  content: string
  created_at: number
}

export interface EnterpriseProfile {
  pubkey: string
  company_name: string
  logo_url: string | null
  description: string
  badge_status: BadgeStatus
  documents_ref: string | null
  created_at: number
}

export interface AdsSettings {
  preferred_language: string
  alert_new_ads: boolean
  alert_followed_enterprises: boolean
  hidden_enterprise_pubkeys: string[]
}

export interface AdsListParams {
  filters?: {
    language?: string | null
    sector?: string | null
    sort?: AdSortType
    showSaved?: boolean
    showFollowedOnly?: boolean
  }
  userPubkey?: string
  limit?: number
  offset?: number
}

export interface AdCreatePayload {
  author_pubkey: string
  company_name: string
  logo_url?: string | null
  media_type?: AdMediaType
  media_url?: string | null
  description: string
  cta_label: string
  cta_url: string
  language?: string
  sector?: string
}

export interface AdInteractPayload {
  ad_id: string
  type: AdInteractionType
  active: boolean
  snooze_until?: number
}

export interface AdCommentPayload {
  ad_id: string
  content: string
}

export interface EnterpriseRequestPayload {
  company_name: string
  logo_url?: string | null
  description: string
  documents_ref?: string | null
}

// ── Ads CRUD ──────────────────────────────────────────────────────────────────

export function listAds(params: AdsListParams): Ad[] {
  const db = getDb()
  const {
    filters = {},
    userPubkey,
    limit = 20,
    offset = 0,
  } = params

  const {
    language,
    sector,
    sort = 'date_desc',
    showSaved = false,
    showFollowedOnly = false,
  } = filters

  const conditions: string[] = ["a.status = 'active'"]
  const bindings: Record<string, unknown> = { limit, offset }

  if (language) {
    conditions.push('a.language = @language')
    bindings.language = language
  }

  if (sector) {
    conditions.push('a.sector = @sector')
    bindings.sector = sector
  }

  if (showSaved && userPubkey) {
    conditions.push(`EXISTS (
      SELECT 1 FROM ad_interactions ai
      WHERE ai.ad_id = a.id AND ai.user_pubkey = @userPubkey AND ai.type = 'save'
    )`)
    bindings.userPubkey = userPubkey
  }

  if (showFollowedOnly && userPubkey) {
    conditions.push(`EXISTS (
      SELECT 1 FROM ad_follows af
      WHERE af.enterprise_pubkey = a.author_pubkey AND af.user_pubkey = @userPubkey
    )`)
    if (!bindings.userPubkey) bindings.userPubkey = userPubkey
  }

  const orderBy = sort === 'date_asc'
    ? 'a.created_at ASC'
    : sort === 'popularity'
    ? 'likes_count DESC, views_count DESC'
    : 'a.created_at DESC'

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

  const rows = db.prepare(`
    SELECT
      a.*,
      (SELECT COUNT(*) FROM ad_interactions WHERE ad_id = a.id AND type = 'history') AS views_count,
      (SELECT COUNT(*) FROM ad_interactions WHERE ad_id = a.id AND type = 'like')    AS likes_count,
      (SELECT COUNT(*) FROM ad_comments     WHERE ad_id = a.id)                      AS comments_count
    FROM ads a
    ${where}
    ORDER BY ${orderBy}
    LIMIT @limit OFFSET @offset
  `).all(bindings) as Ad[]

  return rows
}

export function createAd(payload: AdCreatePayload): string {
  const db = getDb()
  const id = crypto.randomUUID()

  db.prepare(`
    INSERT INTO ads (id, author_pubkey, company_name, logo_url, media_type, media_url,
                     description, cta_label, cta_url, language, sector)
    VALUES (@id, @author_pubkey, @company_name, @logo_url, @media_type, @media_url,
            @description, @cta_label, @cta_url, @language, @sector)
  `).run({
    id,
    author_pubkey: payload.author_pubkey,
    company_name: payload.company_name,
    logo_url: payload.logo_url ?? null,
    media_type: payload.media_type ?? 'none',
    media_url: payload.media_url ?? null,
    description: payload.description,
    cta_label: payload.cta_label,
    cta_url: payload.cta_url,
    language: payload.language ?? 'fr',
    sector: payload.sector ?? '',
  })

  return id
}

export function getAdDetail(id: string): Ad | null {
  const db = getDb()
  const row = db.prepare(`
    SELECT
      a.*,
      (SELECT COUNT(*) FROM ad_interactions WHERE ad_id = a.id AND type = 'history') AS views_count,
      (SELECT COUNT(*) FROM ad_interactions WHERE ad_id = a.id AND type = 'like')    AS likes_count,
      (SELECT COUNT(*) FROM ad_comments     WHERE ad_id = a.id)                      AS comments_count
    FROM ads a
    WHERE a.id = @id AND a.status != 'deleted'
  `).get({ id }) as Ad | undefined

  return row ?? null
}

// ── Interactions ──────────────────────────────────────────────────────────────

export function upsertInteraction(
  payload: AdInteractPayload,
  userPubkey: string
): void {
  const db = getDb()

  if (!payload.active) {
    db.prepare(`
      DELETE FROM ad_interactions
      WHERE ad_id = @ad_id AND user_pubkey = @userPubkey AND type = @type
    `).run({ ad_id: payload.ad_id, userPubkey, type: payload.type })
    return
  }

  const id = crypto.randomUUID()
  db.prepare(`
    INSERT INTO ad_interactions (id, ad_id, user_pubkey, type, snooze_until)
    VALUES (@id, @ad_id, @userPubkey, @type, @snooze_until)
    ON CONFLICT(ad_id, user_pubkey, type) DO UPDATE SET
      snooze_until = excluded.snooze_until,
      created_at   = unixepoch()
  `).run({
    id,
    ad_id: payload.ad_id,
    userPubkey,
    type: payload.type,
    snooze_until: payload.snooze_until ?? null,
  })
}

export function recordHistory(adId: string, userPubkey: string): void {
  upsertInteraction({ ad_id: adId, type: 'history', active: true }, userPubkey)
}

export function getUserInteractions(adId: string, userPubkey: string): AdInteractionType[] {
  const db = getDb()
  const rows = db.prepare(`
    SELECT type FROM ad_interactions
    WHERE ad_id = @adId AND user_pubkey = @userPubkey
  `).all({ adId, userPubkey }) as { type: AdInteractionType }[]
  return rows.map((r) => r.type)
}

// ── Comments ──────────────────────────────────────────────────────────────────

export function addComment(
  payload: AdCommentPayload,
  authorPubkey: string
): AdComment {
  const db = getDb()
  const id = crypto.randomUUID()

  db.prepare(`
    INSERT INTO ad_comments (id, ad_id, author_pubkey, content)
    VALUES (@id, @ad_id, @authorPubkey, @content)
  `).run({ id, ad_id: payload.ad_id, authorPubkey, content: payload.content })

  return db.prepare('SELECT * FROM ad_comments WHERE id = @id').get({ id }) as AdComment
}

export function getComments(
  adId: string,
  limit: number,
  offset: number
): AdComment[] {
  const db = getDb()
  return db.prepare(`
    SELECT * FROM ad_comments
    WHERE ad_id = @adId
    ORDER BY created_at DESC
    LIMIT @limit OFFSET @offset
  `).all({ adId, limit, offset }) as AdComment[]
}

// ── Enterprise profiles ───────────────────────────────────────────────────────

export function requestEnterprise(
  payload: EnterpriseRequestPayload,
  pubkey: string
): BadgeStatus {
  const db = getDb()

  db.prepare(`
    INSERT INTO enterprise_profiles (pubkey, company_name, logo_url, description, badge_status, documents_ref)
    VALUES (@pubkey, @company_name, @logo_url, @description, 'pending', @documents_ref)
    ON CONFLICT(pubkey) DO UPDATE SET
      company_name  = excluded.company_name,
      logo_url      = excluded.logo_url,
      description   = excluded.description,
      badge_status  = CASE WHEN badge_status = 'verified' THEN 'verified' ELSE 'pending' END,
      documents_ref = excluded.documents_ref
  `).run({
    pubkey,
    company_name: payload.company_name,
    logo_url: payload.logo_url ?? null,
    description: payload.description,
    documents_ref: payload.documents_ref ?? null,
  })

  const row = db.prepare('SELECT badge_status FROM enterprise_profiles WHERE pubkey = @pubkey')
    .get({ pubkey }) as { badge_status: BadgeStatus }
  return row.badge_status
}

export function getEnterpriseProfile(pubkey: string): EnterpriseProfile | null {
  const db = getDb()
  const row = db.prepare('SELECT * FROM enterprise_profiles WHERE pubkey = @pubkey')
    .get({ pubkey }) as EnterpriseProfile | undefined
  return row ?? null
}

export function listEnterprises(): EnterpriseProfile[] {
  const db = getDb()
  return db.prepare(
    "SELECT * FROM enterprise_profiles WHERE badge_status != 'rejected' ORDER BY company_name"
  ).all() as EnterpriseProfile[]
}

// ── Follows ───────────────────────────────────────────────────────────────────

export function followEnterprise(userPubkey: string, enterprisePubkey: string): void {
  const db = getDb()
  db.prepare(`
    INSERT OR IGNORE INTO ad_follows (user_pubkey, enterprise_pubkey)
    VALUES (@userPubkey, @enterprisePubkey)
  `).run({ userPubkey, enterprisePubkey })
}

export function unfollowEnterprise(userPubkey: string, enterprisePubkey: string): void {
  const db = getDb()
  db.prepare(`
    DELETE FROM ad_follows
    WHERE user_pubkey = @userPubkey AND enterprise_pubkey = @enterprisePubkey
  `).run({ userPubkey, enterprisePubkey })
}

export function getFollowedPubkeys(userPubkey: string): string[] {
  const db = getDb()
  const rows = db.prepare(
    'SELECT enterprise_pubkey FROM ad_follows WHERE user_pubkey = @userPubkey'
  ).all({ userPubkey }) as { enterprise_pubkey: string }[]
  return rows.map((r) => r.enterprise_pubkey)
}

// ── Settings ──────────────────────────────────────────────────────────────────

const DEFAULT_SETTINGS: AdsSettings = {
  preferred_language: 'fr',
  alert_new_ads: true,
  alert_followed_enterprises: true,
  hidden_enterprise_pubkeys: [],
}

export function getAdsSettings(userPubkey: string): AdsSettings {
  const db = getDb()
  const row = db.prepare('SELECT * FROM ads_settings WHERE user_pubkey = @userPubkey')
    .get({ userPubkey }) as {
      preferred_language: string
      alert_new_ads: number
      alert_followed_enterprises: number
      hidden_enterprise_pubkeys: string
    } | undefined

  if (!row) return { ...DEFAULT_SETTINGS }

  return {
    preferred_language: row.preferred_language,
    alert_new_ads: row.alert_new_ads === 1,
    alert_followed_enterprises: row.alert_followed_enterprises === 1,
    hidden_enterprise_pubkeys: JSON.parse(row.hidden_enterprise_pubkeys) as string[],
  }
}

export function saveAdsSettings(userPubkey: string, settings: Partial<AdsSettings>): void {
  const db = getDb()
  const current = getAdsSettings(userPubkey)
  const merged = { ...current, ...settings }

  db.prepare(`
    INSERT INTO ads_settings (user_pubkey, preferred_language, alert_new_ads,
                               alert_followed_enterprises, hidden_enterprise_pubkeys)
    VALUES (@userPubkey, @preferred_language, @alert_new_ads,
            @alert_followed_enterprises, @hidden_enterprise_pubkeys)
    ON CONFLICT(user_pubkey) DO UPDATE SET
      preferred_language          = excluded.preferred_language,
      alert_new_ads               = excluded.alert_new_ads,
      alert_followed_enterprises  = excluded.alert_followed_enterprises,
      hidden_enterprise_pubkeys   = excluded.hidden_enterprise_pubkeys
  `).run({
    userPubkey,
    preferred_language: merged.preferred_language,
    alert_new_ads: merged.alert_new_ads ? 1 : 0,
    alert_followed_enterprises: merged.alert_followed_enterprises ? 1 : 0,
    hidden_enterprise_pubkeys: JSON.stringify(merged.hidden_enterprise_pubkeys),
  })
}

// ── Snooze / Notifications ────────────────────────────────────────────────────

export function scheduleSnoozedAd(adId: string, userPubkey: string, scheduledAt: number): void {
  const db = getDb()
  const id = crypto.randomUUID()
  db.prepare(`
    INSERT INTO ad_notifications (id, user_pubkey, ad_id, type, scheduled_at)
    VALUES (@id, @userPubkey, @adId, 'new_ad', @scheduledAt)
  `).run({ id, userPubkey, adId, scheduledAt })
}

export function getPendingNotifications(userPubkey: string, now: number): {
  id: string; ad_id: string | null; type: string
}[] {
  const db = getDb()
  return db.prepare(`
    SELECT id, ad_id, type FROM ad_notifications
    WHERE user_pubkey = @userPubkey AND dismissed = 0 AND scheduled_at <= @now
  `).all({ userPubkey, now }) as { id: string; ad_id: string | null; type: string }[]
}

export function dismissNotification(id: string): void {
  const db = getDb()
  db.prepare('UPDATE ad_notifications SET dismissed = 1 WHERE id = @id').run({ id })
}

export function clearHistory(userPubkey: string): void {
  const db = getDb()
  db.prepare(`
    DELETE FROM ad_interactions WHERE user_pubkey = @userPubkey AND type = 'history'
  `).run({ userPubkey })
}
