# Koon — Chat Desktop E2E Chiffré

Application de messagerie desktop avec chiffrement bout-en-bout, basée sur Electron + React + TypeScript.

## Fonctionnalités

- 🔑 **Identité BIP39** — Génération ou import de seed phrase 12/24 mots
- 🔐 **Chiffrement X25519 + NaCl box** — Diffie-Hellman + XSalsa20-Poly1305
- ✍️ **Signatures Ed25519** — Chaque message est signé
- 💾 **SQLite local** — Historique chiffré stocké sur l'appareil
- 🌐 **Relay WebSocket local** — Communication peer-to-peer via relay intégré
- 🖥️ **Interface moderne** — Fenêtre sans cadre, thème sombre, Tailwind CSS

## Stack technique

| Couche | Technologie |
|--------|------------|
| Desktop | Electron 30 |
| UI | React 18 + TypeScript |
| Styles | Tailwind CSS 3 |
| Crypto | @noble/curves + tweetnacl + bip39 |
| DB | better-sqlite3 |
| Network | ws (WebSocket) |
| Build | Vite 5 |

## Installation

```bash
npm install
```

## Développement

```bash
npm run dev
```

Lance Vite (port 5173) et Electron en parallèle.

## Build production

```bash
npm run build
```

Génère l'installeur dans `release/`.

## Architecture

```
electron/
  main.ts          # Process principal Electron
  preload.ts       # Bridge contextIsolation
  crypto/
    identity.ts    # BIP39, X25519, Ed25519, NaCl box
  db/
    database.ts    # Init SQLite + migrations
    identityRepo.ts
    contactsRepo.ts
    messagesRepo.ts
  ipc/
    handlers.ts    # Handlers IPC main process
  network/
    relay.ts       # Serveur WebSocket relay local
    client.ts      # Client WebSocket + déchiffrement entrant

src/
  App.tsx
  main.tsx
  index.css
  components/
    TitleBar.tsx
    Sidebar.tsx
    AddContactModal.tsx
    IdentityPanel.tsx
    MessageBubble.tsx
    MessageInput.tsx
    EmptyChat.tsx
  pages/
    SetupPage.tsx
    ChatLayout.tsx
    ChatWindow.tsx
  store/
    identityStore.ts
    contactsStore.ts
    messageStore.ts
    networkStore.ts
  lib/
    utils.ts
  hooks/
    useMessages.ts
  types/
    global.d.ts
```

## Sécurité

- Les clés privées ne quittent jamais `userData` (SQLite chiffré localement)
- `contextIsolation: true` + `nodeIntegration: false` dans Electron
- Vérification des signatures Ed25519 à la réception de chaque message
- Pas de serveur externe — le relay tourne en local

## Licence

MIT
