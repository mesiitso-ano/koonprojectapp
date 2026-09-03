# 🧪 TEST Step1 - Flow d'inscription

## ✅ Checklist de test manuel

### Étape 0 : Démarrage
- [ ] App lance correctement
- [ ] Page blanche avec boutons "Inscription" et "Connexion"
- [ ] StepIndicator N'est PAS visible

### Étape 1 : Clic "Inscription"
- [ ] Loader "Koon" apparaît (noir avec ligne bleue)
- [ ] Loader dure exactement 4 secondes
- [ ] Après 4s : Loader disparaît

### Étape 2 : Affichage Step1 + Mots (33%)
- [ ] StepIndicator apparaît à gauche (50px du bord)
- [ ] Step1 montre le chiffre "1"
- [ ] Cercle Step1 se remplit progressivement à 33% (noir)
- [ ] 24 mots affichés dans la carte
- [ ] Bouton "📋 Copier" visible (bleu)
- [ ] Bouton "Suivant" visible mais DÉSACTIVÉ (gris)

### Étape 3 : Copier les mots (66%)
- [ ] Clic sur "📋 Copier"
- [ ] Bouton devient "✓ Copié" (vert)
- [ ] Step1 progresse à 66% (cercle noir)
- [ ] Bouton "Suivant" devient ACTIF (noir)

### Étape 4 : Passer à la validation
- [ ] Clic sur "Suivant"
- [ ] Carte change : Affiche textarea pour coller
- [ ] Step1 reste à 66%
- [ ] Bouton "Valider" visible (vert)

### Étape 5 : Validation CORRECTE (100%)
- [ ] Coller les 24 mots dans textarea
- [ ] Clic sur "Valider"
- [ ] Step1 progresse immédiatement à 100%
- [ ] Le "1" disparaît
- [ ] Loader tournant apparaît pendant 3s
- [ ] Après 3s : ✅ Check vert apparaît
- [ ] Step1 monte + disparaît (animation slow)
- [ ] Step2 devient actif (TODO: formulaire)

### Étape 6 : Validation INCORRECTE (Error)
- [ ] Coller MAUVAIS texte dans textarea
- [ ] Clic sur "Valider"
- [ ] Step1 progresse à 100%
- [ ] Loader tournant 3s
- [ ] Après 3s : ❌ Croix rouge apparaît
- [ ] Message erreur "La phrase ne correspond pas !"
- [ ] Après 2s : Retour à affichage mots (33%)

---

## 🎯 Tests automatiques (logique)

### Progression Step1
- 0% → Loader
- 33% → Mots affichés
- 66% → Mots copiés
- 100% → Validation en cours
- Success → Transition Step2
- Error → Retour 33%

### États StepStatus
- "progress" → Cercle se remplit
- "validating" → Loader tourne
- "success" → Check vert
- "error" → Croix rouge

---

## ⚠️ Bugs possibles à vérifier

1. **Copie ne fonctionne pas** → Vérifier `navigator.clipboard.writeText`
2. **Progression bloquée** → Vérifier `setStepProgress`
3. **Loader infini** → Vérifier `setTimeout` (3000ms)
4. **Animation Step1 ne joue pas** → Vérifier CSS `animate-step-exit`
5. **Step2 n'apparaît pas** → Vérifier `setCurrentStep(2)`

---

## 🔍 Variables à monitorer (console.log)

```
🔧 SetupPage: Rendu, mode = create, Progress = 33, SubStep = display
✅ Mnémonique copié
🔧 SetupPage: Rendu, mode = create, Progress = 66, SubStep = validate
```

---

## ✅ État final attendu

Après validation réussie :
- Step1 complété (✅ check vert puis disparu)
- Step2 actif (cercle noir, progression 0%)
- CurrentStep = 2
- StepProgress = 0
- StepStatus = "progress"
