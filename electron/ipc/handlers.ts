import type { IpcMain } from 'electron'
import {
  generateIdentity,
  deriveIdentityFromMnemonic,
  encryptMessage,
  signMessage,
} from '../crypto/identity'
import { saveIdentity, loadIdentity, clearIdentity } from '../db/identityRepo'
import { listContacts, addContact, removeContact } from '../db/contactsRepo'
import { listMessages, saveMessage } from '../db/messagesRepo'
import {
  connectToRelay,
  sendEncryptedMessage,
  getNetworkStatus,
} from '../network/client'
import { getRelayUrl } from '../network/relay'

export function setupIpcHandlers(ipcMain: IpcMain): void {
  // ── Identity ──────────────────────────────────────────────
  ipcMain.handle('identity:generate', () => {
    const identity = generateIdentity()
    saveIdentity(identity)
    connectToRelay(getRelayUrl(), identity.pubkey, identity.privkey)
    return { pubkey: identity.pubkey, sigPubkey: identity.sigPubkey, mnemonic: identity.mnemonic }
  })

  ipcMain.handle('identity:import', (_e, mnemonic: string) => {
    const identity = deriveIdentityFromMnemonic(mnemonic)
    saveIdentity(identity)
    connectToRelay(getRelayUrl(), identity.pubkey, identity.privkey)
    return { pubkey: identity.pubkey, sigPubkey: identity.sigPubkey, mnemonic: identity.mnemonic }
  })

  ipcMain.handle('identity:getCurrent', () => {
    const stored = loadIdentity()
    if (!stored) return null
    // Auto-connect on startup
    connectToRelay(getRelayUrl(), stored.pubkey, stored.privkey)
    return { pubkey: stored.pubkey, sigPubkey: stored.sig_pubkey, mnemonic: stored.mnemonic }
  })

  ipcMain.handle('identity:clear', () => {
    clearIdentity()
    return true
  })

  // ── Contacts ──────────────────────────────────────────────
  ipcMain.handle('contacts:list', () => listContacts())

  ipcMain.handle('contacts:add', (_e, pubkey: string, nickname: string) => {
    addContact(pubkey, nickname)
    return listContacts()
  })

  ipcMain.handle('contacts:remove', (_e, pubkey: string) => {
    removeContact(pubkey)
    return listContacts()
  })

  // ── Messages ──────────────────────────────────────────────
  ipcMain.handle('messages:list', (_e, contactPubkey: string) => {
    return listMessages(contactPubkey)
  })

  ipcMain.handle('messages:send', (_e, contactPubkey: string, plaintext: string) => {
    const stored = loadIdentity()
    if (!stored) throw new Error('Identité non chargée')

    const { nonce, ciphertext } = encryptMessage(plaintext, contactPubkey, stored.privkey)
    const signature = signMessage(ciphertext, stored.sig_privkey)

    sendEncryptedMessage(
      contactPubkey,
      stored.pubkey,
      nonce,
      ciphertext,
      stored.sig_pubkey,
      signature
    )

    return saveMessage(contactPubkey, 'out', plaintext, nonce, ciphertext)
  })

  // ── Network ───────────────────────────────────────────────
  ipcMain.handle('network:status', () => getNetworkStatus())

  ipcMain.handle('network:connect', (_e, relayUrl: string) => {
    const stored = loadIdentity()
    if (!stored) throw new Error('Identité non chargée')
    connectToRelay(relayUrl, stored.pubkey, stored.privkey)
    return true
  })
}
