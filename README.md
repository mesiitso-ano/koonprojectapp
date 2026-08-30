# 🔐 Koon - Messagerie Chiffrée E2E

![Build Status](https://github.com/mesiitso-ano/koonprojectapp/workflows/Build%20et%20Release%20Automatique/badge.svg)

Application de messagerie sécurisée avec chiffrement de bout en bout, construite avec **Tauri 2.0** + **React** + **TypeScript**.

## ✨ Fonctionnalités

- 🔐 **Chiffrement E2E** via NaCl (Curve25519)
- 🔑 **Wallet BIP39** (phrase mnémonique de 24 mots)
- 💾 **Base SQLite locale** (aucune donnée cloud)
- 🔄 **Mise à jour automatique** depuis GitHub Releases
- 🎨 **Interface moderne** avec Tailwind CSS
- 🖥️ **Cross-platform** (Windows, macOS, Linux)

## 🚀 Installation

### Pour les utilisateurs

1. Téléchargez la dernière version : [Releases](https://github.com/mesiitso-ano/koonprojectapp/releases)
2. Lancez `koon.exe`
3. Créez votre wallet ou restaurez-en un existant

### Pour les développeurs

```bash
# Cloner le repo
git clone https://github.com/mesiitso-ano/koonprojectapp.git
cd koonprojectapp

# Installer les dépendances
npm install

# Lancer en mode dev
npm run tauri dev

# Build production
npm run tauri build
```

## 📦 Build Automatique

Le projet utilise **GitHub Actions** pour compiler automatiquement :

- **Push sur main** → Build de test (mode debug)
- **Tag `v*`** → Build release + Publication automatique

```bash
# Publier une nouvelle version
git tag v1.0.1
git push origin v1.0.1
```

→ GitHub compile et crée la Release automatiquement !

## 🔧 Technologies

- **Frontend** : React 18, TypeScript, Zustand, Tailwind CSS
- **Backend** : Rust, Tauri 2.0, SQLite
- **Crypto** : BIP39, TweetNaCl (Ed25519 + Curve25519)
- **CI/CD** : GitHub Actions

## 📝 Utilisation

### 1. Créer un Wallet

- Cliquez sur "Créer un nouveau wallet"
- Sauvegardez votre phrase de 24 mots
- Confirmez

### 2. Ajouter des Contacts

- Cliquez sur le bouton "+"
- Entrez le nom et la clé publique (64 hex)
- Validez

### 3. Envoyer des Messages

- Sélectionnez un contact
- Tapez votre message
- Envoyez (chiffrement automatique)

## 🔄 Mise à Jour Automatique

L'application vérifie automatiquement les mises à jour :
- Au démarrage
- Toutes les 6 heures

Notification visuelle + installation en 1 clic.

## 📄 License

MIT © 2024 Koon Team

## 🤝 Contribuer

Les contributions sont les bienvenues ! Ouvrez une issue ou une PR.

---

**Développé avec ❤️ et sécurité en tête**
