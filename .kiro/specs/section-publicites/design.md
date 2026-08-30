# Design: Section Publicités

## Overview

La section Publicités est un module autonome intégré à l'application Koon (Electron + React). Elle permet aux utilisateurs de consulter des annonces publiées par des entreprises vérifiées, d'interagir avec ces annonces (like, sauvegarde, commentaire), et aux comptes entreprise de créer et gérer leurs publications.

L'architecture suit les patterns existants du projet :
- **Frontend** : composants React avec Zustand pour le state, Tailwind CSS pour le style
- **Backend** : IPC Electron → handlers → better-sqlite3
- **Navigation** : nouvel onglet dans la `Sidebar` qui switche l'affichage principal vers `AdsSection` au lieu de `ChatWindow`
- **Thème** : cohérent avec le reste de l'app (`#0d0d0d` fond, `#1a1a1a` surface, `#2a2a2a` bordures, `#7c3aed` accent)

---

## Architecture

### Components

```
src/
├── components/
│   ├── ads/
│   │   ├── AdsSection.tsx          ← Conteneur principal (remplace ChatWindow)
│   │   ├── AdCard.tsx              ← Carte d'annonce individuelle
│   │   ├── AdDetailModal.tsx       ← Modal détail complet d'une annonce
│   │   ├── AdFilters.tsx           ← Barre tri/filtres (date, popularité, secteur, langue)
│   │   ├── AdComments.tsx          ← Section commentaires d'une annonce
│   │   ├── AdCreateForm.tsx        ← Formulaire création/édition d'annonce
│   │   ├── AdsSettings.tsx         ← Panneau préférences utilisateur
│   │   ├── CompanyProfile.tsx      ← Profil public d'une entreprise
│   │   └── EnterpriseRequestModal.tsx ← Demande d'upgrade compte entreprise
│   └── ... (composants existants)
├── store/
│   ├── adsStore.ts                 ← Annonces, sélection, filtres, tri
│   ├── adsSettingsStore.ts         ← Préférences langue, favoris, alertes
│   └── enterpriseStore.ts          ← Profil entreprise, statut vérification
```

**Composants modifiés :**
- `src/components/Sidebar.tsx` — ajout bouton "Publicités" (icône mégaphone)
- `src/pages/ChatLayout.tsx` — routing conditionnel vers `AdsSection`

### Data Models

```typescript
// ── Annonce ──────────────────────────────────────────────────────────────────
interface Ad {
  id: string;                        // UUID v4
  author_pubkey: string;             // clé publique Ed25519 de l'auteur
  company_name: string;
  logo_url: string | null;           // URL relative ou data-URL
  media_type: 'image' | 'video' | 'none';
  media_url: string | null;
  description: string;               // max 500 caractères
  cta_label: string;                 // ex : "Voir l'offre"
  cta_url: string;
  language: string;                  // code ISO 639-1, ex : "fr", "en"
  created_at: number;                // timestamp Unix (ms)
  status: 'active' | 'paused' | 'deleted';
  views_count?: number;              // calculé à la volée
  likes_count?: number;
  comments_count?: number;
}

// ── Interaction utilisateur ───────────────────────────────────────────────────
type AdInteractionType = 'like' | 'save' | 'history' | 'snooze';

interface AdInteraction {
  id: string;
  ad_id: string;
  user_pubkey: string;
  type: AdInteractionType;
  created_at: number;
}

// ── Commentaire ───────────────────────────────────────────────────────────────
interface AdComment {
  id: string;
  ad_id: string;
  author_pubkey: string;
  content: string;                   // max 300 caractères
  created_at: number;
}

// ── Profil entreprise ─────────────────────────────────────────────────────────
type BadgeStatus = 'none' | 'pending' | 'verified' | 'rejected';

interface EnterpriseProfile {
  pubkey: string;                    // clé publique = identifiant unique
  company_name: string;
  logo_url: string | null;
  description: string;
  badge_status: BadgeStatus;
  documents_ref: string | null;      // chemin local ou hash de référence
  created_at: number;
}

// ── Abonnement entreprise ─────────────────────────────────────────────────────
interface AdFollow {
  user_pubkey: string;
  enterprise_pubkey: string;
  created_at: number;
}

// ── Notification programmée ───────────────────────────────────────────────────
type AdNotificationType = 'new_ad' | 'followed_enterprise' | 'comment_reply';

interface AdNotification {
  id: string;
  user_pubkey: string;
  ad_id: string;
  type: AdNotificationType;
  scheduled_at: number;
  dismissed: boolean;
}

// ── Filtres actifs ────────────────────────────────────────────────────────────
interface AdsFilters {
  language: string | null;           // null = toutes les langues
  sector: string | null;
  sort: 'date_desc' | 'date_asc' | 'popularity';
  showSaved: boolean;
  showFollowedOnly: boolean;
}

// ── Préférences publicités ────────────────────────────────────────────────────
interface AdsSettings {
  preferred_language: string;        // ex : "fr"
  alert_new_ads: boolean;
  alert_followed_enterprises: boolean;
  hidden_enterprise_pubkeys: string[]; // entreprises masquées
}
```

