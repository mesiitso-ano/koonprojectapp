// Bibliothèque partagée Tauri — expose les commandes au frontend
mod commands;
mod db;

use commands::*;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_process::init())
        .invoke_handler(tauri::generate_handler![
            save_wallet,
            load_wallet,
            load_contacts,
            send_message,
            load_messages,
        ])
        .run(tauri::generate_context!())
        .expect("Erreur lors du lancement de Tauri");
}
