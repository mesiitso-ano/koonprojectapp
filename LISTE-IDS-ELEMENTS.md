# 📋 Liste des IDs des éléments de l'interface KOON

> **Utilisation** : Survolez un élément avec la souris pour voir son ID dans le tooltip. Ensuite, dites "optimise BtnCreer1" par exemple.

---

## 📄 PAGE 1 - SetupPage (Page d'initialisation)

### Structure principale
- **Page1** - Container principal de SetupPage
- **Carte1** - Carte principale avec formulaire
- **Header1** - Section du titre
- **Titre1** - Titre "Koon"
- **Subtitle1** - Description "Messagerie chiffrée"

### Navigation
- **BtnRetour1** - Bouton retour (←) visible dans les modes create/restore

### Debug
- **BtnDebugDB1** - Bouton "Vérifier la base de données"
- **DBInfo1** - Zone d'affichage des infos DB

### Mode initial (choix)
- **BtnsInitial1** - Container des boutons initiaux
- **BtnCreer1** - Bouton "Créer un nouveau wallet"
- **BtnRestaurer1** - Bouton "Restaurer un wallet existant"

### Mode création
- **CreateMode1** - Formulaire de création
- **MnemonicBox1** - Boîte affichant la phrase mnémonique
- **MnemonicLabel1** - Label "Phrase de récupération"
- **MnemonicText1** - Texte de la phrase générée
- **AlertBox1** - Boîte d'alerte rouge
- **AlertIcon1** - Icône d'avertissement
- **AlertText1** - Texte d'avertissement
- **BtnConfirm1** - Bouton "J'ai sauvegardé ma phrase"

### Mode restauration
- **RestoreMode1** - Formulaire de restauration
- **InputGroup1** - Groupe du champ de saisie
- **InputLabel1** - Label du champ
- **InputMnemonic1** - Textarea pour saisir la phrase
- **ErrorMsg1** - Message d'erreur (si présent)
- **BtnRestaurerSubmit1** - Bouton "Restaurer"

---

## 📄 PAGE 2 - ChatPage (Page de conversation)

### Structure principale
- **Page2** - Container principal de ChatPage
- **Sidebar2** - Barre latérale des contacts
- **SidebarHeader2** - En-tête de la sidebar
- **HeaderTop2** - Section supérieure du header
- **TitreConv2** - Titre "Conversations"
- **BtnAddContact2** - Bouton ajouter contact (+)
- **PublicKeyDisplay2** - Affichage de la clé publique
- **KeyIcon2** - Icône de clé
- **MainChat2** - Zone principale de chat

### État vide
- **EmptyState2** - Placeholder quand aucun contact sélectionné
- **EmptyContent2** - Contenu du placeholder
- **EmptyIcon2** - Icône de l'état vide
- **EmptyText2** - Texte "Sélectionnez une conversation"

---

## 📄 COMPOSANT 3 - ContactList (Liste des contacts)

### Structure
- **ContactListScroll3** - Container scrollable des contacts
- **EmptyContactList3** - Message "Aucun contact"

### Items de contact (dynamiques)
- **ContactItem{id}** - Item de contact (ex: ContactItem123)
- **ContactHeader{id}** - Header du contact
- **ContactName{id}** - Nom du contact
- **UnreadBadge{id}** - Badge nombre de messages non lus
- **LastMsg{id}** - Dernier message prévisualisé

---

## 📄 COMPOSANT 4 - ChatWindow (Fenêtre de conversation)

### Header
- **ChatHeader4** - En-tête de la conversation
- **ContactInfo4** - Informations du contact
- **ContactNameHeader4** - Nom du contact dans le header
- **ContactPubKey4** - Clé publique tronquée

### Messages
- **MessagesScroll4** - Zone scrollable des messages

### Messages individuels (dynamiques)
- **MsgContainer{id}** - Container du message (ex: MsgContainer456)
- **MsgBubble{id}** - Bulle du message
- **MsgContent{id}** - Contenu texte du message
- **MsgMeta{id}** - Métadonnées (heure + statut)
- **MsgTime{id}** - Heure du message
- **MsgStatus{id}** - Statut d'envoi (sending/sent/failed)

### Input
- **InputArea4** - Zone de saisie en bas
- **InputGroup4** - Groupe input + bouton
- **InputMsg4** - Champ de saisie du message
- **BtnSend4** - Bouton d'envoi (icône avion)

---

## 📄 COMPOSANT 5 - AddContactModal (Modal d'ajout de contact)

### Structure
- **ModalOverlay5** - Fond sombre overlay
- **ModalCard5** - Carte de la modal
- **ModalHeader5** - En-tête de la modal
- **ModalTitre5** - Titre "Ajouter un contact"
- **BtnClose5** - Bouton fermer (X)

### Formulaire
- **NameGroup5** - Groupe champ nom
- **NameLabel5** - Label "Nom du contact"
- **InputName5** - Champ de saisie du nom
- **KeyGroup5** - Groupe champ clé publique
- **KeyLabel5** - Label "Clé publique"
- **InputKey5** - Textarea clé publique
- **ErrorMsg5** - Message d'erreur (si présent)
- **BtnAdd5** - Bouton "Ajouter"

---

## 🎯 Convention de nommage

- **Page{N}** : Pages principales (N = 1, 2, 3...)
- **Carte{N}** : Cartes/containers
- **Btn{Nom}{N}** : Boutons
- **Input{Nom}{N}** : Champs de saisie
- **{Element}{id}** : Éléments dynamiques avec ID unique

---

## ✅ Utilisation

1. **Survoler** un élément avec la souris
2. **Voir** le nom de l'ID dans le tooltip
3. **Dire** à Kiro : "optimise BtnCreer1" ou "change la couleur de Titre1"

---

**Total des éléments identifiés** : ~60+ éléments statiques + éléments dynamiques (messages, contacts)
