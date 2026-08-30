# 🔧 Guide de Dépannage - Koon

## Problèmes Courants

### 1. Erreur PowerShell "exécution de scripts désactivée"

**Symptôme** :
```
Impossible de charger le fichier npm.ps1, car l'exécution de scripts est désactivée sur ce système
```

**Solution 1** : Utiliser les scripts batch
- Double-cliquez sur `dev.bat` au lieu d'utiliser npm directement

**Solution 2** : Autoriser l'exécution de scripts
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Solution 3** : Utiliser npm.cmd
```powershell
npm.cmd install
npm.cmd run tauri:dev
```

### 2. Port 1420 déjà utilisé

**Symptôme** :
```
Error: Port 1420 is already in use
```

**Solution** :
1. Ouvrir `vite.config.ts`
2. Changer `port: 1420` par `port: 1421` (ou autre)
3. Ouvrir `src-tauri/tauri.conf.json`
4. Changer `"devUrl": "http://localhost:1420"` par `"devUrl": "http://localhost:1421"`

### 3. Erreur de compilation TypeScript

**Symptôme** :
```
error TS2307: Cannot find module 'X'
```

**Solution** :
```powershell
# Supprimer node_modules et réinstaller
Remove-Item -Recurse -Force node_modules
npm.cmd install
```

### 4. Erreur Rust "linker not found"

**Symptôme** :
```
error: linker `link.exe` not found
```

**Solution** :
Installer Visual Studio Build Tools avec "Desktop development with C++"
- https://visualstudio.microsoft.com/fr/downloads/
- Sélectionner "Build Tools for Visual Studio"
- Cocher "Desktop development with C++"
- Installer

### 5. Erreur Tauri "Failed to bundle project"

**Symptôme** :
```
Error: Failed to bundle project
```

**Solution** :
```powershell
# Mettre à jour Rust
rustup update

# Nettoyer le cache Cargo
cd src-tauri
cargo clean
cd ..

# Réessayer le build
npm.cmd run tauri:build
```

### 6. Application ne démarre pas

**Checklist** :
1. ✅ Node.js 18+ installé ? `node --version`
2. ✅ Rust installé ? `rustc --version`
3. ✅ Dépendances installées ? `npm.cmd install`
4. ✅ Port 1420 libre ?
5. ✅ Antivirus bloquant Tauri ?

### 7. Erreur "tauri command not found"

**Solution** :
```powershell
# Le CLI Tauri est installé en local, utiliser via npm
npm.cmd run tauri:dev
# Au lieu de : tauri dev
```

### 8. Hot reload ne fonctionne pas

**Solution** :
1. Vérifier que Vite est démarré (terminal séparé avec `npm run dev`)
2. Vérifier la configuration dans `vite.config.ts`
3. Redémarrer l'application complètement

### 9. Erreur SQLite "database is locked"

**Solution** :
```powershell
# Fermer toutes les instances de Koon
# Supprimer le fichier DB si besoin
Remove-Item "$env:LOCALAPPDATA\koon\koon.db"
# Redémarrer l'application
```

### 10. Build prend trop de temps

**Explication** :
La première compilation Rust peut prendre 5-15 minutes car :
- Téléchargement de toutes les dépendances Rust (crates)
- Compilation de Tauri et ses 100+ dépendances
- Optimisations de release

**Solution** :
- ☕ Patience ! Les builds suivants seront plus rapides (cache)
- Utiliser `tauri:dev` pour le développement (plus rapide)

## Logs de Débogage

### Activer les logs détaillés Tauri

Dans `src-tauri/tauri.conf.json`, ajouter :
```json
{
  "bundle": {
    "active": true
  },
  "app": {
    "withGlobalTauri": true
  }
}
```

### Logs Rust
```rust
// Dans src-tauri/src/commands/mod.rs
println!("Debug: {:?}", ma_variable);
```

### Logs React
```typescript
// Dans n'importe quel composant
console.log("Debug:", maVariable);
```

## Support

Si le problème persiste :
1. Vérifier les logs dans la console du navigateur (F12)
2. Vérifier les logs Rust dans le terminal
3. Consulter la doc Tauri : https://tauri.app/
4. Créer une issue GitHub avec :
   - Version de Node.js
   - Version de Rust
   - Système d'exploitation
   - Message d'erreur complet
   - Étapes pour reproduire
