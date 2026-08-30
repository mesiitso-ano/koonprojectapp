# Requirements: Section Publicités / Annonces

## Introduction

Ajouter une section dédiée aux publicités et annonces dans l'application Koon (Electron + React, chat E2E chiffré). Cette section est accessible depuis la sidebar et visible par tous les utilisateurs sans exception. N'importe quel utilisateur peut publier une annonce ; les comptes entreprise bénéficient d'un badge de certification. L'interface respecte le thème sombre de Koon (`#0d0d0d`, accent `#7c3aed`).

---

## Requirements

### Requirement 1 — Accès à la section Publicités

**User Story:** En tant qu'utilisateur de Koon, je veux accéder à une section "Publicités / Annonces" depuis la sidebar, afin de consulter les offres disponibles sans avoir à quitter l'application.

#### Acceptance Criteria
1. GIVEN que je suis connecté à Koon WHEN je consulte la sidebar THEN un onglet "Publicités" est visible et accessible.
2. GIVEN que je clique sur l'onglet "Publicités" WHEN la section se charge THEN la liste des annonces s'affiche dans le panneau principal.
3. GIVEN n'importe quel utilisateur authentifié WHEN il ouvre l'application THEN la section Publicités est accessible et ne peut pas être masquée ou désactivée.

---

### Requirement 2 — Affichage d'une annonce

**User Story:** En tant qu'utilisateur, je veux voir les annonces dans un format structuré et lisible, afin d'identifier rapidement les offres qui m'intéressent.

#### Acceptance Criteria
1. GIVEN qu'une annonce existe WHEN elle est affichée dans la liste THEN elle contient : logo de l'entreprise, nom de l'entreprise, média (image ou vidéo ≤ 5 min), texte de description et un bouton Call to Action configurable.
2. GIVEN une annonce avec une vidéo WHEN la vidéo est chargée THEN elle ne dépasse pas 5 minutes ; toute vidéo plus longue est rejetée à la publication.
3. GIVEN l'interface de la section WHEN elle s'affiche THEN le design respecte le thème sombre (`background: #0d0d0d`, accent `#7c3aed`) et est épuré et flexible.

---

### Requirement 3 — Publication d'une annonce

**User Story:** En tant qu'utilisateur, je veux pouvoir publier une annonce dans la section Publicités, afin de promouvoir mes produits ou services auprès de tous les utilisateurs de Koon.

#### Acceptance Criteria
1. GIVEN que je suis un utilisateur authentifié WHEN je clique sur "Créer une annonce" THEN un formulaire de création s'ouvre avec les champs : logo, nom d'entreprise, média, description, libellé et URL du bouton CTA.
2. GIVEN que je remplis tous les champs obligatoires WHEN je soumets le formulaire THEN l'annonce est publiée et apparaît dans la section Publicités.
3. GIVEN que je soumets le formulaire avec des champs obligatoires manquants WHEN la validation s'exécute THEN un message d'erreur précis s'affiche pour chaque champ manquant et la publication est bloquée.

---

### Requirement 4 — Demande de compte entreprise et badge de certification

**User Story:** En tant qu'utilisateur de base, je veux demander un upgrade vers un compte entreprise en fournissant mes documents officiels, afin d'obtenir un badge de certification visible par tous sur mes annonces.

#### Acceptance Criteria
1. GIVEN que je suis un utilisateur de base WHEN je clique sur "Devenir compte entreprise" THEN un formulaire de demande s'ouvre avec les champs : numéro CFE, NIF, et justificatifs (upload de fichiers).
2. GIVEN que j'ai soumis ma demande avec tous les documents requis WHEN la demande est en cours de vérification THEN mon compte affiche un statut "Vérification en cours".
3. GIVEN que ma demande est approuvée WHEN je publie ou affiche une annonce THEN un badge de certification est visible sur mon profil entreprise et sur chacune de mes annonces.
4. GIVEN qu'un utilisateur consulte une annonce d'un compte certifié WHEN il regarde le nom de l'entreprise THEN le badge de certification est affiché de manière visible à côté du nom.

