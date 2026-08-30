// Point d'entrée de l'application Tauri
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    koon_lib::run();
}
