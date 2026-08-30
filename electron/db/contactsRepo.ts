import { getDb } from './database'

export interface Contact {
  pubkey: string
  nickname: string
  added_at: number
}

export function listContacts(): Contact[] {
  const db = getDb()
  return db.prepare('SELECT * FROM contacts ORDER BY nickname COLLATE NOCASE').all() as Contact[]
}

export function addContact(pubkey: string, nickname: string): void {
  const db = getDb()
  db.prepare(`
    INSERT INTO contacts (pubkey, nickname)
    VALUES (@pubkey, @nickname)
    ON CONFLICT(pubkey) DO UPDATE SET nickname = excluded.nickname
  `).run({ pubkey, nickname })
}

export function removeContact(pubkey: string): void {
  const db = getDb()
  db.prepare('DELETE FROM contacts WHERE pubkey = @pubkey').run({ pubkey })
}

export function getContact(pubkey: string): Contact | null {
  const db = getDb()
  const row = db.prepare('SELECT * FROM contacts WHERE pubkey = @pubkey').get({ pubkey }) as Contact | undefined
  return row ?? null
}
