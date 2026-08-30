export default function EmptyChat() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8">
      <div className="text-4xl mb-4">🔐</div>
      <h2 className="text-xl font-semibold text-koon-text mb-2">Koon Chat</h2>
      <p className="text-sm text-koon-muted max-w-sm leading-relaxed">
        Chiffrement bout en bout avec X25519 + NaCl box.<br />
        Sélectionne un contact pour démarrer une conversation.
      </p>
      <div className="mt-6 grid grid-cols-3 gap-3 text-xs text-koon-muted">
        <div className="bg-koon-surface border border-koon-border rounded-lg p-3">
          <div className="text-koon-accent text-lg mb-1">🔑</div>
          <p>Seed BIP39</p>
        </div>
        <div className="bg-koon-surface border border-koon-border rounded-lg p-3">
          <div className="text-koon-accent text-lg mb-1">🛡️</div>
          <p>X25519 DH</p>
        </div>
        <div className="bg-koon-surface border border-koon-border rounded-lg p-3">
          <div className="text-koon-accent text-lg mb-1">📝</div>
          <p>Ed25519 sig</p>
        </div>
      </div>
    </div>
  )
}
