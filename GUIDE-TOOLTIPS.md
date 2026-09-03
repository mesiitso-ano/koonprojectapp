# 🎯 Guide d'utilisation des tooltips et IDs

## 📝 Qu'est-ce que c'est ?

Chaque élément de l'interface Koon possède maintenant :
1. **Un ID unique** (ex: `BtnCreer1`, `Page2`, `InputMsg4`)
2. **Un tooltip** qui s'affiche au survol avec la description

---

## 🖱️ Comment utiliser ?

### Étape 1 : Survoler un élément
Placez votre souris sur n'importe quel élément de l'interface (bouton, input, carte, etc.)

### Étape 2 : Lire le tooltip
Après ~1 seconde, un tooltip apparaît avec le format :
```
ID_ELEMENT - Description
```

Exemple :
```
BtnCreer1 - Create Wallet Button
```

### Étape 3 : Communiquer avec Kiro
Une fois que vous connaissez l'ID, vous pouvez dire à Kiro :
- ✅ "optimise BtnCreer1"
- ✅ "change la couleur de Titre1 en bleu"
- ✅ "augmente la taille de InputMsg4"
- ✅ "cache BtnDebugDB1"
- ✅ "ajoute une animation à Carte1"

---

## 📋 Liste complète des IDs

Consultez le fichier **`LISTE-IDS-ELEMENTS.md`** pour voir tous les IDs disponibles, organisés par page et composant.

---

## 🎨 Convention de nommage

| Préfixe | Signification | Exemple |
|---------|---------------|---------|
| `Page` | Page entière | Page1, Page2 |
| `Carte` | Conteneur principal | Carte1 |
| `Btn` | Bouton | BtnCreer1, BtnSend4 |
| `Input` | Champ de saisie | InputMsg4, InputName5 |
| `Modal` | Élément de modal | ModalCard5 |
| `Msg` | Message (dynamique) | MsgBubble123 |
| `Contact` | Contact (dynamique) | ContactItem456 |

**Numéro de suffixe** :
- `1` = SetupPage
- `2` = ChatPage
- `3` = ContactList
- `4` = ChatWindow
- `5` = AddContactModal

---

## 🔍 Exemples d'utilisation

### Scénario 1 : Modifier un bouton
```
Vous : *survole le bouton "Créer un nouveau wallet"*
Tooltip : "BtnCreer1 - Create Wallet Button"
Vous : "Kiro, change la couleur de BtnCreer1 en vert"
```

### Scénario 2 : Optimiser une zone
```
Vous : *survole la zone de messages*
Tooltip : "MessagesScroll4 - Messages Scroll Area"
Vous : "Kiro, optimise le scroll de MessagesScroll4"
```

### Scénario 3 : Masquer un élément debug
```
Vous : *survole le bouton debug DB*
Tooltip : "BtnDebugDB1 - Check Database Button"
Vous : "Kiro, supprime BtnDebugDB1 de la production"
```

---

## 🎯 Avantages

✅ **Précision** : Plus besoin de décrire "le bouton en haut à droite"
✅ **Rapidité** : Communication directe avec l'ID exact
✅ **Clarté** : Aucune ambiguïté sur quel élément modifier
✅ **Traçabilité** : Les IDs sont documentés dans le code

---

## 📊 Éléments identifiés

- **Page 1 (SetupPage)** : ~20 éléments
- **Page 2 (ChatPage)** : ~15 éléments
- **ContactList** : ~6 éléments + dynamiques
- **ChatWindow** : ~12 éléments + dynamiques
- **AddContactModal** : ~12 éléments

**Total** : ~65+ éléments statiques + éléments dynamiques

---

## ⚠️ Notes importantes

1. Les éléments dynamiques (messages, contacts) ont des IDs générés avec leur ID unique :
   - `MsgContainer{id}` → `MsgContainer123abc`
   - `ContactItem{id}` → `ContactItem456def`

2. Les tooltips apparaissent après ~1 seconde de survol (comportement natif du navigateur)

3. Si un tooltip n'apparaît pas, vérifiez que l'élément a bien un attribut `title` dans le code

---

## 🚀 Prêt à utiliser !

Survolez n'importe quel élément de Koon et voyez son ID apparaître dans le tooltip.
Ensuite, communiquez avec Kiro en utilisant cet ID pour des modifications ultra-précises !
