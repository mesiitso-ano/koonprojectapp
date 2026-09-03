// Configuration Vite — bundler du code React pour le renderer Tauri
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [
    // Plugin React : transforme JSX/TSX en JS, active le Fast Refresh
    react(),
    // Polyfills Node.js pour le navigateur (Buffer, process, etc.)
    nodePolyfills({
      include: ['buffer'],
      globals: {
        Buffer: true,
      },
    }),
  ],

  // Empêche Vite de masquer les erreurs Rust dans la console
  clearScreen: false,

  server: {
    // Port fixe pour que Tauri sache où charger le renderer en dev
    port: 1420,
    // Arrête le dev server si le port est déjà utilisé
    strictPort: true,
    // Surveille les changements dans src-tauri pour recharger
    watch: {
      ignored: ["**/src-tauri/**"],
    },
  },

  // Variables d'environnement injectées dans le code React
  envPrefix: ["VITE_", "TAURI_ENV_*", "TAURI_PLATFORM", "TAURI_ARCH", "TAURI_FAMILY", "TAURI_PLATFORM_VERSION", "TAURI_PLATFORM_TYPE", "TAURI_DEBUG"],

  build: {
    // Cible Chromium (WebView2 sur Windows) — pas de legacy JS
    target: "chrome105",
    // Désactive les sourcemaps en production pour réduire la taille
    minify: "esbuild",
    sourcemap: false,
  },
});
