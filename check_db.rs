// Script temporaire pour lire la DB Koon
use rusqlite::{Connection, Result};
use std::path::PathBuf;

fn main() -> Result<()> {
    let mut path = dirs::data_local_dir().expect("Cannot find local dir");
    path.push("koon");
    path.push("koon.db");
    
    println!("📂 DB Path: {:?}", path);
    
    if !path.exists() {
        println!("❌ DB not found!");
        return Ok(());
    }
    
    let conn = Connection::open(&path)?;
    
    // Lire le wallet
    println!("\n🔑 === WALLET INFO ===");
    let mut stmt = conn.prepare("SELECT public_key FROM wallet LIMIT 1")?;
    let wallet_exists = stmt.query_row([], |row| {
        let public_key: String = row.get(0)?;
        println!("✅ Wallet found!");
        println!("📍 Public Key: {}", public_key);
        Ok(())
    });
    
    match wallet_exists {
        Ok(_) => {},
        Err(rusqlite::Error::QueryReturnedNoRows) => {
            println!("❌ No wallet found in DB");
        },
        Err(e) => println!("Error: {}", e),
    }
    
    // Lire les contacts
    println!("\n👥 === CONTACTS ===");
    let mut stmt = conn.prepare("SELECT id, name, public_key, unread_count FROM contacts")?;
    let contacts = stmt.query_map([], |row| {
        let id: String = row.get(0)?;
        let name: String = row.get(1)?;
        let public_key: String = row.get(2)?;
        let unread: i32 = row.get(3)?;
        Ok((id, name, public_key, unread))
    })?;
    
    let mut count = 0;
    for contact in contacts {
        let (id, name, pk, unread) = contact?;
        count += 1;
        println!("  {}. {} (unread: {})", count, name, unread);
        println!("     ID: {}", id);
        println!("     PK: {}...", &pk[..32.min(pk.len())]);
    }
    
    if count == 0 {
        println!("  No contacts found");
    }
    
    // Compter les messages
    println!("\n💬 === MESSAGES ===");
    let mut stmt = conn.prepare("SELECT COUNT(*) FROM messages")?;
    let msg_count: i32 = stmt.query_row([], |row| row.get(0))?;
    println!("  Total messages: {}", msg_count);
    
    Ok(())
}
