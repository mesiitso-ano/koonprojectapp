# Tasks: Section Publicités

## Vue d'ensemble

Implémentation séquentielle de la section Publicités dans Koon (Electron + React + TypeScript + Tailwind CSS). Les tâches suivent l'ordre naturel de dépendance : base de données → backend IPC → stores Zustand → composants React → intégration finale.

---

- [ ] 1. Base de données — migrations et tables SQLite
  - Ajouter les 6 nouvelles tables dans `electron/db/database.ts` via la fonction `initDatabase` existante : `ads`, `ad_interactions`, `ad_comments`, `enterprise_profiles`, `ad_follows`, `ad_notifications`.
  - Ajouter les index de performance : `idx_ads_created_at`, `idx_ads_language`, `idx_ad_interactions_user`, `idx_ad_comments_ad`, `idx_ad_follows_user`.
  - Fichiers à modifier : `electron/db/database.ts`
  - _Requirements: 1, 2, 3, 4, 6, 7, 8, 9, 10_

  - [ ] 1.1 Créer la table `ads`
    - Définir les colonnes : `id TEXT PRIMARY KEY`, `author_pubkey`, `company_name`, `logo_url`, `media_type CHECK(IN 'image','video','none')`, `media_url`, `description`, `cta_label`, `cta_url`, `language`, `created_at INTEGER`, `status CHECK(IN 'active','paused','deleted')`.
    - Utiliser `CREATE TABLE IF NOT EXISTS` pour l'idempotence des migrations.

  - [ ] 1.2 Créer la table `ad_interactions`
    - Colonnes : `id`, `ad_id REFERENCES ads(id) ON DELETE CASCADE`, `user_pubkey`, `type CHECK(IN 'like','save','history','snooze')`, `created_at`.
    - Contrainte `UNIQUE(ad_id, user_pubkey, type)` pour éviter les doublons.

  - [ ] 1.3 Créer la table `ad_comments`
    - Colonnes : `id`, `ad_id REFERENCES ads(id) ON DELETE CASCADE`, `author_pubkey`, `content TEXT NOT NULL`, `created_at INTEGER`.

  - [ ] 1.4 Créer les tables `enterprise_profiles`, `ad_follows`, `ad_notifications`
    - `enterprise_profiles` : `pubkey PRIMARY KEY`, `company_name`, `logo_url`, `description`, `badge_status CHECK(IN 'none','pending','verified','rejected')`, `documents_ref`, `created_at`.
    - `ad_follows` : clé primaire composée `(user_pubkey, enterprise_pubkey)`, FK vers `enterprise_profiles`.
    - `ad_notifications` : `id`, `user_pubkey`, `ad_id`, `type CHECK(IN 'new_ad','followed_enterprise','comment_reply')`, `scheduled_at`, `dismissed INTEGER DEFAULT 0`.

  - [ ] 1.5 Ajouter les index de performance
    - Cinq index couvrant les colonnes fréquemment filtrées ou triées : `ads.created_at DESC`, `ads.language`, `ad_interactions.user_pubkey`, `ad_comments.ad_id`, `ad_follows.user_pubkey`.

---

