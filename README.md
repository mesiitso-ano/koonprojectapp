# Koon — Messagerie Chiffrée

Application de messagerie sécurisée construite avec **Tauri 2.0** + **React** + **TypeScript**.

## 🔐 Fonctionnalités

- **Chiffrement de bout en bout** via NaCl (TweetNaCl)
- **Génération de wallet BIP39** (phrase mnémonique de 24 mots)
- **Base de données SQLite locale** pour la persistance
- **Interface moderne** avec Tailwind CSS
- **Cross-platform** grâce à Tauri (Windows, macOS, Linux)

## 🚀 Développement

### Prérequis

- Node.js 18+
- Rust 1.70+
- Pour Windows : Visual Studio Build Tools avec C++ Desktop Development

### Installation

```bash
# Installer les dépendances Node
npm install

# Lancer en mode développement
npm run dev
```

### Build de production

```bash
# Compiler l'application native
npm run tauri build
```

## 📁 Architecture

```
koon/
├── src/                    # Code React/TypeScript
│   ├── components/         # Composants UI
│   ├── pages/             # Pages principales
│   ├── store/             # État Zustand
│   ├── lib/               # Utilitaires crypto
│   └── types/             # Définitions TypeScript
├── src-tauri/             # Backend Rust
│   └── src/
│       ├── commands/      # Commandes Tauri
│       ├── db/            # SQLite
│       └── lib.rs         # Point d'entrée
└── index.html             # Shell HTML
```

## 🔑 Cryptographie

- **Génération de clés** : BIP39 → Ed25519
- **Chiffrement** : X25519 (Curve25519 ECDH)
- **Signature** : Ed25519
- **Bibliothèque** : TweetNaCl

## 📝 License

MIT
