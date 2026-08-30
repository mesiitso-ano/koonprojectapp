# 📦 Guide de Publication de Release sur GitHub

## ✅ CE QUI A ÉTÉ AJOUTÉ

### Système de Mise à Jour Automatique
- ✅ Vérification automatique au démarrage
- ✅ Vérification toutes les 6 heures
- ✅ Notification visuelle en bas à droite
- ✅ Bouton "Mettre à jour" dans Paramètres
- ✅ Téléchargement + installation automatique
- ✅ Redémarrage après mise à jour

---

## 🚀 PUBLICATION D'UNE NOUVELLE VERSION

### Étape 1 : Mettre à jour la version

1. Ouvrir `src-tauri/tauri.conf.json`
2. Changer `"version": "1.0.0"` → `"version": "1.0.1"`
3. Ouvrir `package.json`
4. Changer `"version": "1.0.0"` → `"version": "1.0.1"`

### Étape 2 : Builder la release

```powershell
npm.cmd run tauri build
```

Le .EXE sera dans : `src-tauri\target\release\koon.exe`

### Étape 3 : Créer une Release GitHub

1. Aller sur : https://github.com/mesiitso-ano/koonprojectapp/releases
2. Cliquer "Draft a new release"
3. Tag : `v1.0.1`
4. Title : `Koon v1.0.1`
5. Description :
   ```
   ## 🚀 Nouveautés
   - Système de mise à jour automatique
   - Corrections de bugs
   
   ## 📥 Installation
   Téléchargez koon.exe ci-dessous et lancez-le.
   ```

### Étape 4 : Upload des fichiers

Uploader ces fichiers :
1. `koon.exe` (depuis src-tauri/target/release/)
2. `koon.msi` (depuis src-tauri/target/release/bundle/msi/)

### Étape 5 : Créer le fichier latest.json

Créer un fichier `latest.json` avec ce contenu :

```json
{
  "version": "v1.0.1",
  "notes": "Système de mise à jour automatique ajouté",
  "pub_date": "2024-01-15T12:00:00Z",
  "platforms": {
    "windows-x86_64": {
      "signature": "",
      "url": "https://github.com/mesiitso-ano/koonprojectapp/releases/download/v1.0.1/koon.exe"
    }
  }
}
```

**Important** : Remplacer la date par la date actuelle.

### Étape 6 : Publier

Cliquer sur "Publish release"

---

## 🔐 SIGNATURE (Optionnel mais Recommandé)

Pour signer les releases et garantir l'authenticité :

### Générer une clé de signature

```powershell
# Installer tauri-cli si pas encore fait
npm install -g @tauri-apps/cli

# Générer la paire de clés
tauri signer generate -w ~/.tauri/koon.key
```

Cela génère :
- `koon.key` (clé privée - GARDER SECRET)
- `koon.pub` (clé publique - à mettre dans tauri.conf.json)

### Signer la release

```powershell
tauri signer sign target/release/koon.exe -k ~/.tauri/koon.key
```

Cela crée `koon.exe.sig`

### Mettre à jour tauri.conf.json

```json
{
  "plugins": {
    "updater": {
      "pubkey": "VOTRE_CLE_PUBLIQUE_ICI"
    }
  }
}
```

---

## 🎯 WORKFLOW COMPLET

### Pour chaque nouvelle version :

1. **Code** : Faire les modifications
2. **Version** : Incrémenter dans `tauri.conf.json` et `package.json`
3. **Build** : `npm.cmd run tauri build`
4. **Test** : Lancer le .EXE pour tester
5. **Commit** : `git add . && git commit -m "v1.0.1"`
6. **Push** : `git push origin main`
7. **Release** : Créer sur GitHub avec .exe + latest.json
8. **Annonce** : Les utilisateurs seront notifiés automatiquement !

---

## 📝 EXEMPLE DE CHANGELOG

```markdown
# v1.0.1 - 2024-01-15

## ✨ Nouveautés
- Système de mise à jour automatique
- Bouton paramètres avec vérification manuelle
- Notification en bas à droite

## 🐛 Corrections
- Fix cryptographie Buffer → native
- Fix imports TypeScript

## 🔧 Améliorations
- Build rapide en mode debug
- Script BUILD-RAPIDE.bat pour tests
```

---

## ⚡ BUILD RAPIDE POUR TEST

Pour tester rapidement sans build release (10x plus rapide) :

```powershell
.\BUILD-RAPIDE.bat
```

Ou :

```powershell
npm.cmd run tauri build -- --debug
```

Le .EXE sera dans : `src-tauri\target\debug\koon.exe`

---

## 🎉 RÉSULTAT

Une fois la release publiée :
1. Les utilisateurs lancent Koon
2. Une notification apparaît : "Mise à jour disponible"
3. Ils cliquent "Mettre à jour"
4. L'app télécharge, installe et redémarre
5. ✅ Version à jour automatiquement !

---

## 📊 VÉRIFIER LE SYSTÈME DE MAJ

Tester localement :
1. Builder avec version 1.0.0
2. Publier release 1.0.1 sur GitHub
3. Lancer l'exe 1.0.0
4. La notification devrait apparaître après quelques secondes

---

**Le système de mise à jour automatique est maintenant intégré !** 🚀
