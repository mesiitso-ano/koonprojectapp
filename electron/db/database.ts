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
  `)
}
