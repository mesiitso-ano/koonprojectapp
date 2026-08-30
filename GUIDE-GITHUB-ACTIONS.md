# 🤖 GitHub Actions - Build Automatique

## ✅ CE QUI A ÉTÉ CRÉÉ

### 2 Workflows automatiques

1. **`build-release.yml`** - Build de production
   - Se déclenche quand vous créez un tag (v1.0.0, v1.0.1...)
   - Compile en mode release (optimisé)
   - Crée automatiquement une Release GitHub
   - Upload .exe + .msi

2. **`test-build.yml`** - Build de test
   - Se déclenche à chaque push sur main/develop
   - Compile en mode debug (rapide)
   - Vérifie que le code compile sans erreur

---

## 🚀 COMMENT PUBLIER UNE NOUVELLE VERSION

### Méthode Automatique (Recommandée)

```powershell
# 1. Modifier le code
# 2. Commiter les changements
git add .
git commit -m "Ajout de nouvelles fonctionnalités"

# 3. Créer un tag de version
git tag v1.0.1

# 4. Push le tag
git push origin v1.0.1
```

**C'EST TOUT !** GitHub va :
1. ✅ Compiler automatiquement
2. ✅ Créer le .exe
3. ✅ Créer une Release
4. ✅ Uploader les fichiers

⏱️ **Temps** : 10-15 minutes (dans le cloud, pas sur votre PC)

---

## 📦 AVANTAGES

### Plus besoin de compiler sur votre PC !
- ❌ Plus de problèmes de permissions
- ❌ Plus d'attente de 20 minutes
- ❌ Plus d'erreurs "Accès refusé"
- ✅ Compilation dans le cloud (serveurs GitHub)
- ✅ Cache intelligent (2ème fois = 3 minutes)
- ✅ .exe créé automatiquement

### Workflow simplifié
```
AVANT :
  Code → Compile (20 min) → Upload GitHub → Créer Release

MAINTENANT :
  Code → git push → ✅ TOUT AUTO !
```

---

## 🎯 UTILISATION

### Push normal (test automatique)
```powershell
git add .
git commit -m "Fix bug"
git push
```
→ GitHub compile en debug pour vérifier (3 min)

### Nouvelle version (release automatique)
```powershell
# 1. Changer version dans tauri.conf.json et package.json
# 2. Commiter
git add .
git commit -m "v1.0.1"

# 3. Créer tag et push
git tag v1.0.1
git push origin v1.0.1
```
→ GitHub compile en release et crée la Release (15 min)

---

## 📊 VOIR LES BUILDS

1. Aller sur : https://github.com/mesiitso-ano/koonprojectapp
2. Cliquer sur onglet **"Actions"**
3. Voir les builds en cours / terminés
4. Télécharger les .exe dans "Artifacts"

---

## 🔧 LANCEMENT MANUEL

Vous pouvez aussi lancer un build manuellement :

1. Aller sur https://github.com/mesiitso-ano/koonprojectapp/actions
2. Cliquer sur "Build et Release Automatique"
3. Cliquer sur "Run workflow"
4. Choisir la branche
5. Cliquer "Run workflow"

---

## ⚡ CACHE INTELLIGENT

Le cache Cargo/npm accélère les builds suivants :
- **1er build** : 15-20 min
- **Builds suivants** : 3-5 min (grâce au cache)

---

## 🎉 RÉSULTAT

Vous codez, vous push → **le .exe apparaît dans les Releases GitHub** !

Plus besoin de compiler sur votre PC ! 🚀

---

## 📝 EXEMPLE COMPLET

```powershell
# Développement quotidien
cd c:\Users\DOM\Desktop\koon

# Modifier du code...
# Tester localement avec : npm run tauri dev

# Quand c'est prêt
git add .
git commit -m "Ajout système de notifications"
git push

# GitHub teste automatiquement ✅

# Quand vous voulez publier une version
# 1. Modifier version dans tauri.conf.json (1.0.0 → 1.0.1)
# 2. Commiter
git add .
git commit -m "Release v1.0.1"

# 3. Créer le tag
git tag v1.0.1
git push origin v1.0.1

# 4. Attendre 15 min
# 5. Aller sur GitHub → Releases
# 6. ✅ Le .exe est là !
```

---

## 🔐 CONFIGURATION (À FAIRE UNE FOIS)

Les workflows sont déjà configurés ! Mais pour les activer :

1. Push les fichiers sur GitHub :
```powershell
git add .github/
git commit -m "Ajout GitHub Actions"
git push
```

2. C'est tout ! Les workflows sont actifs.

---

## 🎯 STATUT DES BUILDS

Badge à ajouter dans README.md :
```markdown
![Build Status](https://github.com/mesiitso-ano/koonprojectapp/workflows/Build%20et%20Release%20Automatique/badge.svg)
```

---

**Vous ne compilerez plus jamais localement !** 🎉
