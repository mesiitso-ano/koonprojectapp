import { useState } from 'react'
import { useContactsStore } from '../store/contactsStore'
import { isValidPubkey } from '../lib/utils'

interface Props {
  onClose: () => void
}

export default function AddContactModal({ onClose }: Props) {
  const { addContact } = useContactsStore()
  const [pubkey, setPubkey] = useState('')
  const [nickname, setNickname] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const trimmedPubkey = pubkey.trim()
    const trimmedNick = nickname.trim()

    if (!trimmedNick) {
      setError('Le surnom est requis.')
      return
    }
    if (!isValidPubkey(trimmedPubkey)) {
      setError('Pubkey invalide. Vérifie qu\'elle est au format base64.')
      return
    }

    setLoading(true)
    try {
      await addContact(trimmedPubkey, trimmedNick)
      onClose()
    } catch (e) {
      setError(String(e))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-koon-surface border border-koon-border rounded-lg p-6 w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Ajouter un contact"
      >
        <h2 className="text-lg font-semibold text-koon-text mb-4">Ajouter un contact</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nickname" className="block text-sm text-koon-muted mb-1">Surnom</label>
            <input
              id="nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Alice"
              className="w-full bg-koon-bg border border-koon-border rounded px-3 py-2 text-sm text-koon-text placeholder-koon-muted focus:outline-none focus:border-koon-accent"
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="pubkey" className="block text-sm text-koon-muted mb-1">Clé publique (base64)</label>
            <textarea
              id="pubkey"
              value={pubkey}
              onChange={(e) => setPubkey(e.target.value)}
              placeholder="Colle la pubkey X25519 de ton contact ici..."
              rows={3}
              className="w-full bg-koon-bg border border-koon-border rounded px-3 py-2 text-sm text-koon-text placeholder-koon-muted focus:outline-none focus:border-koon-accent font-mono resize-none"
            />
          </div>

          {error && (
            <p className="text-koon-danger text-xs">{error}</p>
          )}

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-koon-muted hover:text-koon-text transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm bg-koon-accent hover:bg-koon-accent-hover text-white rounded transition-colors disabled:opacity-50"
            >
              {loading ? 'Ajout...' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