### API / IPC

Tous les canaux IPC suivent la convention `channel:action` existante dans `electron/ipc/handlers.ts`.

```typescript
// ── Annonces ──────────────────────────────────────────────────────────────────

// ads:list
// Entrée
interface AdsListParams {
  filters?: Partial<AdsFilters>;
  limit?: number;    // défaut 20
  offset?: number;   // défaut 0
}
// Sortie : Ad[]

// ads:create
// Entrée
type AdCreatePayload = Omit<Ad, 'id' | 'created_at' | 'status' | 'views_count' | 'likes_count' | 'comments_count'>;
// Sortie : { id: string }

// ads:getDetail
// Entrée : { id: string }
// Sortie : Ad & { user_interactions: AdInteractionType[]; enterprise: EnterpriseProfile }

// ads:interact
// Entrée
interface AdInteractPayload {
  ad_id: string;
  type: AdInteractionType;
  active: boolean;   // true = activer, false = retirer
}
// Sortie : { success: boolean }

// ads:comment
// Entrée
interface AdCommentPayload {
  ad_id: string;
  content: string;
}
// Sortie : AdComment

// ads:getComments
// Entrée : { ad_id: string; limit?: number; offset?: number }
// Sortie : AdComment[]

// ── Entreprises ───────────────────────────────────────────────────────────────

// enterprise:request
// Entrée
interface EnterpriseRequestPayload {
  company_name: string;
  logo_url: string | null;
  description: string;
  documents_ref: string | null;
}
// Sortie : { status: BadgeStatus }

// enterprise:getProfile
// Entrée : { pubkey: string }
// Sortie : EnterpriseProfile | null

// enterprise:follow
// Entrée : { enterprise_pubkey: string }
// Sortie : { success: boolean }

// enterprise:unfollow
// Entrée : { enterprise_pubkey: string }
// Sortie : { success: boolean }

// ── Paramètres ────────────────────────────────────────────────────────────────

// ads:getSettings
// Entrée : aucune
// Sortie : AdsSettings

// ads:saveSettings
// Entrée : Partial<AdsSettings>
// Sortie : { success: boolean }
```

---

## Component Details

### `AdsSection`

Conteneur principal monté dans `ChatLayout` quand l'onglet "Publicités" est actif. Il remplace l'affichage `ChatWindow`.

**Responsabilités :**
- Afficher `AdFilters` en haut
- Rendre la liste de `AdCard` en colonne centrale (scroll vertical)
- Gérer l'ouverture de `AdDetailModal`
- Fournir le bouton d'accès à `AdsSettings` (icône engrenage)
- Afficher un bouton "Créer une annonce" si l'utilisateur est entreprise vérifiée

**State local :** `selectedAdId: string | null`, `showSettings: boolean`, `showCreateForm: boolean`

**Connexion store :** `useAdsStore`, `useEnterpriseStore`

```tsx
// Structure JSX simplifiée
<div className="flex flex-col h-full bg-[#0d0d0d]">
  <AdsHeader />          {/* titre + bouton paramètres + bouton créer */}
  <AdFilters />
  <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
    {ads.map(ad => <AdCard key={ad.id} ad={ad} />)}
  </div>
  {selectedAdId && <AdDetailModal adId={selectedAdId} />}
  {showSettings && <AdsSettings />}
  {showCreateForm && <AdCreateForm />}
</div>
```

