import Database from 'better-sqlite3'
import path from 'path'
import { app } from 'electron'
import fs from 'fs'

let db: Database.Database

export function initDatabase(): void {
  const userDataPath = app.getPath('userData')
  const dbPath = path.join(userDataPath, 'koon.db')

  // Crée le dossier si nécessaire
  if (!fs.existsSync(userDataPath)) {
    fs.mkdirSync(userDataPath, { recursive: true })
  }

  db = new Database(dbPath)
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')

  runMigrations()
}

export function getDb(): Database.Database {
  if (!db) throw new Error('Base de données non initialisée')
  return db
}

function runMigrations(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS identity (
      id        INTEGER PRIMARY KEY CHECK (id = 1),
      pubkey    TEXT NOT NULL,
      privkey   TEXT NOT NULL,
      sig_pubkey  TEXT NOT NULL,
      sig_privkey TEXT NOT NULL,
      mnemonic  TEXT NOT NULL,
      created_at INTEGER NOT NULL DEFAULT (unixepoch())
    );

    CREATE TABLE IF NOT EXISTS contacts (
      pubkey     TEXT PRIMARY KEY,
      nickname   TEXT NOT NULL,
      added_at   INTEGER NOT NULL DEFAULT (unixepoch())
    );

    CREATE TABLE IF NOT EXISTS messages (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      contact_pubkey TEXT NOT NULL,
      direction   TEXT NOT NULL CHECK (direction IN ('in','out')),
      plaintext   TEXT NOT NULL,
      nonce       TEXT,
      ciphertext  TEXT,
      timestamp   INTEGER NOT NULL DEFAULT (unixepoch()),
      FOREIGN KEY (contact_pubkey) REFERENCES contacts(pubkey) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_messages_contact ON messages(contact_pubkey, timestamp);

    -- ── Ads / Publicités ─────────────────────────────────────────────────────

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
      sector       TEXT NOT NULL DEFAULT '',
      created_at   INTEGER NOT NULL DEFAULT (unixepoch()),
      status       TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','paused','deleted'))
    );

    CREATE TABLE IF NOT EXISTS ad_interactions (
      id          TEXT PRIMARY KEY,
      ad_id       TEXT NOT NULL REFERENCES ads(id) ON DELETE CASCADE,
      user_pubkey TEXT NOT NULL,
      type        TEXT NOT NULL CHECK(type IN ('like','save','history','snooze')),
      snooze_until INTEGER,
      created_at  INTEGER NOT NULL DEFAULT (unixepoch()),
      UNIQUE(ad_id, user_pubkey, type)
    );

    CREATE TABLE IF NOT EXISTS ad_comments (
      id            TEXT PRIMARY KEY,
      ad_id         TEXT NOT NULL REFERENCES ads(id) ON DELETE CASCADE,
      author_pubkey TEXT NOT NULL,
      content       TEXT NOT NULL,
      created_at    INTEGER NOT NULL DEFAULT (unixepoch())
    );

    CREATE TABLE IF NOT EXISTS enterprise_profiles (
      pubkey        TEXT PRIMARY KEY,
      company_name  TEXT NOT NULL,
      logo_url      TEXT,
      description   TEXT NOT NULL DEFAULT '',
      badge_status  TEXT NOT NULL DEFAULT 'none' CHECK(badge_status IN ('none','pending','verified','rejected')),
      documents_ref TEXT,
      created_at    INTEGER NOT NULL DEFAULT (unixepoch())
    );

    CREATE TABLE IF NOT EXISTS ad_follows (
      user_pubkey       TEXT NOT NULL,
      enterprise_pubkey TEXT NOT NULL REFERENCES enterprise_profiles(pubkey) ON DELETE CASCADE,
      created_at        INTEGER NOT NULL DEFAULT (unixepoch()),
      PRIMARY KEY(user_pubkey, enterprise_pubkey)
    );

    CREATE TABLE IF NOT EXISTS ad_notifications (
      id           TEXT PRIMARY KEY,
      user_pubkey  TEXT NOT NULL,
      ad_id        TEXT REFERENCES ads(id) ON DELETE CASCADE,
      type         TEXT NOT NULL CHECK(type IN ('new_ad','followed_enterprise','comment_reply')),
      scheduled_at INTEGER NOT NULL,
      dismissed    INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS ads_settings (
      user_pubkey                   TEXT PRIMARY KEY,
      preferred_language            TEXT NOT NULL DEFAULT 'fr',
      alert_new_ads                 INTEGER NOT NULL DEFAULT 1,
      alert_followed_enterprises    INTEGER NOT NULL DEFAULT 1,
      hidden_enterprise_pubkeys     TEXT NOT NULL DEFAULT '[]'
    );

    CREATE INDEX IF NOT EXISTS idx_ads_created_at         ON ads(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_ads_language           ON ads(language);
    CREATE INDEX IF NOT EXISTS idx_ads_sector             ON ads(sector);
    CREATE INDEX IF NOT EXISTS idx_ad_interactions_user   ON ad_interactions(user_pubkey);
    CREATE INDEX IF NOT EXISTS idx_ad_comments_ad         ON ad_comments(ad_id);
    CREATE INDEX IF NOT EXISTS idx_ad_follows_user        ON ad_follows(user_pubkey);
    CREATE INDEX IF NOT EXISTS idx_ad_notifications_user  ON ad_notifications(user_pubkey, dismissed, scheduled_at);
  `)
}
