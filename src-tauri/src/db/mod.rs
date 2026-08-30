// Gestion de la base de données SQLite
use rusqlite::{Connection, Result};
use serde::{Deserialize, Serialize};
use std::path::PathBuf;

#[derive(Debug, Serialize, Deserialize)]
pub struct Wallet {
    pub mnemonic: String,
    pub public_key: String,
    pub private_key: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Contact {
    pub id: String,
    pub name: String,
    pub public_key: String,
    pub unread_count: i32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Message {
    pub id: String,
    pub contact_id: String,
    pub content: String,
    pub sender: String,
    pub timestamp: i64,
    pub status: String,
}

pub fn get_db_path() -> PathBuf {
    let mut path = dirs::data_local_dir().expect("Impossible de trouver le dossier local");
    path.push("koon");
    std::fs::create_dir_all(&path).ok();
    path.push("koon.db");
    path
}

pub fn init_db() -> Result<Connection> {
    let conn = Connection::open(get_db_path())?;

    conn.execute(
        "CREATE TABLE IF NOT EXISTS wallet (
            id INTEGER PRIMARY KEY,
            mnemonic TEXT NOT NULL,
            public_key TEXT NOT NULL,
            private_key TEXT NOT NULL
        )",
        [],
    )?;

    conn.execute(
        "CREATE TABLE IF NOT EXISTS contacts (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            public_key TEXT NOT NULL,
            unread_count INTEGER DEFAULT 0
        )",
        [],
    )?;

    conn.execute(
        "CREATE TABLE IF NOT EXISTS messages (
            id TEXT PRIMARY KEY,
            contact_id TEXT NOT NULL,
            content TEXT NOT NULL,
            sender TEXT NOT NULL,
            timestamp INTEGER NOT NULL,
            status TEXT NOT NULL,
            FOREIGN KEY(contact_id) REFERENCES contacts(id)
        )",
        [],
    )?;

    Ok(conn)
}

pub fn save_wallet_db(wallet: &Wallet) -> Result<()> {
    let conn = init_db()?;
    conn.execute("DELETE FROM wallet", [])?;
    conn.execute(
        "INSERT INTO wallet (mnemonic, public_key, private_key) VALUES (?1, ?2, ?3)",
        [&wallet.mnemonic, &wallet.public_key, &wallet.private_key],
    )?;
    Ok(())
}

pub fn load_wallet_db() -> Result<Option<Wallet>> {
    let conn = init_db()?;
    let mut stmt = conn.prepare("SELECT mnemonic, public_key, private_key FROM wallet LIMIT 1")?;
    
    let wallet = stmt.query_row([], |row| {
        Ok(Wallet {
            mnemonic: row.get(0)?,
            public_key: row.get(1)?,
            private_key: row.get(2)?,
        })
    });

    match wallet {
        Ok(w) => Ok(Some(w)),
        Err(rusqlite::Error::QueryReturnedNoRows) => Ok(None),
        Err(e) => Err(e),
    }
}

pub fn load_contacts_db() -> Result<Vec<Contact>> {
    let conn = init_db()?;
    let mut stmt = conn.prepare("SELECT id, name, public_key, unread_count FROM contacts")?;
    
    let contacts = stmt.query_map([], |row| {
        Ok(Contact {
            id: row.get(0)?,
            name: row.get(1)?,
            public_key: row.get(2)?,
            unread_count: row.get(3)?,
        })
    })?;

    contacts.collect()
}

pub fn save_message_db(message: &Message) -> Result<()> {
    let conn = init_db()?;
    conn.execute(
        "INSERT INTO messages (id, contact_id, content, sender, timestamp, status) VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
        [
            &message.id,
            &message.contact_id,
            &message.content,
            &message.sender,
            &message.timestamp.to_string(),
            &message.status,
        ],
    )?;
    Ok(())
}

pub fn load_messages_db(contact_id: &str) -> Result<Vec<Message>> {
    let conn = init_db()?;
    let mut stmt = conn.prepare(
        "SELECT id, contact_id, content, sender, timestamp, status FROM messages WHERE contact_id = ?1 ORDER BY timestamp ASC"
    )?;
    
    let messages = stmt.query_map([contact_id], |row| {
        Ok(Message {
            id: row.get(0)?,
            contact_id: row.get(1)?,
            content: row.get(2)?,
            sender: row.get(3)?,
            timestamp: row.get(4)?,
            status: row.get(5)?,
        })
    })?;

    messages.collect()
}