---

### `AdCard`

Carte individuelle d'annonce, design épuré en accord avec le thème de l'app.

**Layout :**
```
┌─────────────────────────────────────┐
│ [Logo 32px] Nom Entreprise [Badge✓] │  ← Header  (flex, items-center)
│ ─────────────────────────────────── │
│                                     │
│         [Image / Vidéo 16:9]        │  ← Média (aspect-video, object-cover)
│                                     │
│ ─────────────────────────────────── │
│ Description courte (2 lignes max)   │  ← Body    (line-clamp-2)
│ ─────────────────────────────────── │
│ [CTA Button]              👁 vues   │  ← Footer
│ ❤ Like  💬 Comm  🔖 Fav  ⋯ Plus   │  ← Actions (icônes icon-button)
└─────────────────────────────────────┘
```

**Classes Tailwind clés :**
```
card    : rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] overflow-hidden
          transition-all hover:border-[#3a3a3a] hover:shadow-lg hover:shadow-black/40
badge   : text-xs text-[#7c3aed] border border-[#7c3aed]/40 rounded-full px-2 py-0.5
cta     : bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-sm font-medium
          px-4 py-1.5 rounded-lg transition-colors
action  : text-[#666] hover:text-[#7c3aed] transition-colors text-sm flex items-center gap-1
```

**Props :**
```typescript
interface AdCardProps {
  ad: Ad;
  userInteractions?: AdInteractionType[];
  onSelect?: (id: string) => void;
  onInteract?: (adId: string, type: AdInteractionType, active: boolean) => void;
}
```

---

### `AdDetailModal`

Modal plein-écran (ou centré large) affichant le détail complet d'une annonce.

**Sections :**
1. Header entreprise (logo, nom, badge, bouton follow/unfollow)
2. Média en taille complète
3. Description complète
4. Bouton CTA principal
5. Statistiques (vues, likes, commentaires)
6. `AdComments` — liste + formulaire d'ajout

**Props :**
```typescript
interface AdDetailModalProps {
  adId: string;
  onClose: () => void;
}
```

---

### `AdFilters`

Barre horizontale de tri et filtres, persistée dans `adsStore`.

**Contrôles :**
- **Tri** : `select` → "Plus récent", "Plus ancien", "Popularité"
- **Langue** : `select` → "Toutes", "Français", "English", …
- **Secteur** : `select` → liste de secteurs prédéfinis (Tech, Mode, Alimentation, etc.)
- **Favoris uniquement** : `toggle`
- **Entreprises suivies** : `toggle`

**Props :** aucune (lit et écrit directement dans `useAdsStore`)

---

### `AdComments`

Section commentaires sous une annonce. Affiche la liste paginée et un champ de saisie.

**Props :**
```typescript
interface AdCommentsProps {
  adId: string;
}
```

**Comportement :**
- Charge les commentaires via IPC `ads:getComments` à l'ouverture
- Soumission via IPC `ads:comment`, ajoute localement en optimistic update
- Longueur max 300 caractères avec compteur visuel
- Affiche la clé publique tronquée de l'auteur (8 premiers chars `…` 4 derniers)

---

### `AdCreateForm`

Formulaire de création d'annonce réservé aux entreprises vérifiées.

**Champs :**
| Champ | Type | Validation |
|---|---|---|
| Description | `textarea` | max 500 chars, requis |
| CTA Label | `input` | max 50 chars, requis |
| CTA URL | `input` | URL valide, requis |
| Langue | `select` | ISO 639-1, requis |
| Média type | `radio` | image / vidéo / aucun |
| Média URL | `input` | URL valide si média ≠ none |

**Soumission :** IPC `ads:create`, puis refresh de `adsStore`.

---

### `AdsSettings`

Panneau latéral (slide-in depuis la droite) ou modal de préférences.

**Sections :**
1. **Langue préférée** — `select` ISO 639-1
2. **Alertes** — toggles "Nouvelles annonces", "Entreprises suivies"
3. **Entreprises masquées** — liste avec bouton "Démasquer"
4. **Mes favoris** — lien vers vue filtrée `showSaved: true`
5. **Abonnements** — liste des entreprises suivies avec bouton "Se désabonner"

