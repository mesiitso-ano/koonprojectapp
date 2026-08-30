# Icônes Koon

Placez vos icônes personnalisées ici avec les formats suivants :

- **32x32.png** : Icône système Windows
- **128x128.png** : Icône macOS normale
- **128x128@2x.png** : Icône macOS Retina
- **icon.icns** : Bundle icône macOS
- **icon.ico** : Icône Windows

## Génération automatique

Vous pouvez générer toutes les icônes à partir d'une seule image PNG 1024x1024 :

```bash
npm install -g @tauri-apps/tauricon
tauricon path/to/your-icon.png
```

Les icônes seront générées automatiquement dans ce dossier.

## Icônes par défaut

Pour le moment, les icônes par défaut de Tauri seront utilisées.
Vous pouvez les remplacer avant le build de production.
