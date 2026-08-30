import { useEffect, useState } from 'react'
import { useAdsStore } from '../../store/adsStore'
import { useAdsSettingsStore } from '../../store/adsSettingsStore'
import { useEnterpriseStore } from '../../store/enterpriseStore'
import { useIdentityStore } from '../../store/identityStore'
import AdCard from './AdCard'
import AdFilters from './AdFilters'
import AdDetailModal from './AdDetailModal'
import AdCreateForm from './AdCreateForm'
import AdsSettings from './AdsSettings'
import CompanyProfile from './CompanyProfile'
import EnterpriseRequestModal from './EnterpriseRequestModal'

export default function AdsSection() {
  const { ads, isLoading, fetchAds, selectAd, selectedAdId } = useAdsStore()
  const { load: loadSettings } = useAdsSettingsStore()
  const { profile, followedPubkeys, loadFollowed } = useEnterpriseStore()
  const { identity } = useIdentityStore()

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [companyPubkey, setCompanyPubkey] = useState<string | null>(null)
  const [showEnterpriseRequest, setShowEnterpriseRequest] = useState(false)

  const isVerified = profile?.badge_status === 'verified'

  useEffect(() => {
    fetchAds()
    loadSettings()
    if (identity) {
      loadFollowed()
      window.koon.enterprise.getProfile(identity.pubkey)
        .then((p) => {
          if (p) useEnterpriseStore.setState({ profile: p })
        })
        .catch(() => {})
    }
  }, [identity?.pubkey])

  return (
    <div className="flex flex-col h-full bg-[#0d0d0d]">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[#2a2a2a] bg-[#1a1a1a] shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-white">📣 Publicités</span>
          <span className="text-xs text-[#4b5563] bg-[#0d0d0d] rounded-full px-2 py-0.5">
            {ads.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Bouton compte entreprise si pas encore */}
          {!isVerified && (
            <button
              onClick={() => setShowEnterpriseRequest(true)}
              className="text-xs text-[#7c3aed] border border-[#7c3aed]/30 rounded-lg px-3 py-1.5 hover:bg-[#7c3aed]/10 transition-colors"
              aria-label="Passer en compte entreprise"
            >
              🏢 Compte entreprise
            </button>
          )}
          {/* Bouton créer annonce si vérifié */}
          {isVerified && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="text-xs bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-lg px-3 py-1.5 transition-colors"
              aria-label="Créer une annonce"
            >
              + Créer une annonce
            </button>
          )}
          {/* Paramètres */}
          <button
            onClick={() => setShowSettings(true)}
            className="w-7 h-7 flex items-center justify-center text-[#6b7280] hover:text-white hover:bg-[#2a2a2a] rounded transition-colors"
            aria-label="Paramètres des publicités"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Filters */}
      <AdFilters />

      {/* Feed */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-7 h-7 border-2 border-[#7c3aed] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : ads.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="text-5xl mb-4">📣</div>
            <h3 className="text-base font-semibold text-white mb-2">Aucune annonce</h3>
            <p className="text-sm text-[#4b5563] max-w-xs">
              Aucune annonce ne correspond à tes filtres. Modifie les filtres ou reviens plus tard.
            </p>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto space-y-4">
            {ads.map((ad) => (
              <AdCard
                key={ad.id}
                ad={ad}
                onSelect={(id) => selectAd(id)}
                onViewCompany={(pk) => setCompanyPubkey(pk)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedAdId && (
        <AdDetailModal
          adId={selectedAdId}
          onClose={() => selectAd(null)}
          onViewCompany={(pk) => { selectAd(null); setCompanyPubkey(pk) }}
        />
      )}
      {showCreateForm && <AdCreateForm onClose={() => setShowCreateForm(false)} />}
      {showSettings && <AdsSettings onClose={() => setShowSettings(false)} />}
      {companyPubkey && (
        <CompanyProfile
          pubkey={companyPubkey}
          onClose={() => setCompanyPubkey(null)}
          onSelectAd={(id) => { setCompanyPubkey(null); selectAd(id) }}
        />
      )}
      {showEnterpriseRequest && (
        <EnterpriseRequestModal onClose={() => setShowEnterpriseRequest(false)} />
      )}
    </div>
  )
}