- [ ] 2. Repository — `electron/db/adsRepo.ts`
  - Créer le fichier `electron/db/adsRepo.ts` en suivant le pattern de `messagesRepo.ts` : récupérer l'instance `db` depuis `database.ts`, exposer des fonctions synchrones fortement typées.
  - Implémenter toutes les requêtes SQL pour les annonces, interactions, commentaires, profils entreprise, abonnements et paramètres.
  - Fichiers à créer : `electron/db/adsRepo.ts`
  - _Requirements: 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12_

  - [ ] 2.1 Fonctions CRUD pour les annonces
    - `listAds(params: AdsListParams): Ad[]` — SELECT avec filtres dynamiques (langue, secteur, `showSaved`, `showFollowedOnly`), tri (date, popularité) et pagination `LIMIT`/`OFFSET`. Les compteurs `views_count`, `likes_count`, `comments_count` sont calculés par sous-requête COUNT.
    - `createAd(payload: AdCreatePayload): string` — INSERT + `crypto.randomUUID()` pour l'id, retourne l'id créé.
    - `getAdDetail(id: string): Ad | null` — SELECT avec jointure `enterprise_profiles` et interactions de l'utilisateur courant.

  - [ ] 2.2 Fonctions interactions et commentaires
    - `upsertInteraction(payload: AdInteractPayload, userPubkey: string): void` — INSERT OR REPLACE si `active = true`, DELETE si `active = false`. Enregistre automatiquement `type = 'history'` à chaque appel `getAdDetail`.
    - `addComment(payload: AdCommentPayload, authorPubkey: string): AdComment` — INSERT + retourne la ligne insérée.
    - `getComments(adId: string, limit: number, offset: number): AdComment[]` — SELECT paginé ORDER BY `created_at DESC`.

  - [ ] 2.3 Fonctions profil entreprise et abonnements
    - `requestEnterprise(payload, pubkey): BadgeStatus` — INSERT OR REPLACE dans `enterprise_profiles` avec `badge_status = 'pending'`, retourne le statut.
    - `getEnterpriseProfile(pubkey: string): EnterpriseProfile | null`.
    - `followEnterprise(userPubkey, enterprisePubkey): void` — INSERT OR IGNORE dans `ad_follows`.
    - `unfollowEnterprise(userPubkey, enterprisePubkey): void` — DELETE dans `ad_follows`.

  - [ ] 2.4 Fonctions paramètres utilisateur
    - Les préférences (`preferred_language`, `alert_new_ads`, `alert_followed_enterprises`, `hidden_enterprise_pubkeys`) sont sérialisées en JSON dans une table `user_settings` existante ou dans une nouvelle colonne dédiée.
    - `getAdsSettings(userPubkey): AdsSettings` — retourne les préférences ou les valeurs par défaut si absentes.
    - `saveAdsSettings(userPubkey, settings: Partial<AdsSettings>): void` — merge avec les valeurs existantes, persiste en JSON.

---

- [ ] 3. Handlers IPC — enregistrement des 13 canaux
  - Importer `adsRepo` dans `electron/ipc/handlers.ts` et enregistrer les 13 nouveaux canaux IPC dans la fonction `registerHandlers` existante.
  - La clé publique de l'utilisateur courant est lue depuis la DB ou l'identité active — jamais transmise depuis le renderer pour éviter toute usurpation.
  - Fichiers à modifier : `electron/ipc/handlers.ts`
  - _Requirements: 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12_

  - [ ] 3.1 Canaux relatifs aux annonces
    - `ads:list` → `adsRepo.listAds(params)`
    - `ads:create` → `adsRepo.createAd(payload)`
    - `ads:getDetail` → `adsRepo.getAdDetail(id)` + enregistrement automatique de l'interaction `history`
    - `ads:interact` → `adsRepo.upsertInteraction(payload, currentUserPubkey)`
    - `ads:comment` → `adsRepo.addComment(payload, currentUserPubkey)`
    - `ads:getComments` → `adsRepo.getComments(ad_id, limit, offset)`

  - [ ] 3.2 Canaux relatifs aux entreprises
    - `enterprise:request` → `adsRepo.requestEnterprise(payload, currentUserPubkey)`
    - `enterprise:getProfile` → `adsRepo.getEnterpriseProfile(pubkey)`
    - `enterprise:follow` → `adsRepo.followEnterprise(currentUserPubkey, enterprise_pubkey)`
    - `enterprise:unfollow` → `adsRepo.unfollowEnterprise(currentUserPubkey, enterprise_pubkey)`

  - [ ] 3.3 Canaux paramètres
    - `ads:getSettings` → `adsRepo.getAdsSettings(currentUserPubkey)`
    - `ads:saveSettings` → `adsRepo.saveAdsSettings(currentUserPubkey, settings)`

---

- [ ] 4. Preload et typages TypeScript
  - Exposer les 13 canaux IPC dans `electron/preload.ts` via `contextBridge.exposeInMainWorld` sous les namespaces `window.electronAPI.ads` et `window.electronAPI.enterprise`.
  - Déclarer les interfaces TypeScript correspondantes dans `src/types/global.d.ts` pour que le renderer soit entièrement typé.
  - Fichiers à modifier : `electron/preload.ts`, `src/types/global.d.ts`
  - _Requirements: 1, 2, 3, 4, 5, 7, 9, 12_

  - [ ] 4.1 Exposition dans `preload.ts`
    - Ajouter l'objet `ads` avec les méthodes : `list`, `create`, `getDetail`, `interact`, `comment`, `getComments`, `getSettings`, `saveSettings`.
    - Ajouter l'objet `enterprise` avec les méthodes : `request`, `getProfile`, `follow`, `unfollow`.
    - Chaque méthode appelle `ipcRenderer.invoke(canal, ...args)`.

  - [ ] 4.2 Déclarations de types dans `global.d.ts`
    - Déclarer les interfaces `AdsAPI` et `EnterpriseAPI` avec les signatures de toutes les méthodes.
    - Étendre `Window['electronAPI']` pour inclure `ads: AdsAPI` et `enterprise: EnterpriseAPI`.
    - Déclarer les types partagés utilisés côté renderer : `Ad`, `AdComment`, `EnterpriseProfile`, `AdsFilters`, `AdsSettings`, `AdInteractionType`, `BadgeStatus`.

