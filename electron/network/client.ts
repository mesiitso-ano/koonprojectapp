import WebSocket from 'ws'
import { BrowserWindow } from 'electron'
import { decryptMessage, verifySignature } from '../crypto/identity'
import { saveMessage } from '../db/messagesRepo'
import { getContact } from '../db/contactsRepo'

let ws: WebSocket | null = null
let currentPubkey: string | null = null
let currentPrivkey: string | null = null
let relayUrl = 'ws://localhost:8765'
let status: 'disconnected' | 'connecting' | 'connected' = 'disconnected'

function notifyRenderer(event: string, payload: unknown): void {
  const wins = BrowserWindow.getAllWindows()
  wins.forEach(w => w.webContents.send(event, payload))
}

export function connectToRelay(url: string, pubkey: string, privkey: string): void {
  relayUrl = url
  currentPubkey = pubkey
  currentPrivkey = privkey

  if (ws) {
    ws.close()
    ws = null
  }

  status = 'connecting'
  notifyRenderer('network:statusChanged', status)

  ws = new WebSocket(url)

  ws.on('open', () => {
    ws!.send(JSON.stringify({ type: 'register', pubkey }))
    status = 'connected'
    notifyRenderer('network:statusChanged', status)
  })

  ws.on('message', (raw) => {
    try {
      const msg = JSON.parse(raw.toString())

      if (msg.type === 'message') {
        const { from, nonce, ciphertext, sigPubkey, signature } = msg

        // Vérifie la signature sur le ciphertext
        const valid = verifySignature(ciphertext, signature, sigPubkey)
        if (!valid) {
          console.warn('[Client] Signature invalide pour message de', from)
          return
        }

        // Déchiffre
        const plaintext = decryptMessage(ciphertext, nonce, from, currentPrivkey!)

        // Sauvegarde
        const contact = getContact(from)
        if (contact) {
          const saved = saveMessage(from, 'in', plaintext, nonce, ciphertext)
          notifyRenderer('message:received', { ...saved, contact_pubkey: from })
        }
      }
    } catch (err) {
      console.error('[Client] Erreur traitement message:', err)
    }
  })

  ws.on('close', () => {
    status = 'disconnected'
    notifyRenderer('network:statusChanged', status)
    // Reconnexion auto après 5s
    setTimeout(() => {
      if (currentPubkey && currentPrivkey) {
        connectToRelay(relayUrl, currentPubkey, currentPrivkey)
      }
    }, 5000)
  })

  ws.on('error', (err) => {
    console.error('[Client] WS error:', err.message)
  })
}

export function sendEncryptedMessage(
  to: string,
  from: string,
  nonce: string,
  ciphertext: string,
  sigPubkey: string,
  signature: string
): void {
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    throw new Error('Non connecté au relay')
  }
  ws.send(JSON.stringify({ type: 'message', to, from, nonce, ciphertext, sigPubkey, signature }))
}

export function getNetworkStatus(): string {
  return status
}

export function disconnectFromRelay(): void {
  ws?.close()
  ws = null
  currentPubkey = null
  currentPrivkey = null
}