---

### Requirement 5 — Inspection détaillée d'une annonce

**User Story:** En tant qu'utilisateur, je veux pouvoir inspecter le détail complet d'une annonce et visiter le profil de l'entreprise, afin d'obtenir toutes les informations avant de m'engager.

#### Acceptance Criteria
1. GIVEN qu'une annonce est affichée WHEN je clique sur "Voir le détail" THEN une vue détaillée s'ouvre avec l'intégralité du contenu de l'annonce, les informations de l'entreprise et ses certifications.
2. GIVEN la vue détaillée d'une annonce WHEN je clique sur "Visiter l'entreprise" THEN le profil complet de l'entreprise s'affiche (nom, description, annonces publiées, badge de certification).
3. GIVEN le profil d'une entreprise certifiée WHEN je consulte la section certifications THEN la liste des certifications obtenues (CFE, NIF, etc.) est affichée.

---

### Requirement 6 — Statistiques de performance d'une annonce

**User Story:** En tant qu'utilisateur, je veux consulter les statistiques de performance d'une annonce (vues, likes, commentaires), afin d'évaluer sa popularité et sa pertinence.

#### Acceptance Criteria
1. GIVEN qu'une annonce est publiée WHEN n'importe quel utilisateur la consulte THEN les statistiques (nombre de vues, nombre de likes, nombre de commentaires) sont affichées de manière visible.
2. GIVEN que je consulte les stats d'une annonce WHEN la page se charge THEN les compteurs sont mis à jour en temps réel ou à chaque rechargement de la section.
3. GIVEN que je suis l'auteur de l'annonce WHEN je consulte mes propres statistiques THEN j'ai accès à des métriques détaillées (évolution temporelle des vues, taux d'engagement).

---

### Requirement 7 — Interactions sociales : likes, commentaires et favoris

**User Story:** En tant qu'utilisateur, je veux pouvoir liker, commenter et mettre en favori une annonce, afin d'interagir avec le contenu et retrouver facilement les offres qui m'intéressent.

#### Acceptance Criteria
1. GIVEN qu'une annonce est affichée WHEN je clique sur le bouton "Like" THEN mon like est enregistré, le compteur s'incrémente et le bouton passe à l'état "liké".
2. GIVEN que j'ai déjà liké une annonce WHEN je clique à nouveau sur "Like" THEN mon like est retiré et le compteur se décrémente.
3. GIVEN qu'une annonce est affichée WHEN je clique sur "Commenter" THEN un champ de saisie s'ouvre et je peux soumettre un commentaire textuel.
4. GIVEN que je soumets un commentaire WHEN il est publié THEN il apparaît dans la liste des commentaires de l'annonce avec mon nom et la date.
5. GIVEN qu'une annonce m'intéresse WHEN je clique sur l'icône "Favori" THEN l'annonce est ajoutée à ma liste de favoris accessible dans les paramètres de la section.

---

### Requirement 8 — Tri, priorisation et filtrage des annonces

**User Story:** En tant qu'utilisateur, je veux trier et prioriser les annonces selon mes préférences, afin de voir en premier les offres les plus pertinentes pour moi.

#### Acceptance Criteria
1. GIVEN que je suis dans la section Publicités WHEN j'utilise le sélecteur de tri THEN je peux trier les annonces par : date de publication (plus récente/ancienne), popularité (nombre de vues ou de likes), et secteur d'activité.
2. GIVEN qu'une annonce m'intéresse particulièrement WHEN je clique sur "Prioriser" THEN l'annonce est épinglée en haut de ma liste personnelle et reste visible en priorité.
3. GIVEN que j'ai configuré des filtres de langue WHEN la section se charge THEN seules les annonces dans la ou les langues sélectionnées sont affichées.

---