---

- [ ] 5. Stores Zustand — état global frontend
  - Créer les 3 nouveaux stores dans `src/store/` en suivant le pattern des stores existants (Zustand + `immer` si déjà utilisé, sinon spread).
  - Fichiers à créer : `src/store/adsStore.ts`, `src/store/adsSettingsStore.ts`, `src/store/enterpriseStore.ts`
  - _Requirements: 2, 4, 7, 8, 9, 12_

  - [ ] 5.1 `adsStore.ts`
    - State : `ads: Ad[]`, `selectedAdId: string | null`, `filters: AdsFilters`, `isLoading: boolean`.
    - Actions : `fetchAds()` — appelle `window.electronAPI.ads.list(filters)` et met à jour `ads`.
    - Actions : `selectAd(id)`, `setFilters(partial)` — met à jour les filtres puis appelle `fetchAds()`.
    - Actions : `interact(adId, type, active)` — appelle IPC `ads:interact`, puis met à jour localement le compteur dans `ads` (optimistic update).

  - [ ] 5.2 `adsSettingsStore.ts`
    - State : `settings: AdsSettings`, `isLoaded: boolean`.
    - Action `load()` : appelle `ads:getSettings` et hydrate le store.
    - Action `save(partial)` : merge local + appelle `ads:saveSettings`, met à jour le state immédiatement (optimistic).

  - [ ] 5.3 `enterpriseStore.ts`
    - State : `profile: EnterpriseProfile | null`, `followedPubkeys: string[]`.
    - Action `loadProfile(pubkey)` : appelle `enterprise:getProfile`.
    - Action `requestUpgrade(payload)` : appelle `enterprise:request`, met à jour `profile.badge_status`.
    - Actions `follow(pubkey)` / `unfollow(pubkey)` : appellent les IPC correspondants et mettent à jour `followedPubkeys`.

---

- [ ] 6. Composants de base — `AdCard` et `AdFilters`
  - Créer les deux composants fondamentaux qui serviront de briques à tous les autres.
  - Respecter le thème sombre : fond `#1a1a1a`, bordures `#2a2a2a`, accent `#7c3aed`, hover `#3a3a3a`.
  - Fichiers à créer : `src/components/ads/AdCard.tsx`, `src/components/ads/AdFilters.tsx`
  - _Requirements: 2, 7, 8_

  - [ ] 6.1 `AdCard.tsx`
    - Layout à 4 zones : header (logo 32px + nom entreprise + badge `✓`), média (aspect-video, `object-cover`), body (description `line-clamp-2`), footer (bouton CTA violet + compteur vues + actions like/commentaire/favori).
    - Props : `ad: Ad`, `userInteractions?: AdInteractionType[]`, `onSelect?: (id: string) => void`, `onInteract?: (adId, type, active) => void`.
    - Les boutons like, favori et snooze reflètent visuellement l'état actif (couleur accent vs gris).
    - Classes Tailwind : `rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] overflow-hidden transition-all hover:border-[#3a3a3a] hover:shadow-lg hover:shadow-black/40`.

  - [ ] 6.2 `AdFilters.tsx`
    - Barre horizontale avec 5 contrôles : `select` Tri (plus récent / plus ancien / popularité), `select` Langue (toutes / fr / en / …), `select` Secteur (liste prédéfinie), `toggle` Favoris uniquement, `toggle` Entreprises suivies uniquement.
    - Lit et écrit directement dans `useAdsStore` via `setFilters()`.
    - Déclenche automatiquement `fetchAds()` à chaque changement de filtre.

---