---

### `CompanyProfile`

Vue profil d'une entreprise, accessible depuis le header d'une `AdCard` ou `AdDetailModal`.

**Affiche :**
- Logo, nom, badge de vérification
- Description
- Nombre d'annonces publiées
- Bouton Follow/Unfollow
- Grille des annonces récentes de cette entreprise

---

### `EnterpriseRequestModal`

Modal de demande d'upgrade vers un compte entreprise.

**Champs :**
| Champ | Type |
|---|---|
| Nom de l'entreprise | `input` |
| Logo URL | `input` (optionnel) |
| Description | `textarea` |
| Référence documents | `input` (optionnel, hash ou lien) |

**Soumission :** IPC `enterprise:request`, met à jour `enterpriseStore.badge_status = 'pending'`.

---

### Modifications de `Sidebar.tsx`

Ajouter un bouton "Publicités" entre la liste de contacts et le footer identité :

```tsx
// Bouton à insérer dans Sidebar.tsx
<button
  onClick={() => setActiveTab('ads')}
  className={cn(
    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
    activeTab === 'ads'
      ? "bg-[#7c3aed]/20 text-[#7c3aed]"
      : "text-[#888] hover:text-white hover:bg-[#1a1a1a]"
  )}
>
  {/* Icône mégaphone — Heroicons outline */}
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 0 1-1.44-4.282m3.102.069a18.03 18.03 0 0 1-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 0 1 8.835 2.535M10.34 6.66a23.847 23.847 0 0 1 8.835-2.535m0 0A23.74 23.74 0 0 1 18.795 3m.38 1.125a23.91 23.91 0 0 1 1.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 0 0 1.014-5.395m-1.394 0 A21.849 21.849 0 0 0 18.795 12m0 0v-.009" />
  </svg>
  <span>Publicités</span>
</button>
```

### Modifications de `ChatLayout.tsx`

```tsx
// Ajout du routing conditionnel
import { AdsSection } from '../components/ads/AdsSection';
import { useAdsStore } from '../store/adsStore';

// Dans le rendu :
{activeTab === 'ads' ? (
  <AdsSection />
) : (
  <ChatWindow />  // comportement existant inchangé
)}
```

---

## Implementation Notes

### Base de données SQLite

Ajouter dans `electron/db/database.ts` les migrations suivantes (exécutées dans `initDatabase`) :

```sql
-- Table des annonces
CREATE TABLE IF NOT EXISTS ads (
  id           TEXT PRIMARY KEY,
  author_pubkey TEXT NOT NULL,
  company_name TEXT NOT NULL,
  logo_url     TEXT,
  media_type   TEXT NOT NULL DEFAULT 'none' CHECK(media_type IN ('image','video','none')),
  media_url    TEXT,
  description  TEXT NOT NULL,
  cta_label    TEXT NOT NULL,
  cta_url      TEXT NOT NULL,
  language     TEXT NOT NULL DEFAULT 'fr',
  created_at   INTEGER NOT NULL,
  status       TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','paused','deleted'))
);

-- Interactions utilisateur (like, save, history, snooze)
CREATE TABLE IF NOT EXISTS ad_interactions (
  id          TEXT PRIMARY KEY,
  ad_id       TEXT NOT NULL REFERENCES ads(id) ON DELETE CASCADE,
  user_pubkey TEXT NOT NULL,
  type        TEXT NOT NULL CHECK(type IN ('like','save','history','snooze')),
  created_at  INTEGER NOT NULL,
  UNIQUE(ad_id, user_pubkey, type)
);

-- Commentaires
CREATE TABLE IF NOT EXISTS ad_comments (
  id          TEXT PRIMARY KEY,
  ad_id       TEXT NOT NULL REFERENCES ads(id) ON DELETE CASCADE,
  author_pubkey TEXT NOT NULL,
  content     TEXT NOT NULL,
  created_at  INTEGER NOT NULL
);

-- Profils entreprise
CREATE TABLE IF NOT EXISTS enterprise_profiles (
  pubkey       TEXT PRIMARY KEY,
  company_name TEXT NOT NULL,
  logo_url     TEXT,
  description  TEXT NOT NULL DEFAULT '',
  badge_status TEXT NOT NULL DEFAULT 'none' CHECK(badge_status IN ('none','pending','verified','rejected')),
  documents_ref TEXT,
  created_at   INTEGER NOT NULL
);

-- Abonnements entreprises
CREATE TABLE IF NOT EXISTS ad_follows (
  user_pubkey       TEXT NOT NULL,
  enterprise_pubkey TEXT NOT NULL REFERENCES enterprise_profiles(pubkey) ON DELETE CASCADE,
  created_at        INTEGER NOT NULL,
  PRIMARY KEY(user_pubkey, enterprise_pubkey)
);

-- Notifications programmées
CREATE TABLE IF NOT EXISTS ad_notifications (
  id           TEXT PRIMARY KEY,
  user_pubkey  TEXT NOT NULL,
  ad_id        TEXT REFERENCES ads(id) ON DELETE CASCADE,
  type         TEXT NOT NULL CHECK(type IN ('new_ad','followed_enterprise','comment_reply')),
  scheduled_at INTEGER NOT NULL,
  dismissed    INTEGER NOT NULL DEFAULT 0 CHECK(dismissed IN (0,1))
);

-- Index de performance
CREATE INDEX IF NOT EXISTS idx_ads_created_at ON ads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ads_language   ON ads(language);
CREATE INDEX IF NOT EXISTS idx_ad_interactions_user ON ad_interactions(user_pubkey);
CREATE INDEX IF NOT EXISTS idx_ad_comments_ad  ON ad_comments(ad_id);
CREATE INDEX IF NOT EXISTS idx_ad_follows_user ON ad_follows(user_pubkey);
```

