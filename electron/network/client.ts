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
let reconnectTimer: ReturnType<typeof setTimeout> | null = null
let reconnectAttempts = 0
const MAX_RECONNECT_ATTEMPTS = 10
const BASE_RECONNECT_DELAY_MS = 2000

function notifyRenderer(event: string, payload: unknown): void {
  const wins = BrowserWindow.getAllWindows()
  wins.forEach(w => {
    if (!w.isDestroyed()) w.webContents.send(event, payload)
  })
}

function scheduleReconnect(): void {
  if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
    console.warn('[Client] Max reconnect attempts reached, giving up.')
    return
  }
  if (!currentPubkey || !currentPrivkey) return

  // Exponential backoff: 2s, 4s, 8s … capped at 30s
  const delay = Math.min(BASE_RECONNECT_DELAY_MS * 2 ** reconnectAttempts, 30_000)
  reconnectAttempts++
  console.log(`[Client] Reconnecting in ${delay}ms (attempt ${reconnectAttempts})`)

  reconnectTimer = setTimeout(() => {
    reconnectTimer = null
    if (currentPubkey && currentPrivkey) {
      connectToRelay(relayUrl, currentPubkey, currentPrivkey)
    }
  }, delay)
}

function cancelReconnect(): void {
  if (reconnectTimer !== null) {
    clearTimeout(reconnectTimer)
    reconnectTimer = null
  }
}

export function connectToRelay(url: string, pubkey: string, privkey: string): void {
  // Cancel any pending reconnect before opening a new connection
  cancelReconnect()

  relayUrl = url
  currentPubkey = pubkey
  currentPrivkey = privkey

  if (ws) {
    // Remove listeners to prevent the close handler from scheduling a reconnect
    ws.removeAllListeners()
    ws.close()
    ws = null
  }

  status = 'connecting'
  notifyRenderer('network:statusChanged', status)

  ws = new WebSocket(url)

  ws.on('open', () => {
    reconnectAttempts = 0
    ws!.send(JSON.stringify({ type: 'register', pubkey }))
    status = 'connected'
    notifyRenderer('network:statusChanged', status)
  })

  ws.on('message', (raw) => {
    try {
      const msg = JSON.parse(raw.toString())

      if (msg.type === 'message') {
        const { from, nonce, ciphertext, sigPubkey, signature } = msg

        // Verify Ed25519 signature on the ciphertext
        const valid = verifySignature(ciphertext, signature, sigPubkey)
        if (!valid) {
          console.warn('[Client] Invalid signature for message from', from)
          return
        }

        // Decrypt
        const plaintext = decryptMessage(ciphertext, nonce, from, currentPrivkey!)

        // Only persist messages from known contacts
        const contact = getContact(from)
        if (contact) {
          const saved = saveMessage(from, 'in', plaintext, nonce, ciphertext)
          notifyRenderer('message:received', saved)
        }
      }
    } catch (err) {
      console.error('[Client] Error processing message:', err)
    }
  })

  ws.on('close', () => {
    status = 'disconnected'
    notifyRenderer('network:statusChanged', status)
    scheduleReconnect()
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
    throw new Error('Not connected to relay')
  }
  ws.send(JSON.stringify({ type: 'message', to, from, nonce, ciphertext, sigPubkey, signature }))
}

export function getNetworkStatus(): string {
  return status
}

export function disconnectFromRelay(): void {
  cancelReconnect()
  if (ws) {
    ws.removeAllListeners()
    ws.close()
    ws = null
  }
  currentPubkey = null
  currentPrivkey = null
  status = 'disconnected'
}