- [ ] 7. Composants interactifs — commentaires, formulaire et paramètres
  - Créer les composants gérant les interactions utilisateur : commentaires, création d'annonce, paramètres.
  - Fichiers à créer : `src/components/ads/AdComments.tsx`, `src/components/ads/AdCreateForm.tsx`, `src/components/ads/AdsSettings.tsx`
  - _Requirements: 3, 7, 9, 12_

  - [ ] 7.1 `AdComments.tsx`
    - Props : `adId: string`.
    - Charge les commentaires via `ads:getComments` à l'ouverture, pagination par bouton "Charger plus".
    - Affiche l'auteur sous forme tronquée : 8 premiers caractères + `…` + 4 derniers de la pubkey.
    - Champ de saisie avec compteur visuel 300 caractères max ; soumission via `ads:comment` + optimistic insert en tête de liste.

  - [ ] 7.2 `AdCreateForm.tsx`
    - Réservé aux entreprises vérifiées (`badge_status === 'verified'` dans `enterpriseStore`).
    - Champs : description (textarea, max 500), CTA label (input, max 50), CTA URL (input, validation URL), langue (select ISO 639-1), type de média (radio), URL média (input conditionnel).
    - Validation côté client avant soumission ; messages d'erreur par champ.
    - Soumission via `ads:create`, puis appel `adsStore.fetchAds()` pour rafraîchir la liste.

  - [ ] 7.3 `AdsSettings.tsx`
    - Panneau (slide-in depuis la droite ou modal) avec 5 sections : langue préférée, alertes (toggles), entreprises masquées (liste + "Démasquer"), favoris (lien vers vue filtrée), abonnements (liste + "Se désabonner").
    - Lit depuis `useAdsSettingsStore`, persiste via `save(partial)`.
    - "Se désabonner" appelle `enterpriseStore.unfollow()` et met à jour l'affichage immédiatement.

---

- [ ] 8. Composants modaux — détail, profil entreprise, demande upgrade
  - Créer les composants de navigation secondaire : modal détail d'annonce, profil entreprise, formulaire d'upgrade.
  - Fichiers à créer : `src/components/ads/AdDetailModal.tsx`, `src/components/ads/CompanyProfile.tsx`, `src/components/ads/EnterpriseRequestModal.tsx`
  - _Requirements: 4, 5, 6, 9, 11_

  - [ ] 8.1 `AdDetailModal.tsx`
    - Props : `adId: string`, `onClose: () => void`.
    - Charge le détail via `ads:getDetail` à l'ouverture (enregistre automatiquement l'historique).
    - Sections dans l'ordre : header entreprise (logo + nom + badge + Follow/Unfollow), média pleine largeur, description complète, bouton CTA principal, statistiques (vues / likes / commentaires), `AdComments`.
    - Bouton "Écrire à l'entreprise" : ajoute l'entreprise aux contacts si absente et ouvre la conversation dans le chat existant (Requirement 11).
    - Fermeture par overlay click ou touche Escape.

  - [ ] 8.2 `CompanyProfile.tsx`
    - Accessible depuis le header d'une `AdCard` ou `AdDetailModal`.
    - Affiche : logo, nom, badge de vérification, description, nombre d'annonces publiées, bouton Follow/Unfollow.
    - Grille des annonces récentes de l'entreprise (max 6, composant `AdCard` réutilisé).
    - Props : `pubkey: string`, `onClose?: () => void`.

  - [ ] 8.3 `EnterpriseRequestModal.tsx`
    - Formulaire de demande d'upgrade : nom de l'entreprise (requis), logo URL (optionnel), description (requis), référence documents (optionnel).
    - Soumission via `enterprise:request` → `enterpriseStore.requestUpgrade()`.
    - Affiche un message de confirmation avec statut "Vérification en cours" après soumission réussie.

---

- [ ] 9. Conteneur principal — `AdsSection`
  - Créer le composant racine de la section qui orchestre tous les sous-composants.
  - Fichiers à créer : `src/components/ads/AdsSection.tsx`
  - _Requirements: 1, 2, 6, 8, 12_

  - [ ] 9.1 Structure et layout
    - Layout `flex flex-col h-full bg-[#0d0d0d]` avec trois zones : header fixe (titre "Publicités" + bouton paramètres ⚙ + bouton "Créer une annonce" conditionnel), `AdFilters`, zone scrollable de `AdCard`.
    - State local : `selectedAdId: string | null`, `showSettings: boolean`, `showCreateForm: boolean`.
    - Connecté à `useAdsStore` et `useEnterpriseStore`.

  - [ ] 9.2 Gestion du cycle de vie
    - `useEffect` au montage : appelle `adsStore.fetchAds()` et `adsSettingsStore.load()`.
    - Passe `onSelect` aux `AdCard` pour ouvrir `AdDetailModal`.
    - Passe `onInteract` aux `AdCard` pour deléguer vers `adsStore.interact()`.
    - Affiche un état de chargement (spinner ou skeleton) pendant `isLoading`.
    - Affiche un état vide illustré si `ads.length === 0` après chargement.

