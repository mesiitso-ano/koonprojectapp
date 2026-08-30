import { useState } from 'react'
import { useIdentityStore } from '../store/identityStore'
import { copyToClipboard, shortPubkey } from '../lib/utils'

interface Props {
  onClose: () => void
}

export default function IdentityPanel({ onClose }: Props) {
  const { identity, clearIdentity } = useIdentityStore()
  const [showMnemonic, setShowMnemonic] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const [confirmClear, setConfirmClear] = useState(false)

  const copy = async (text: string, label: string) => {
    await copyToClipboard(text)
    setCopied(label)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleClear = async () => {
    if (!confirmClear) {
      setConfirmClear(true)
      return
    }
    await clearIdentity()
    onClose()
  }

  if (!identity) return null

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-koon-surface border border-koon-border rounded-lg p-6 w-full max-w-lg mx-4"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Mon identité"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-koon-text">Mon identité</h2>
          <button onClick={onClose} className="text-koon-muted hover:text-koon-text" aria-label="Fermer">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 1l12 12M13 1L1 13" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          {/* Pubkey */}
          <div>
            <label className="block text-xs text-koon-muted mb-1">Clé publique X25519 (à partager)</label>
            <div className="flex gap-2">
              <div className="flex-1 bg-koon-bg border border-koon-border rounded px-3 py-2 font-mono text-xs text-koon-text break-all">
                {identity.pubkey}
              </div>
              <button
                onClick={() => copy(identity.pubkey, 'pubkey')}
                className="px-3 py-2 text-xs bg-koon-border hover:bg-koon-border/70 text-koon-muted hover:text-koon-text rounded transition-colors shrink-0"
              >
                {copied === 'pubkey' ? '✓' : 'Copier'}
              </button>
            </div>
          </div>

          {/* Sig pubkey */}
          <div>
            <label className="block text-xs text-koon-muted mb-1">Clé publique Ed25519 (signature)</label>
            <div className="flex gap-2">
              <div className="flex-1 bg-koon-bg border border-koon-border rounded px-3 py-2 font-mono text-xs text-koon-text break-all">
                {identity.sigPubkey}
              </div>
              <button
                onClick={() => copy(identity.sigPubkey, 'sigpubkey')}
                className="px-3 py-2 text-xs bg-koon-border hover:bg-koon-border/70 text-koon-muted hover:text-koon-text rounded transition-colors shrink-0"
              >
                {copied === 'sigpubkey' ? '✓' : 'Copier'}
              </button>
            </div>
          </div>

          {/* Mnemonic */}
          <div>
            <label className="block text-xs text-koon-muted mb-1">Phrase de récupération (12 mots — CONFIDENTIEL)</label>
            <div className="bg-koon-bg border border-koon-border rounded px-3 py-2">
              {showMnemonic ? (
                <div className="flex gap-2 items-start">
                  <p className="flex-1 font-mono text-sm text-koon-warning break-words">{identity.mnemonic}</p>
                  <button
                    onClick={() => copy(identity.mnemonic, 'mnemonic')}
                    className="px-3 py-1 text-xs bg-koon-border hover:bg-koon-border/70 text-koon-muted hover:text-koon-text rounded transition-colors shrink-0"
                  >
                    {copied === 'mnemonic' ? '✓' : 'Copier'}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowMnemonic(true)}
                  className="text-xs text-koon-muted hover:text-koon-warning transition-colors"
                >
                  🔒 Cliquer pour révéler
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Clear identity */}
        <div className="mt-6 pt-4 border-t border-koon-border">
          <button
            onClick={handleClear}
            className="text-xs text-koon-danger hover:text-red-400 transition-colors"
          >
            {confirmClear ? '⚠️ Confirmer — effacer mon identité' : 'Effacer mon identité de cet appareil'}
          </button>
          {confirmClear && (
            <button
              onClick={() => setConfirmClear(false)}
              className="ml-4 text-xs text-koon-muted hover:text-koon-text transition-colors"
            >
              Annuler
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