### Nouveau repository : `electron/db/adsRepo.ts`

Créer un fichier dédié (pattern identique à `messagesRepo.ts`) exposant :

```typescript
export function listAds(params: AdsListParams): Ad[]
export function createAd(payload: AdCreatePayload): string  // retourne l'id
export function getAdDetail(id: string): Ad | null
export function upsertInteraction(payload: AdInteractPayload, userPubkey: string): void
export function addComment(payload: AdCommentPayload, authorPubkey: string): AdComment
export function getComments(adId: string, limit: number, offset: number): AdComment[]
```

```typescript
export function requestEnterprise(payload: EnterpriseRequestPayload, pubkey: string): BadgeStatus
export function getEnterpriseProfile(pubkey: string): EnterpriseProfile | null
export function followEnterprise(userPubkey: string, enterprisePubkey: string): void
export function unfollowEnterprise(userPubkey: string, enterprisePubkey: string): void
```

```typescript
export function getAdsSettings(userPubkey: string): AdsSettings
export function saveAdsSettings(userPubkey: string, settings: Partial<AdsSettings>): void
```

### Nouveaux IPC handlers : `electron/ipc/handlers.ts`

Enregistrer dans la fonction `registerHandlers` existante :

```typescript
ipcMain.handle('ads:list',         (_, params) => adsRepo.listAds(params));
ipcMain.handle('ads:create',       (_, payload) => adsRepo.createAd(payload));
ipcMain.handle('ads:getDetail',    (_, { id }) => adsRepo.getAdDetail(id));
ipcMain.handle('ads:interact',     (_, payload) => adsRepo.upsertInteraction(payload, currentUserPubkey));
ipcMain.handle('ads:comment',      (_, payload) => adsRepo.addComment(payload, currentUserPubkey));
ipcMain.handle('ads:getComments',  (_, params)  => adsRepo.getComments(params.ad_id, params.limit ?? 20, params.offset ?? 0));

ipcMain.handle('enterprise:request',   (_, payload) => adsRepo.requestEnterprise(payload, currentUserPubkey));
ipcMain.handle('enterprise:getProfile',(_, { pubkey }) => adsRepo.getEnterpriseProfile(pubkey));
ipcMain.handle('enterprise:follow',    (_, { enterprise_pubkey }) => adsRepo.followEnterprise(currentUserPubkey, enterprise_pubkey));
ipcMain.handle('enterprise:unfollow',  (_, { enterprise_pubkey }) => adsRepo.unfollowEnterprise(currentUserPubkey, enterprise_pubkey));

ipcMain.handle('ads:getSettings',  (_) => adsRepo.getAdsSettings(currentUserPubkey));
ipcMain.handle('ads:saveSettings', (_, settings) => adsRepo.saveAdsSettings(currentUserPubkey, settings));
```