### Requirement 9 — Notifications et alertes

**User Story:** En tant qu'utilisateur, je veux activer des alertes pour une annonce ou une entreprise spécifique, afin d'être notifié des nouvelles publications ou mises à jour qui m'intéressent.

#### Acceptance Criteria
1. GIVEN qu'une annonce est affichée WHEN je clique sur "Activer les alertes" THEN je reçois une notification dans l'application à chaque mise à jour de cette annonce.
2. GIVEN que je consulte le profil d'une entreprise WHEN je clique sur "Suivre" THEN je reçois une notification à chaque nouvelle annonce publiée par cette entreprise.
3. GIVEN que j'ai activé une alerte WHEN je veux la désactiver THEN je peux le faire depuis la page de l'annonce/entreprise ou depuis les paramètres de la section.
4. GIVEN une annonce que je veux consulter plus tard WHEN je clique sur "Me rappeler plus tard" (snooze) THEN une notification est planifiée après un délai configurable (ex : 1h, demain, dans 1 semaine).

---

### Requirement 10 — Historique de consultation

**User Story:** En tant qu'utilisateur, je veux retrouver dans mon historique les annonces que j'ai consultées, afin de ne pas perdre le fil des offres qui m'ont intéressé.

#### Acceptance Criteria
1. GIVEN que je consulte le détail d'une annonce WHEN je ferme la vue détaillée THEN l'annonce est automatiquement enregistrée dans mon historique de consultation.
2. GIVEN que je navigue vers l'historique WHEN la liste se charge THEN les annonces consultées sont affichées par ordre chronologique décroissant avec leur date de consultation.
3. GIVEN que mon historique contient des entrées WHEN je clique sur une entrée THEN je suis redirigé vers le détail de l'annonce correspondante.
4. GIVEN mon historique WHEN je veux le purger THEN une option "Vider l'historique" est disponible et demande une confirmation avant suppression.

---

### Requirement 11 — Communication directe avec une entreprise

**User Story:** En tant qu'utilisateur, je veux pouvoir écrire directement à une entreprise depuis une annonce, afin d'engager une conversation privée chiffrée de bout en bout sans quitter Koon.

#### Acceptance Criteria
1. GIVEN que je consulte une annonce WHEN je clique sur "Écrire à l'entreprise" THEN une conversation privée E2E chiffrée s'ouvre avec le compte de l'entreprise dans le module de chat existant.
2. GIVEN que la conversation est ouverte WHEN j'envoie un message THEN il est chiffré de bout en bout selon le protocole existant de Koon.
3. GIVEN que l'entreprise n'est pas encore dans mes contacts WHEN j'initie la conversation THEN le compte entreprise est automatiquement ajouté à mes contacts.

---

### Requirement 12 — Paramètres de la section Publicités

**User Story:** En tant qu'utilisateur, je veux configurer mes préférences pour la section Publicités (langue, favoris, abonnements, notifications), afin de personnaliser mon expérience et ne voir que le contenu pertinent.

#### Acceptance Criteria
1. GIVEN que je suis dans la section Publicités WHEN j'ouvre les paramètres THEN je vois les options : langue des publicités, gestion des favoris, liste des entreprises suivies, et configuration des alertes.
2. GIVEN la configuration de la langue WHEN je sélectionne une ou plusieurs langues THEN seules les annonces dans ces langues sont affichées dans la section.
3. GIVEN la liste des entreprises suivies WHEN je clique sur "Ne plus suivre" à côté d'une entreprise THEN je ne reçois plus ses alertes et ses annonces sont déprioritisées dans ma vue.
4. GIVEN la gestion des favoris WHEN j'ouvre cette section THEN toutes mes annonces mises en favori sont listées et je peux les retirer ou les organiser.
5. GIVEN la configuration des alertes WHEN je modifie mes préférences THEN les changements sont sauvegardés et appliqués immédiatement sans redémarrage de l'application.
