# 🚀 Lancement Rapide - Koon

## Option 1 : Scripts Batch (Windows)

### Développement
Double-cliquez sur **`dev.bat`**
- Installe automatiquement les dépendances
- Lance l'application en mode développement avec hot-reload

### Build Production
Double-cliquez sur **`build.bat`**
- Installe les dépendances
- Compile l'application native Windows
- L'exécutable se trouvera dans `src-tauri\target\release\`

## Option 2 : Ligne de commande

### Développement
```powershell
npm.cmd install
npm.cmd run tauri:dev
```

### Build Production
```powershell
npm.cmd install
npm.cmd run tauri:build
```

## ⚠️ Prérequis

1. **Node.js 18+** : https://nodejs.org/
2. **Rust** : https://rustup.rs/
3. **Visual Studio Build Tools** (Windows) :
   - Installer "Desktop development with C++"
   - https://visualstudio.microsoft.com/downloads/

## 🔧 Résolution de problèmes

### Erreur "exécution de scripts est désactivée"
Utilisez `npm.cmd` au lieu de `npm` ou autorisez l'exécution :
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Port 1420 déjà utilisé
Changez le port dans `vite.config.ts` et `src-tauri/tauri.conf.json`

### Erreur de compilation Rust
Vérifiez que Rust est à jour :
```powershell
rustup update
```

## 📦 Structure Créée

✅ Frontend React + TypeScript (src/)
✅ Backend Rust/Tauri (src-tauri/)
✅ Configuration Vite + Tailwind CSS
✅ Store Zustand pour l'état global
✅ Cryptographie NaCl (BIP39 + Ed25519)
✅ Base SQLite intégrée
✅ UI complète (Setup + Chat)

## 🎯 Fonctionnalités Implémentées

- ✅ Création/restauration de wallet BIP39 (24 mots)
- ✅ Génération de clés Ed25519
- ✅ Gestion des contacts
- ✅ Interface de chat
- ✅ Chiffrement de bout en bout
- ✅ Persistance locale (SQLite)
- ✅ UI moderne avec animations

## 📝 Prochaines Étapes

1. Lancer `dev.bat` pour tester l'application
2. Créer un wallet de test
3. Ajouter des contacts
4. Tester l'envoi de messages

**Note** : La première compilation Rust peut prendre 5-10 minutes (téléchargement + compilation des dépendances).
