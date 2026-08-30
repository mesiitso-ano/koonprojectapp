# Changelog - Koon

Toutes les modifications importantes du projet sont documentées ici.

---

## [1.0.0] - 2024 (Initial Release)

### ✨ Ajouté

#### Frontend
- Interface de setup avec création/restauration de wallet
- Page de chat avec liste de contacts et fenêtre de conversation
- Composant ContactList pour afficher la liste des contacts
- Composant ChatWindow avec historique et input de messages
- Modal AddContactModal pour ajouter de nouveaux contacts
- Store Zustand pour la gestion d'état global
- Animations fluides (slideIn, fadeIn)
- Thème sombre personnalisé Koon

#### Cryptographie
- Génération de phrases mnémoniques BIP39 (24 mots)
- Dérivation de clés Ed25519 depuis seed BIP39
- Chiffrement/déchiffrement NaCl Box
- Export/import de clés en format hexadécimal

#### Backend
- Commandes Tauri pour save/load wallet
- Commandes Tauri pour gestion des contacts
- Commandes Tauri pour envoi/chargement de messages
- Base de données SQLite avec 3 tables (wallet, contacts, messages)
- Persistance automatique dans %LOCALAPPDATA%\koon\

#### Configuration
- Configuration Vite optimisée pour Tauri
- Configuration TypeScript stricte
- Configuration Tailwind CSS avec thème custom
- Scripts NPM pour dev et build
- Scripts batch Windows (dev.bat, build.bat, clean.bat)

#### Documentation
- README.md complet
- Guide de lancement rapide
- Guide de résolution de problèmes
- Guide de test complet
- État du projet détaillé
- Changelog

### 🔒 Sécurité
- Aucune clé privée stockée en localStorage
- Toutes les données sensibles dans SQLite local
- Chiffrement asymétrique pour les messages
- Validation des clés publiques

### 🎨 Interface
- Design moderne avec palette violet/noir
- Police Inter pour l'interface
- Police JetBrains Mono pour les clés
- Scrollbar personnalisée
- Responsive design (min 800px largeur)

### ⚡ Performance
- Hot reload Vite
- Fast Refresh React
- Build incrémental Rust
- Bundle optimisé avec tree-shaking

---

## [Futur] - Roadmap

### 🚀 Prévu pour v1.1.0
- [ ] Réseau P2P réel (libp2p)
- [ ] Notifications desktop
- [ ] Support des pièces jointes
- [ ] Recherche dans l'historique
- [ ] Thèmes personnalisables

### 🔮 Prévu pour v2.0.0
- [ ] Groupes de discussion
- [ ] Appels audio/vidéo chiffrés
- [ ] Synchronisation multi-appareils
- [ ] Version mobile (iOS/Android)
- [ ] Mode hors ligne amélioré

---

## Types de Changements

- **✨ Ajouté** : Nouvelle fonctionnalité
- **🔧 Modifié** : Changement dans une fonctionnalité existante
- **🐛 Corrigé** : Correction de bug
- **🔒 Sécurité** : Amélioration de sécurité
- **⚡ Performance** : Amélioration de performance
- **📝 Documentation** : Changement dans la documentation
- **🎨 Style** : Changement de style ou UI
- **♻️ Refactoring** : Refonte du code sans changement fonctionnel
- **🗑️ Supprimé** : Fonctionnalité supprimée

---

*Format basé sur [Keep a Changelog](https://keepachangelog.com/)*
