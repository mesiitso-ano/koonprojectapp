import { getDb } from './database'

export interface Message {
  id: number
  contact_pubkey: string
  direction: 'in' | 'out'
  plaintext: string
  nonce: string | null
  ciphertext: string | null
  timestamp: number
}

export function listMessages(contactPubkey: string): Message[] {
  const db = getDb()
  return db.prepare(`
    SELECT * FROM messages
    WHERE contact_pubkey = @contactPubkey
    ORDER BY timestamp ASC
    LIMIT 500
  `).all({ contactPubkey }) as Message[]
}

export function saveMessage(
  contactPubkey: string,
  direction: 'in' | 'out',
  plaintext: string,
  nonce: string | null = null,
  ciphertext: string | null = null
): Message {
  const db = getDb()
  const result = db.prepare(`
    INSERT INTO messages (contact_pubkey, direction, plaintext, nonce, ciphertext)
    VALUES (@contactPubkey, @direction, @plaintext, @nonce, @ciphertext)
  `).run({ contactPubkey, direction, plaintext, nonce, ciphertext })

  return {
    id: result.lastInsertRowid as number,
    contact_pubkey: contactPubkey,
    direction,
    plaintext,
    nonce,
    ciphertext,
    timestamp: Math.floor(Date.now() / 1000),
  }
}

export function deleteMessagesForContact(contactPubkey: string): void {
  const db = getDb()
  db.prepare('DELETE FROM messages WHERE contact_pubkey = @contactPubkey').run({ contactPubkey })
}