---

- [ ] 10. Intégration dans l'app — Sidebar et ChatLayout
  - Brancher la section Publicités dans la navigation existante de l'application.
  - Fichiers à modifier : `src/components/Sidebar.tsx`, `src/pages/ChatLayout.tsx`
  - _Requirements: 1_

  - [ ] 10.1 Modification de `Sidebar.tsx`
    - Ajouter le bouton "Publicités" avec l'icône mégaphone (SVG Heroicons fourni dans le design).
    - Style actif : `bg-[#7c3aed]/20 text-[#7c3aed]` ; inactif : `text-[#888] hover:text-white hover:bg-[#1a1a1a]`.
    - Utiliser `cn()` depuis `src/lib/utils.ts` pour la gestion conditionnelle des classes.
    - L'onglet Publicités ne peut pas être masqué ni désactivé (Requirement 1.3).

  - [ ] 10.2 Modification de `ChatLayout.tsx`
    - Importer `AdsSection` et `useAdsStore` (ou lire le `activeTab` depuis le store de navigation existant).
    - Routing conditionnel : si `activeTab === 'ads'` → `<AdsSection />`, sinon → comportement existant `<ChatWindow />` (inchangé).
    - S'assurer que l'état de chat n'est pas perdu lors du switch vers Publicités et retour.

---

- [ ] 11. Fonctionnalité historique et notifications
  - Implémenter les deux fonctionnalités transversales qui ne sont pas portées par un composant unique.
  - Fichiers à modifier : `src/components/ads/AdDetailModal.tsx`, `electron/ipc/handlers.ts`, `src/store/adsStore.ts`
  - _Requirements: 9, 10_

  - [ ] 11.1 Historique automatique de consultation
    - L'interaction `history` est insérée automatiquement dans `ad_interactions` côté handler `ads:getDetail` (pas d'appel explicite du renderer).
    - Ajouter dans `AdsSettings.tsx` une section "Historique" accessible depuis les paramètres, affichant les annonces de type `history` triées par `created_at DESC`.
    - Option "Vider l'historique" avec confirmation (suppression des lignes `type = 'history'` pour l'utilisateur courant).

  - [ ] 11.2 Snooze et notifications planifiées
    - L'interaction `snooze` enregistre l'`ad_id` et un `scheduled_at` dans `ad_notifications`.
    - Ajouter un menu contextuel sur `AdCard` (bouton ⋯) proposant les délais : 1h, demain, dans 1 semaine.
    - Au démarrage de l'app et à chaque focus de fenêtre, le main process interroge `ad_notifications` pour les notifications dont `scheduled_at <= Date.now()` et `dismissed = 0`, et les envoie au renderer via `ipcRenderer.send` ou Electron `Notification`.

---

- [ ] 12. Vérification finale et cohérence
  - S'assurer que l'ensemble de la feature est fonctionnel, typé et cohérent avec le reste du projet.
  - Fichiers concernés : tous les fichiers créés ou modifiés dans les tâches précédentes
  - _Requirements: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12_

  - [ ] 12.1 Vérification des types TypeScript
    - Lancer `tsc --noEmit` sur les deux tsconfig (`tsconfig.json` et `tsconfig.electron.json`) et corriger toutes les erreurs.
    - Vérifier que les types déclarés dans `global.d.ts` correspondent exactement aux interfaces utilisées dans le repo et les stores.

  - [ ] 12.2 Tests manuels des flux critiques
    - Parcourir les 5 flux principaux : affichage liste → détail → like/favori → commentaire → paramètres.
    - Vérifier le flux entreprise : demande upgrade → badge pending → création annonce.
    - Vérifier le flux communication : "Écrire à l'entreprise" ouvre bien une conversation chiffrée E2E.
    - Vérifier que le switch Publicités ↔ Chat ne casse pas l'état du chat existant.

  - [ ] 12.3 Cohérence visuelle
    - S'assurer que toutes les couleurs utilisées respectent la palette du thème (`#0d0d0d`, `#1a1a1a`, `#2a2a2a`, `#7c3aed`).
    - Vérifier l'accessibilité de base : contrastes suffisants, focus visible sur les éléments interactifs, attributs `aria-label` sur les icônes sans texte.
