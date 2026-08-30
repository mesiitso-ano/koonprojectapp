# 🧪 Guide de Test - Koon

## Scénario de Test Complet

Ce guide vous permet de tester toutes les fonctionnalités de Koon.

---

## 🚀 Étape 1 : Lancement de l'Application

1. Double-cliquez sur **`dev.bat`**
2. Attendez la compilation Rust (5-15 min la première fois)
3. L'application s'ouvre automatiquement

✅ **Attendu** : Fenêtre Koon s'ouvre sur la page Setup

---

## 📝 Étape 2 : Création du Wallet

### Test 2A : Nouveau Wallet

1. Cliquez sur **"Créer un nouveau wallet"**
2. Une phrase de 24 mots apparaît
3. **Copiez cette phrase** dans un fichier texte (pour les tests)
4. Cliquez sur **"J'ai sauvegardé ma phrase"**

✅ **Attendu** :
- Phrase mnémonique de 24 mots en anglais
- Transition vers l'interface de chat
- Votre clé publique s'affiche en haut à gauche

**Exemple de phrase** :
```
abandon ability able about above absent absorb abstract absurd abuse access accident account accuse achieve acid acoustic acquire across act action actor actress actual
```

### Test 2B : Restauration de Wallet

1. Relancez l'application (ou supprimez la DB : `%LOCALAPPDATA%\koon\koon.db`)
2. Cliquez sur **"Restaurer un wallet existant"**
3. Collez la phrase de 24 mots sauvegardée
4. Cliquez sur **"Restaurer"**

✅ **Attendu** :
- Même clé publique que précédemment
- Transition vers l'interface de chat

❌ **Test d'erreur** :
- Entrez une phrase invalide → Message d'erreur "Phrase mnémonique invalide"

---

## 👥 Étape 3 : Ajout de Contacts

1. Cliquez sur le bouton **"+"** en haut à droite
2. Remplissez :
   - **Nom** : Alice
   - **Clé publique** : `a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2` (64 caractères hex)
3. Cliquez sur **"Ajouter"**

✅ **Attendu** :
- Alice apparaît dans la liste des contacts
- Modal se ferme automatiquement

**Ajoutez 2-3 contacts supplémentaires** :
- Bob : `b1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2`
- Charlie : `c1c2c3c4c5c6c1c2c3c4c5c6c1c2c3c4c5c6c1c2c3c4c5c6c1c2c3c4c5c6c1c2`

❌ **Tests d'erreur** :
- Nom vide → "Le nom est requis"
- Clé invalide (pas 64 caractères) → "Clé publique invalide"

---

## 💬 Étape 4 : Envoi de Messages

1. Cliquez sur **Alice** dans la liste
2. La fenêtre de chat s'ouvre
3. Tapez : `Hello Alice!`
4. Cliquez sur le bouton d'envoi (ou Entrée)

✅ **Attendu** :
- Message apparaît à droite (bulle violette)
- Horodatage affiché
- Status : ⏳ → ✓✓
- Animation d'apparition fluide

**Envoyez plusieurs messages** :
- Message court : `Test`
- Message long : `Ceci est un message beaucoup plus long pour tester le word-wrap et voir comment l'interface gère les messages sur plusieurs lignes.`
- Avec retour à la ligne : Shift+Entrée

✅ **Attendu** :
- Tous les messages s'affichent
- Scroll automatique vers le bas
- Messages bien alignés

---

## 🔄 Étape 5 : Navigation Entre Contacts

1. Cliquez sur **Bob** dans la liste
2. Envoyez : `Hey Bob!`
3. Revenez sur **Alice**
4. Envoyez : `Alice, je reviens!`

✅ **Attendu** :
- Historique conservé pour chaque contact
- Changement instantané de conversation
- Dernier message affiché dans la liste

---

## 💾 Étape 6 : Persistance des Données

1. Fermez l'application (Alt+F4)
2. Relancez `dev.bat`

✅ **Attendu** :
- Application s'ouvre directement sur la page Chat (pas Setup)
- Wallet restauré automatiquement
- Tous les contacts présents
- Tous les messages conservés

---

## 🔐 Étape 7 : Test de Cryptographie

### Vérification de la Génération de Clés

