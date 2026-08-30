// PostCSS — pipeline de transformation CSS (requis par Tailwind)
export default {
  plugins: {
    tailwindcss: {},   // Génère les classes utilitaires Tailwind
    autoprefixer: {},  // Ajoute automatiquement les préfixes vendeur CSS
  },
};
