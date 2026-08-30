import { useState } from 'react'
import { cn, formatDate } from '../../lib/utils'
import { useAdsStore } from '../../store/adsStore'

interface Props {
  ad: Ad
  userInteractions?: AdInteractionType[]
  onSelect: (id: string) => void
  onViewCompany?: (pubkey: string) => void
}

const SNOOZE_OPTIONS = [
  { label: 'Dans 1h',      ms: 60 * 60 * 1000 },
  { label: 'Demain',       ms: 24 * 60 * 60 * 1000 },
  { label: 'Dans 1 semaine', ms: 7 * 24 * 60 * 60 * 1000 },
]

export default function AdCard({ ad, userInteractions = [], onSelect, onViewCompany }: Props) {
  const { interact } = useAdsStore()
  const [showSnoozeMenu, setShowSnoozeMenu] = useState(false)
  const [showMoreMenu, setShowMoreMenu] = useState(false)

  const isLiked   = userInteractions.includes('like')
  const isSaved   = userInteractions.includes('save')

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    interact(ad.id, 'like', !isLiked)
  }

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation()
    interact(ad.id, 'save', !isSaved)
  }

  const handleSnooze = (e: React.MouseEvent, ms: number) => {
    e.stopPropagation()
    interact(ad.id, 'snooze', true, Date.now() + ms)
    setShowSnoozeMenu(false)
    setShowMoreMenu(false)
  }

  return (
    <article
      className="rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] overflow-hidden transition-all hover:border-[#3a3a3a] hover:shadow-lg hover:shadow-black/40 cursor-pointer"
      onClick={() => onSelect(ad.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(ad.id)}
      aria-label={`Annonce de ${ad.company_name}`}
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <button
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          onClick={(e) => { e.stopPropagation(); onViewCompany?.(ad.author_pubkey) }}
          aria-label={`Voir le profil de ${ad.company_name}`}
        >
          {ad.logo_url ? (
            <img src={ad.logo_url} alt={ad.company_name} className="w-8 h-8 rounded-full object-cover bg-[#2a2a2a]" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#7c3aed]/20 flex items-center justify-center text-[#7c3aed] text-xs font-bold">
              {ad.company_name.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div className="text-left">
            <p className="text-sm font-semibold text-white leading-none">{ad.company_name}</p>
            <p className="text-xs text-[#6b7280] mt-0.5">{formatDate(ad.created_at)}</p>
          </div>
        </button>
        <div className="flex items-center gap-2">
          {ad.sector && (
            <span className="text-xs text-[#7c3aed] border border-[#7c3aed]/30 rounded-full px-2 py-0.5">
              {ad.sector}
            </span>
          )}
          {/* More menu */}
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setShowMoreMenu(!showMoreMenu); setShowSnoozeMenu(false) }}
              className="w-7 h-7 flex items-center justify-center rounded text-[#6b7280] hover:text-white hover:bg-[#2a2a2a] transition-colors"
              aria-label="Plus d'options"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/>
              </svg>
            </button>
            {showMoreMenu && (
              <div className="absolute right-0 top-8 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg shadow-xl z-20 min-w-[160px] py-1" onClick={(e) => e.stopPropagation()}>
                <button onClick={(e) => { e.stopPropagation(); setShowSnoozeMenu(!showSnoozeMenu) }}
                  className="w-full text-left px-3 py-2 text-xs text-[#d1d5db] hover:bg-[#2a2a2a] transition-colors flex items-center gap-2">
                  ⏰ Me rappeler plus tard
                </button>
                {showSnoozeMenu && SNOOZE_OPTIONS.map((opt) => (
                  <button key={opt.label} onClick={(e) => handleSnooze(e, opt.ms)}
                    className="w-full text-left px-5 py-1.5 text-xs text-[#9ca3af] hover:bg-[#2a2a2a] transition-colors">
                    {opt.label}
                  </button>
                ))}
                <button onClick={(e) => { e.stopPropagation(); onViewCompany?.(ad.author_pubkey); setShowMoreMenu(false) }}
                  className="w-full text-left px-3 py-2 text-xs text-[#d1d5db] hover:bg-[#2a2a2a] transition-colors flex items-center gap-2">
                  🏢 Visiter l'entreprise
                </button>
                <button onClick={(e) => { e.stopPropagation(); interact(ad.id, 'save', !isSaved); setShowMoreMenu(false) }}
                  className="w-full text-left px-3 py-2 text-xs text-[#d1d5db] hover:bg-[#2a2a2a] transition-colors flex items-center gap-2">
                  {isSaved ? '🔖 Retirer des favoris' : '🔖 Mettre en favori'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Media ── */}
      {ad.media_url && ad.media_type !== 'none' && (
        <div className="aspect-video w-full bg-[#0d0d0d] overflow-hidden">
          {ad.media_type === 'video' ? (
            <video
              src={ad.media_url}
              controls
              className="w-full h-full object-cover"
              onClick={(e) => e.stopPropagation()}
              aria-label="Vidéo de l'annonce"
            />
          ) : (
            <img
              src={ad.media_url}
              alt={`Visuel de ${ad.company_name}`}
              className="w-full h-full object-cover"
            />
          )}
        </div>
      )}

      {/* ── Body ── */}
      <div className="px-4 py-3">
        <p className="text-sm text-[#d1d5db] line-clamp-2 leading-relaxed">{ad.description}</p>
      </div>

      {/* ── Footer ── */}
      <div className="px-4 pb-3 flex items-center justify-between gap-3">
        <a
          href={ad.cta_url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors"
          aria-label={ad.cta_label}
        >
          {ad.cta_label}
        </a>
        <div className="flex items-center gap-1 text-xs text-[#6b7280]">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
          </svg>
          <span>{ad.views_count}</span>
        </div>
      </div>

      {/* ── Actions ── */}
      <div className="px-4 pb-4 border-t border-[#2a2a2a] pt-3 flex items-center gap-4">
        <ActionBtn
          icon={<HeartIcon filled={isLiked} />}
          label={`${ad.likes_count} j'aime`}
          active={isLiked}
          onClick={handleLike}
          aria={isLiked ? 'Retirer le like' : 'Liker'}
        />
        <ActionBtn
          icon={<CommentIcon />}
          label={`${ad.comments_count}`}
          onClick={(e) => { e.stopPropagation(); onSelect(ad.id) }}
          aria="Voir les commentaires"
        />
        <ActionBtn
          icon={<BookmarkIcon filled={isSaved} />}
          label="Favori"
          active={isSaved}
          onClick={handleSave}
          aria={isSaved ? 'Retirer des favoris' : 'Mettre en favori'}
        />
        <div className="ml-auto">
          <ActionBtn
            icon={<ShareIcon />}
            label="Écrire"
            onClick={(e) => { e.stopPropagation(); onSelect(ad.id) }}
            aria="Écrire à l'entreprise"
          />
        </div>
      </div>

      {/* Close menus on outside click */}
      {(showMoreMenu || showSnoozeMenu) && (
        <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setShowMoreMenu(false); setShowSnoozeMenu(false) }} />
      )}
    </article>
  )
}

function ActionBtn({ icon, label, active, onClick, aria }: {
  icon: React.ReactNode; label: string; active?: boolean
  onClick: (e: React.MouseEvent) => void; aria: string
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 text-xs transition-colors',
        active ? 'text-[#7c3aed]' : 'text-[#6b7280] hover:text-[#9ca3af]'
      )}
      aria-label={aria}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}

function HeartIcon({ filled }: { filled: boolean }) {
  return filled
    ? <svg width="14" height="14" viewBox="0 0 24 24" fill="#7c3aed" stroke="#7c3aed" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
    : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
}

function CommentIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
}

function BookmarkIcon({ filled }: { filled: boolean }) {
  return filled
    ? <svg width="14" height="14" viewBox="0 0 24 24" fill="#7c3aed" stroke="#7c3aed" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
    : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
}

function ShareIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
}