1. Ouvrez la console développeur (F12)
2. Dans l'onglet Console, tapez :
   ```javascript
   console.log(localStorage)
   ```

✅ **Attendu** :
- Aucune clé privée visible en clair dans localStorage
- Données stockées uniquement dans SQLite

### Test de Dérivation BIP39

1. Utilisez cette phrase de test BIP39 :
   ```
   abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon art
   ```
2. Restaurez le wallet avec cette phrase
3. Vérifiez que la clé publique générée est toujours la même

✅ **Attendu** : Dérivation déterministe (même phrase = même clé)

---

## 🎨 Étape 8 : Test de l'Interface

### Responsive
1. Redimensionnez la fenêtre
2. Réduisez la largeur au minimum (800px)

✅ **Attendu** : Interface reste utilisable

### Animations
1. Envoyez plusieurs messages rapidement
2. Observez les animations d'apparition

✅ **Attendu** : Animations fluides, pas de lag

### Scrollbar
1. Envoyez 20+ messages
2. Scrollez dans l'historique

✅ **Attendu** : Scrollbar personnalisée (étroite, violette)

---

## 🗂️ Étape 9 : Vérification de la Base de Données

### Emplacement SQLite

1. Ouvrez l'explorateur Windows
2. Allez dans : `%LOCALAPPDATA%\koon\`
3. Vous devriez voir : `koon.db`

✅ **Attendu** : Fichier DB créé

### Inspection (optionnel)

Si vous avez **DB Browser for SQLite** :
1. Ouvrez `koon.db`
2. Vérifiez les tables :
   - `wallet` : 1 ligne avec votre mnémonique
   - `contacts` : 3 lignes (Alice, Bob, Charlie)
   - `messages` : Tous vos messages

---

## ❌ Étape 10 : Tests d'Erreurs

### 10A : Port Occupé
1. Lancez `dev.bat`
2. Sans fermer, relancez `dev.bat` à nouveau

❌ **Attendu** : Erreur "Port 1420 already in use"

### 10B : Suppression de la DB
1. Fermez l'application
2. Supprimez `%LOCALAPPDATA%\koon\koon.db`
3. Relancez l'application

✅ **Attendu** : Retour sur la page Setup

### 10C : Clé Publique Invalide
1. Ajoutez un contact avec clé : `invalide`
2. Essayez de sauvegarder

❌ **Attendu** : Message d'erreur

---

## 🏆 Checklist Complète

- [ ] Création de wallet fonctionne
- [ ] Restauration de wallet fonctionne
- [ ] Phrase mnémonique valide (24 mots)
- [ ] Ajout de contacts fonctionne
- [ ] Validation des clés publiques
- [ ] Envoi de messages fonctionne
- [ ] Historique par contact fonctionne
- [ ] Navigation entre contacts fonctionne
- [ ] Persistance SQLite fonctionne
- [ ] Scroll automatique fonctionne
- [ ] Animations fluides
- [ ] Status des messages (⏳/✓✓)
- [ ] Interface responsive
- [ ] Console sans erreurs
- [ ] Base de données créée
- [ ] Gestion des erreurs fonctionnelle

---

## 📊 Résultats Attendus

Si **tous les tests passent** :
- ✅ Le projet est **100% fonctionnel**
- ✅ Prêt pour le développement de features avancées
- ✅ Base solide pour l'ajout du réseau P2P

Si **des tests échouent** :
- 🔍 Consultez `TROUBLESHOOTING.md`
- 🐛 Vérifiez la console (F12)
- 📝 Notez le message d'erreur exact

---

## 🎯 Tests Avancés (Optionnels)

### Performance
1. Ajoutez 50 contacts
2. Envoyez 100 messages
3. Mesurez la réactivité

### Stress Test
1. Envoyez des messages très longs (5000+ caractères)
2. Testez avec des caractères spéciaux : émojis 🚀, accents éèà, symboles @#$%

### Sécurité
1. Inspectez le code réseau (F12 → Network)
2. Vérifiez qu'aucune clé privée n'est transmise en clair
3. Testez l'injection SQL dans les noms de contacts

---

**Temps estimé pour tous les tests** : 15-20 minutes

**Bonne chance !** 🚀
