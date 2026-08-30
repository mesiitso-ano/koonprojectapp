// Commandes Tauri exposées au frontend React
use crate::db::*;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct SendMessagePayload {
    pub id: String,
    pub content: String,
    pub recipient_public_key: String,
    pub sender_private_key: String,
}

#[tauri::command]
pub async fn save_wallet(wallet: Wallet) -> Result<(), String> {
    save_wallet_db(&wallet).map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn load_wallet() -> Result<Option<Wallet>, String> {
    load_wallet_db().map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn load_contacts() -> Result<Vec<Contact>, String> {
    load_contacts_db().map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn send_message(message: SendMessagePayload) -> Result<(), String> {
    // Pour l'instant, sauvegarde simple (le chiffrement est géré côté frontend)
    let msg = Message {
        id: message.id,
        contact_id: "temp".to_string(), // À améliorer : récupérer depuis le contexte
        content: message.content,
        sender: "me".to_string(),
        timestamp: chrono::Utc::now().timestamp_millis(),
        status: "sent".to_string(),
    };
    
    save_message_db(&msg).map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn load_messages(contact_id: String) -> Result<Vec<Message>, String> {
    load_messages_db(&contact_id).map_err(|e| e.to_string())
}
