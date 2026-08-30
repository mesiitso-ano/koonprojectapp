export {}

declare global {
  interface Window {
    koon: {
      window: {
        minimize: () => void
        maximize: () => void
        close: () => void
      }
      identity: {
        generate: () => Promise<{ pubkey: string; sigPubkey: string; mnemonic: string }>
        import: (mnemonic: string) => Promise<{ pubkey: string; sigPubkey: string; mnemonic: string }>
        getCurrent: () => Promise<{ pubkey: string; sigPubkey: string; mnemonic: string } | null>
        clear: () => Promise<boolean>
      }
      contacts: {
        list: () => Promise<Contact[]>
        add: (pubkey: string, nickname: string) => Promise<Contact[]>
        remove: (pubkey: string) => Promise<Contact[]>
      }
      messages: {
        list: (contactPubkey: string) => Promise<Message[]>
        send: (contactPubkey: string, plaintext: string) => Promise<Message>
        onReceive: (cb: (msg: Message) => void) => () => void
      }
      network: {
        getStatus: () => Promise<string>
        connect: (relayUrl: string) => Promise<boolean>
        onStatusChange: (cb: (status: string) => void) => () => void
      }
    }
  }

  interface Contact {
    pubkey: string
    nickname: string
    added_at: number
  }

  interface Message {
    id: number
    contact_pubkey: string
    direction: 'in' | 'out'
    plaintext: string
    nonce: string | null
    ciphertext: string | null
    timestamp: number
  }
}
