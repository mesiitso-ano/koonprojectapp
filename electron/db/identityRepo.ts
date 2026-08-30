import { getDb } from './database'
import type { Identity } from '../crypto/identity'

export interface StoredIdentity {
  pubkey: string
  privkey: string
  sig_pubkey: string
  sig_privkey: string
  mnemonic: string
  created_at: number
}

export function saveIdentity(identity: Identity): void {
  const db = getDb()
  db.prepare(`
    INSERT INTO identity (id, pubkey, privkey, sig_pubkey, sig_privkey, mnemonic)
    VALUES (1, @pubkey, @privkey, @sigPubkey, @sigPrivkey, @mnemonic)
    ON CONFLICT(id) DO UPDATE SET
      pubkey = excluded.pubkey,
      privkey = excluded.privkey,
      sig_pubkey = excluded.sig_pubkey,
      sig_privkey = excluded.sig_privkey,
      mnemonic = excluded.mnemonic,
      created_at = unixepoch()
  `).run({
    pubkey: identity.pubkey,
    privkey: identity.privkey,
    sigPubkey: identity.sigPubkey,
    sigPrivkey: identity.sigPrivkey,
    mnemonic: identity.mnemonic,
  })
}

export function loadIdentity(): StoredIdentity | null {
  const db = getDb()
  const row = db.prepare('SELECT * FROM identity WHERE id = 1').get() as StoredIdentity | undefined
  return row ?? null
}

export function clearIdentity(): void {
  const db = getDb()
  db.prepare('DELETE FROM identity WHERE id = 1').run()
}
