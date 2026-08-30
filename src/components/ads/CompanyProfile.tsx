import { useEffect, useState } from 'react'
import { useEnterpriseStore } from '../../store/enterpriseStore'
import AdCard from './AdCard'

interface Props {
  pubkey: string
  onClose: () => void
  onSelectAd: (id: string) => void
}

export default function CompanyProfile({ pubkey, onClose, onSelectAd }: Props) {
  const { profile, followedPubkeys, loadProfile, follow, unfollow } = useEnterpriseStore()
  const [ads, setAds] = useState<Ad[]>([])
  const isFollowed = followedPubkeys.includes(pubkey)

  useEffect(() => {
    loadProfile(pubkey)
    window.koon.ads
      .list({ filters: {}, limit: 6 })
      .then((all) => setAds(all.filter((a) => a.author_pubkey === pubkey)))
      .catch(() => {})
  }, [pubkey])

  const handleFollow = async () => {
    if (isFollowed) await unfollow(pubkey)
    else await follow(pubkey)
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog" aria-modal="true" aria-label={`Profil ${profile?.company_name ?? ''}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#2a2a2a] sticky top-0 bg-[#1a1a1a] z-10">
          <h2 className="text-base font-semibold text-white">Profil Entreprise</h2>
          <button onClick={onClose} className="text-[#6b7280] hover:text-white" aria-label="Fermer">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 1l12 12M13 1L1 13"/>
            </svg>
          </button>
        </div>

        {profile ? (
          <div className="p-5 space-y-6">
            {/* Identity */}
            <div className="flex items-start gap-4">
              {profile.logo_url ? (
                <img src={profile.logo_url} alt={profile.company_name}
                  className="w-16 h-16 rounded-full object-cover bg-[#2a2a2a] shrink-0" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-[#7c3aed]/20 flex items-center justify-center text-[#7c3aed] text-xl font-bold shrink-0">
                  {profile.company_name.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg font-bold text-white">{profile.company_name}</h3>
                  {profile.badge_status === 'verified' && (
                    <span className="text-xs text-[#7c3aed] border border-[#7c3aed]/40 rounded-full px-2 py-0.5">
                      ✓ Certifié
                    </span>
                  )}
                  {profile.badge_status === 'pending' && (
                    <span className="text-xs text-[#f59e0b] border border-[#f59e0b]/40 rounded-full px-2 py-0.5">
                      ⏳ Vérification en cours
                    </span>
                  )}
                </div>
                {profile.description && (
                  <p className="text-sm text-[#9ca3af] mt-1">{profile.description}</p>
                )}
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={handleFollow}
                    className={`text-xs px-4 py-1.5 rounded-lg border transition-colors ${
                      isFollowed
                        ? 'border-[#2a2a2a] text-[#6b7280] hover:border-red-500 hover:text-red-400'
                        : 'border-[#7c3aed] text-[#7c3aed] hover:bg-[#7c3aed]/10'
                    }`}
                    aria-label={isFollowed ? `Se désabonner de ${profile.company_name}` : `Suivre ${profile.company_name}`}
                  >
                    {isFollowed ? 'Suivi ✓' : '+ Suivre'}
                  </button>
                </div>
              </div>
            </div>

            {/* Certifications */}
            {profile.badge_status === 'verified' && (
              <div className="bg-[#0d0d0d] rounded-lg p-4 border border-[#2a2a2a]">
                <h4 className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-2">
                  🏆 Certifications
                </h4>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs bg-[#7c3aed]/10 text-[#7c3aed] border border-[#7c3aed]/20 rounded-full px-3 py-1">
                    ✓ Identité vérifiée
                  </span>
                  {profile.documents_ref && (
                    <span className="text-xs bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20 rounded-full px-3 py-1">
                      ✓ Documents officiels
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Recent ads */}
            {ads.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-3">
                  Annonces récentes ({ads.length})
                </h4>
                <div className="grid gap-3">
                  {ads.map((ad) => (
                    <AdCard key={ad.id} ad={ad} onSelect={onSelectAd} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-10 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-[#7c3aed] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    </div>
  )
}
