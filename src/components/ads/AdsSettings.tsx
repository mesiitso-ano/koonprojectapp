import { useEffect, useState } from 'react'
import { useAdsSettingsStore } from '../../store/adsSettingsStore'
import { useEnterpriseStore } from '../../store/enterpriseStore'

interface Props {
  onClose: () => void
}

const LANGUAGES = [
  { value: 'fr', label: 'Français' },
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'ar', label: 'العربية' },
  { value: '', label: 'Toutes' },
]

export default function AdsSettings({ onClose }: Props) {
  const { settings, load, save } = useAdsSettingsStore()
  const { followedPubkeys, unfollow, loadFollowed } = useEnterpriseStore()
  const [enterprises, setEnterprises] = useState<EnterpriseProfile[]>([])

  useEffect(() => {
    load()
    loadFollowed()
    window.koon.enterprise.list().then(setEnterprises).catch(() => {})
  }, [])

  const followedProfiles = enterprises.filter((e) => followedPubkeys.includes(e.pubkey))

  return (
    <div className="fixed inset-0 bg-black/70 flex items-end sm:items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-t-2xl sm:rounded-xl w-full sm:max-w-md max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog" aria-modal="true" aria-label="Paramètres des publicités"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#2a2a2a] sticky top-0 bg-[#1a1a1a]">
          <h2 className="text-base font-semibold text-white">Paramètres Publicités</h2>
          <button onClick={onClose} className="text-[#6b7280] hover:text-white" aria-label="Fermer">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 1l12 12M13 1L1 13"/>
            </svg>
          </button>
        </div>

        <div className="p-5 space-y-6">
          {/* Langue */}
          <Section title="🌐 Langue des publicités">
            <select
              value={settings.preferred_language}
              onChange={(e) => save({ preferred_language: e.target.value })}
              className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-[#d1d5db] focus:outline-none focus:border-[#7c3aed]"
              aria-label="Langue préférée"
            >
              {LANGUAGES.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
          </Section>

          {/* Alertes */}
          <Section title="🔔 Alertes & Notifications">
            <div className="space-y-3">
              <ToggleRow
                label="Nouvelles annonces"
                description="Recevoir une alerte pour chaque nouvelle publication"
                checked={settings.alert_new_ads}
                onChange={(v) => save({ alert_new_ads: v })}
              />
              <ToggleRow
                label="Entreprises suivies"
                description="Être notifié quand une entreprise suivie publie"
                checked={settings.alert_followed_enterprises}
                onChange={(v) => save({ alert_followed_enterprises: v })}
              />
            </div>
          </Section>

          {/* Abonnements */}
          <Section title="👥 Entreprises suivies">
            {followedProfiles.length === 0 ? (
              <p className="text-xs text-[#4b5563]">Tu ne suis aucune entreprise.</p>
            ) : (
              <div className="space-y-2">
                {followedProfiles.map((ep) => (
                  <div key={ep.pubkey} className="flex items-center justify-between bg-[#0d0d0d] rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2">
                      {ep.logo_url
                        ? <img src={ep.logo_url} alt={ep.company_name} className="w-7 h-7 rounded-full object-cover" />
                        : <div className="w-7 h-7 rounded-full bg-[#7c3aed]/20 flex items-center justify-center text-[#7c3aed] text-xs font-bold">{ep.company_name.slice(0, 2).toUpperCase()}</div>
                      }
                      <div>
                        <p className="text-xs font-medium text-[#d1d5db]">{ep.company_name}</p>
                        {ep.badge_status === 'verified' && <p className="text-[10px] text-[#7c3aed]">✓ Certifié</p>}
                      </div>
                    </div>
                    <button
                      onClick={() => unfollow(ep.pubkey)}
                      className="text-xs text-[#6b7280] hover:text-red-400 transition-colors"
                      aria-label={`Se désabonner de ${ep.company_name}`}
                    >
                      Se désabonner
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Section>

          {/* Entreprises masquées */}
          {settings.hidden_enterprise_pubkeys.length > 0 && (
            <Section title="🚫 Entreprises masquées">
              <div className="space-y-2">
                {settings.hidden_enterprise_pubkeys.map((pk) => (
                  <div key={pk} className="flex items-center justify-between bg-[#0d0d0d] rounded-lg px-3 py-2">
                    <p className="text-xs font-mono text-[#6b7280]">{pk.slice(0, 12)}…</p>
                    <button
                      onClick={() => save({ hidden_enterprise_pubkeys: settings.hidden_enterprise_pubkeys.filter((p) => p !== pk) })}
                      className="text-xs text-[#6b7280] hover:text-[#7c3aed] transition-colors"
                      aria-label="Démasquer"
                    >
                      Démasquer
                    </button>
                  </div>
                ))}
              </div>
            </Section>
          )}
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-3">{title}</h3>
      {children}
    </div>
  )
}

function ToggleRow({ label, description, checked, onChange }: {
  label: string; description: string; checked: boolean; onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm text-[#d1d5db]">{label}</p>
        <p className="text-xs text-[#4b5563] mt-0.5">{description}</p>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`shrink-0 w-10 h-5 rounded-full transition-colors relative ${checked ? 'bg-[#7c3aed]' : 'bg-[#2a2a2a]'}`}
        aria-label={label}
      >
        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </button>
    </div>
  )
}
