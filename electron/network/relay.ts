import { WebSocketServer, WebSocket } from 'ws'

const DEFAULT_PORT = 8765
let wss: WebSocketServer | null = null

// Map pubkey -> WebSocket
const peers = new Map<string, WebSocket>()

export async function startRelayServer(): Promise<void> {
  wss = new WebSocketServer({ port: DEFAULT_PORT })

  wss.on('connection', (ws) => {
    let registeredPubkey: string | null = null

    ws.on('message', (raw) => {
      try {
        const msg = JSON.parse(raw.toString())

        if (msg.type === 'register') {
          registeredPubkey = msg.pubkey as string
          peers.set(registeredPubkey, ws)
          ws.send(JSON.stringify({ type: 'registered', pubkey: registeredPubkey }))
          return
        }

        if (msg.type === 'message') {
          const { to, from, nonce, ciphertext, sigPubkey, signature } = msg
          const target = peers.get(to)
          if (target && target.readyState === WebSocket.OPEN) {
            target.send(JSON.stringify({ type: 'message', from, nonce, ciphertext, sigPubkey, signature }))
          }
          return
        }
      } catch {
        // ignore malformed messages
      }
    })

    ws.on('close', () => {
      if (registeredPubkey) peers.delete(registeredPubkey)
    })
  })

  console.log(`[Relay] WebSocket server listening on ws://localhost:${DEFAULT_PORT}`)
}

export function stopRelayServer(): void {
  wss?.close()
  wss = null
  peers.clear()
}

export function getRelayUrl(): string {
  return `ws://localhost:${DEFAULT_PORT}`
}
