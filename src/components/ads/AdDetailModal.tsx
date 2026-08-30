import { useEffect, useState } from 'react'
import { useEnterpriseStore } from '../../store/enterpriseStore'
import { useContactsStore } from '../../store/contactsStore'
import AdComments from './AdComments'
import { shortPubkey, formatDate } from '../../lib/utils'

interface Props {
  adId: string
  onClose: () => void
  onViewCompany: (pubkey: string) => void
}

const SNOOZE_OPTIONS = [
  { label: 'Dans 1h',        ms: 60 * 60 * 1000 },
  { label: 'Demain',         ms: 24 * 60 * 60 * 1000 },
  { label: 'Dans 1 semaine', ms: 7 * 24 * 60 * 60 * 1000 },
]

export default function AdDetailModal({ adId, onClose, onViewCompany }: Props) {
  const [detail, setDetail] = useState<AdDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [showSnooze, setShowSnooze] = useState(false)
  const { followedPubkeys, follow, unfollow } = useEnterpriseStore()
  const { addContact, contacts, selectContact } = useContactsStore()

  useEffect(() => {
    setLoading(true)
    window.koon.ads.getDetail(adId)
      .then((d) => { setDetail(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [adId])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const handleInteract = async (type: AdInteractionType, active: boolean) => {
    await window.koon.ads.interact({ ad_id: adId, type, active })
    // Refresh interactions
    const updated = await window.koon.ads.getDetail(adId)
    if (updated) setDetail(updated)
  }

  const handleSnooze = async (ms: number) => {
    await window.koon.ads.snooze(adId, Date.now() + ms)
    setShowSnooze(false)
    onClose()
  }

  const handleWriteToCompany = async () => {
    if (!detail?.enterprise) return
    const ep = detail.enterprise
    const exists = contacts.find((c) => c.pubkey === ep.pubkey)
    if (!exists) await addContact(ep.pubkey, ep.company_name)
    selectContact(ep.pubkey)
    onClose()
  }

  const isLiked  = detail?.userInteractions?.includes('like') ?? false
  const isSaved  = detail?.userInteractions?.includes('save') ?? false
  const isFollowed = detail?.enterprise ? followedPubkeys.includes(detail.enterprise.pubkey) : false

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl w-full max-w-2xl max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog" aria-modal="true" aria-label="Détail de l'annonce"
      >
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-7 h-7 border-2 border-[#7c3aed] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !detail ? (
          <div className="p-8 text-center text-[#6b7280] text-sm">Annonce introuvable.</div>
        ) : (
          <>
            {/* Header entreprise */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#2a2a2a] sticky top-0 bg-[#1a1a1a] z-10">
              <button
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                onClick={() => { onViewCompany(detail.author_pubkey); onClose() }}
                aria-label={`Voir le profil de ${detail.company_name}`}
              >
                {detail.logo_url ? (
                  <img src={detail.logo_url} alt={detail.company_name}
                    className="w-9 h-9 rounded-full object-cover bg-[#2a2a2a]" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-[#7c3aed]/20 flex items-center justify-center text-[#7c3aed] text-xs font-bold">
                    {detail.company_name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-white">{detail.company_name}</p>
                    {detail.enterprise?.badge_status === 'verified' && (
                      <span className="text-[10px] text-[#7c3aed] border border-[#7c3aed]/40 rounded-full px-1.5 py-0.5">✓</span>
                    )}
                  </div>
                  <p className="text-xs text-[#6b7280]">{formatDate(detail.created_at)}</p>
                </div>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => isFollowed ? unfollow(detail.author_pubkey) : follow(detail.author_pubkey)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                    isFollowed
                      ? 'border-[#2a2a2a] text-[#6b7280] hover:border-red-500 hover:text-red-400'
                      : 'border-[#7c3aed]/50 text-[#7c3aed] hover:bg-[#7c3aed]/10'
                  }`}
                  aria-label={isFollowed ? 'Se désabonner' : 'Suivre'}
                >
                  {isFollowed ? 'Suivi ✓' : '+ Suivre'}
                </button>
                <button onClick={onClose} className="text-[#6b7280] hover:text-white p-1" aria-label="Fermer">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 1l12 12M13 1L1 13"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Média */}
            {detail.media_url && detail.media_type !== 'none' && (
              <div className="aspect-video bg-[#0d0d0d]">
                {detail.media_type === 'video' ? (
                  <video src={detail.media_url} controls className="w-full h-full object-cover"
                    aria-label="Vidéo de l'annonce" />
                ) : (
                  <img src={detail.media_url} alt={`Visuel ${detail.company_name}`}
                    className="w-full h-full object-cover" />
                )}
              </div>
            )}

            <div className="p-5 space-y-5">
              {/* Description */}
              <p className="text-sm text-[#d1d5db] leading-relaxed">{detail.description}</p>

              {/* CTA */}
              <a
                href={detail.cta_url} target="_blank" rel="noopener noreferrer"
                className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
                aria-label={detail.cta_label}
              >
                {detail.cta_label}
              </a>

              {/* Stats */}
              <div className="flex items-center gap-5 text-xs text-[#6b7280] border-t border-b border-[#2a2a2a] py-3">
                <span>👁 {detail.views_count} vues</span>
                <span>❤ {detail.likes_count} j'aime</span>
                <span>💬 {detail.comments_count} commentaires</span>
                {detail.sector && <span className="text-[#7c3aed]">{detail.sector}</span>}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-2">
                <ActionBtn active={isLiked} onClick={() => handleInteract('like', !isLiked)}
                  aria-label={isLiked ? 'Retirer le like' : 'Liker'}>
                  {isLiked ? '❤️' : '🤍'} J'aime
                </ActionBtn>
                <ActionBtn active={isSaved} onClick={() => handleInteract('save', !isSaved)}
                  aria-label={isSaved ? 'Retirer des favoris' : 'Mettre en favori'}>
                  {isSaved ? '🔖' : '🔖'} {isSaved ? 'Sauvegardé' : 'Sauvegarder'}
                </ActionBtn>
                <ActionBtn onClick={handleWriteToCompany} aria-label="Écrire à l'entreprise">
                  ✉️ Écrire à l'entreprise
                </ActionBtn>
                {/* Snooze */}
                <div className="relative">
                  <ActionBtn onClick={() => setShowSnooze(!showSnooze)} aria-label="Me rappeler plus tard">
                    ⏰ Rappel
                  </ActionBtn>
                  {showSnooze && (
                    <div className="absolute left-0 top-9 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg shadow-xl z-20 min-w-[150px] py-1">
                      {SNOOZE_OPTIONS.map((opt) => (
                        <button key={opt.label} onClick={() => handleSnooze(opt.ms)}
                          className="w-full text-left px-3 py-2 text-xs text-[#d1d5db] hover:bg-[#2a2a2a] transition-colors">
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Certifications */}
              {detail.enterprise?.badge_status === 'verified' && (
                <div className="bg-[#0d0d0d] rounded-lg p-3 border border-[#2a2a2a]">
                  <p className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-2">
                    🏆 Certifications
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-[#7c3aed]/10 text-[#7c3aed] border border-[#7c3aed]/20 rounded-full px-2 py-0.5">
                      ✓ Identité vérifiée
                    </span>
                    {detail.enterprise.documents_ref && (
                      <span className="text-xs bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20 rounded-full px-2 py-0.5">
                        ✓ Documents officiels
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Comments */}
              <AdComments adId={adId} />
            </div>
          </>
        )}
      </div>

      {/* Close snooze on outside */}
      {showSnooze && (
        <div className="fixed inset-0 z-10" onClick={() => setShowSnooze(false)} />
      )}
    </div>
  )
}

function ActionBtn({ children, active, onClick, 'aria-label': ariaLabel }: {
  children: React.ReactNode
  active?: boolean
  onClick: () => void
  'aria-label': string
}) {
  return (
    <button
      onClick={onClick}
      className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
        active
          ? 'bg-[#7c3aed]/20 border-[#7c3aed]/40 text-[#7c3aed]'
          : 'bg-[#0d0d0d] border-[#2a2a2a] text-[#9ca3af] hover:border-[#7c3aed]/30 hover:text-[#7c3aed]'
      }`}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  )
}
