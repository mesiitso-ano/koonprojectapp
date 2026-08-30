import { useState } from 'react'
import { useIdentityStore } from '../store/identityStore'

type Tab = 'generate' | 'import'

export default function SetupPage() {
  const { generateIdentity, importIdentity, isLoading, error } = useIdentityStore()
  const [tab, setTab] = useState<Tab>('generate')
  const [mnemonic, setMnemonic] = useState('')
  const [mnemonicError, setMnemonicError] = useState('')

  const handleGenerate = async () => {
    await generateIdentity()
  }

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault()
    setMnemonicError('')
    const words = mnemonic.trim().split(/\s+/)
    if (words.length !== 12 && words.length !== 24) {
      setMnemonicError('La phrase doit contenir 12 ou 24 mots.')
      return
    }
    await importIdentity(mnemonic.trim())
  }

  return (
    <div className="flex items-center justify-center h-full bg-koon-bg">
      <div className="w-full max-w-md px-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🔐</div>
          <h1 className="text-3xl font-bold text-koon-accent tracking-widest">KOON</h1>
          <p className="text-koon-muted text-sm mt-2">Chat chiffré bout-en-bout · BIP39 · X25519</p>
        </div>

        {/* Card */}
        <div className="bg-koon-surface border border-koon-border rounded-xl overflow-hidden">
          {/* Tabs */}
          <div className="flex">
            <button
              onClick={() => setTab('generate')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                tab === 'generate'
                  ? 'bg-koon-accent/10 text-koon-accent border-b-2 border-koon-accent'
                  : 'text-koon-muted hover:text-koon-text border-b border-koon-border'
              }`}
            >
              Nouvelle identité
            </button>
            <button
              onClick={() => setTab('import')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                tab === 'import'
                  ? 'bg-koon-accent/10 text-koon-accent border-b-2 border-koon-accent'
                  : 'text-koon-muted hover:text-koon-text border-b border-koon-border'
              }`}
            >
              Importer une seed
            </button>
          </div>

          <div className="p-6">
            {tab === 'generate' ? (
              <div className="text-center">
                <p className="text-sm text-koon-muted mb-6 leading-relaxed">
                  Génère une nouvelle identité avec une phrase mnémonique de 12 mots.
                  <br />
                  <span className="text-koon-warning text-xs">Note ta phrase de récupération — elle sera affichée une seule fois.</span>
                </p>
                <button
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className="w-full py-3 bg-koon-accent hover:bg-koon-accent-hover text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Génération…' : 'Générer mon identité'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleImport} className="space-y-4">
                <div>
                  <label htmlFor="mnemonic" className="block text-sm text-koon-muted mb-2">
                    Phrase mnémonique BIP39 (12 ou 24 mots)
                  </label>
                  <textarea
                    id="mnemonic"
                    value={mnemonic}
                    onChange={(e) => setMnemonic(e.target.value)}
                    placeholder="mot1 mot2 mot3 mot4 mot5 mot6 mot7 mot8 mot9 mot10 mot11 mot12"
                    rows={4}
                    className="w-full bg-koon-bg border border-koon-border rounded-lg px-3 py-2 text-sm text-koon-text placeholder-koon-muted focus:outline-none focus:border-koon-accent font-mono resize-none"
                    autoFocus
                  />
                  {mnemonicError && (
                    <p className="text-koon-danger text-xs mt-1">{mnemonicError}</p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isLoading || !mnemonic.trim()}
                  className="w-full py-3 bg-koon-accent hover:bg-koon-accent-hover text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Import…' : 'Restaurer mon identité'}
                </button>
              </form>
            )}

            {error && (
              <p className="text-koon-danger text-xs mt-4 text-center">{error}</p>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-koon-muted mt-4">
          Tes clés ne quittent jamais ton appareil.
        </p>
      </div>
    </div>
  )
}
