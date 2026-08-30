/**
 * Formate un timestamp unix (secondes) en heure lisible.
 */
export function formatTime(timestamp: number): string {
  const date = new Date(timestamp * 1000)
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

/**
 * Formate un timestamp en date courte.
 */
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp * 1000)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) return 'Aujourd\'hui'
  if (days === 1) return 'Hier'
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
}

/**
 * Tronque une pubkey base64 pour affichage.
 */
export function shortPubkey(pubkey: string): string {
  if (!pubkey) return ''
  return `${pubkey.slice(0, 8)}…${pubkey.slice(-6)}`
}

/**
 * Copie du texte dans le presse-papiers.
 */
export async function copyToClipboard(text: string): Promise<void> {
  await navigator.clipboard.writeText(text)
}

/**
 * Validates a base64-encoded X25519 public key (32 bytes → exactly 44 base64 chars).
 */
export function isValidPubkey(pubkey: string): boolean {
  return /^[A-Za-z0-9+/]{43}={0,1}$/.test(pubkey.trim())
}

/**
 * Classe utilitaire pour joindre des noms de classes conditionnellement.
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