### Stores Zustand

#### `src/store/adsStore.ts`

```typescript
interface AdsState {
  ads: Ad[];
  selectedAdId: string | null;
  filters: AdsFilters;
  isLoading: boolean;
  // Actions
  fetchAds: () => Promise<void>;
  selectAd: (id: string | null) => void;
  setFilters: (filters: Partial<AdsFilters>) => void;
  interact: (adId: string, type: AdInteractionType, active: boolean) => Promise<void>;
}
```

#### `src/store/adsSettingsStore.ts`

```typescript
interface AdsSettingsState {
  settings: AdsSettings;
  isLoaded: boolean;
  // Actions
  load: () => Promise<void>;
  save: (partial: Partial<AdsSettings>) => Promise<void>;
}
```

#### `src/store/enterpriseStore.ts`

```typescript
interface EnterpriseState {
  profile: EnterpriseProfile | null;
  followedPubkeys: string[];
  // Actions
  loadProfile: (pubkey: string) => Promise<void>;
  requestUpgrade: (payload: EnterpriseRequestPayload) => Promise<void>;
  follow: (enterprisePubkey: string) => Promise<void>;
  unfollow: (enterprisePubkey: string) => Promise<void>;
}
```

### Déclarations `preload.ts`

Exposer les nouveaux canaux dans `contextBridge.exposeInMainWorld` (pattern identique à l'existant) :

```typescript
ads: {
  list:        (params: AdsListParams) => ipcRenderer.invoke('ads:list', params),
  create:      (payload: AdCreatePayload) => ipcRenderer.invoke('ads:create', payload),
  getDetail:   (id: string) => ipcRenderer.invoke('ads:getDetail', { id }),
  interact:    (payload: AdInteractPayload) => ipcRenderer.invoke('ads:interact', payload),
  comment:     (payload: AdCommentPayload) => ipcRenderer.invoke('ads:comment', payload),
  getComments: (adId: string, limit?: number, offset?: number) =>
                 ipcRenderer.invoke('ads:getComments', { ad_id: adId, limit, offset }),
  getSettings: () => ipcRenderer.invoke('ads:getSettings'),
  saveSettings:(s: Partial<AdsSettings>) => ipcRenderer.invoke('ads:saveSettings', s),
},
enterprise: {
  request:    (payload: EnterpriseRequestPayload) => ipcRenderer.invoke('enterprise:request', payload),
  getProfile: (pubkey: string) => ipcRenderer.invoke('enterprise:getProfile', { pubkey }),
  follow:     (pubkey: string) => ipcRenderer.invoke('enterprise:follow', { enterprise_pubkey: pubkey }),
  unfollow:   (pubkey: string) => ipcRenderer.invoke('enterprise:unfollow', { enterprise_pubkey: pubkey }),
},
```

Ajouter les typages correspondants dans `src/types/global.d.ts` pour que TypeScript reconnaisse `window.electronAPI.ads` et `window.electronAPI.enterprise`.

### Conventions et bonnes pratiques

- Tous les IDs sont générés côté Electron avec `crypto.randomUUID()` (disponible nativement Node 19+ / Electron 30).
- Les `pubkey` dans les requêtes IPC ne sont **pas** passées depuis le renderer : le handler Electron lit la clé active depuis `identityStore` ou la DB pour éviter toute usurpation.
- Les médias (images/vidéos) sont référencés par URL externe uniquement dans cette première version — pas de stockage local de binaires.
- La pagination (`limit` / `offset`) est obligatoire sur `ads:list` et `ads:getComments` pour limiter la taille des réponses.
- Les compteurs (`views_count`, `likes_count`, `comments_count`) sont calculés par jointure SQL dans `listAds` et `getAdDetail`, pas stockés en colonnes dénormalisées.
- Le filtrage `showFollowedOnly` dans `ads:list` fait un `INNER JOIN ad_follows` sur `enterprise_profiles.pubkey = ads.author_pubkey`.
