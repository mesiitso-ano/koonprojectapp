// Composant de vérification et mise à jour automatique
import { useState, useEffect } from "react";
import { check } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";

export default function UpdateChecker() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateVersion, setUpdateVersion] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [checking, setChecking] = useState(false);

  const checkForUpdates = async () => {
    try {
      setChecking(true);
      const update = await check();

      if (update?.available) {
        setUpdateAvailable(true);
        setUpdateVersion(update.version);
      }
    } catch (error) {
      console.error("Erreur vérification mise à jour:", error);
    } finally {
      setChecking(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setDownloading(true);
      const update = await check();

      if (update?.available) {
        await update.downloadAndInstall((event) => {
          if (event.event === "Started") {
            setDownloadProgress(0);
          } else if (event.event === "Progress") {
            const eventData = event.data as { chunkLength: number; downloaded?: number; contentLength?: number };
            if (eventData.downloaded && eventData.contentLength) {
              const progress = Math.round((eventData.downloaded / eventData.contentLength) * 100);
              setDownloadProgress(progress);
            }
          }
        });

        // Redémarrer l'app après installation
        await relaunch();
      }
    } catch (error) {
      console.error("Erreur installation mise à jour:", error);
      setDownloading(false);
    }
  };

  // Vérifier automatiquement au démarrage
  useEffect(() => {
    checkForUpdates();
    
    // Vérifier toutes les 6 heures
    const interval = setInterval(checkForUpdates, 6 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (!updateAvailable && !checking) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-koon-50 border border-koon-border-light rounded-xl p-4 shadow-2xl max-w-sm animate-slideIn">
        {checking ? (
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 border-2 border-koon-900 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-koon-text-primary">Vérification des mises à jour...</span>
          </div>
        ) : downloading ? (
          <div className="space-y-3">
            <p className="text-sm font-medium text-koon-text-primary">
              Téléchargement de la mise à jour...
            </p>
            <div className="w-full bg-koon-200 rounded-full h-2">
              <div
                className="bg-koon-900 h-2 rounded-full transition-all duration-300"
                style={{ width: `${downloadProgress}%` }}
              />
            </div>
            <p className="text-xs text-koon-text-secondary text-center">
              {downloadProgress}%
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-koon-100 rounded-lg flex items-center justify-center flex-shrink-0 border border-koon-border-light">
                <svg className="w-5 h-5 text-koon-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-medium mb-1 text-koon-900">
                  Mise à jour disponible
                </h3>
                <p className="text-sm text-koon-text-secondary">
                  Version {updateVersion}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleUpdate}
                className="flex-1 py-2 px-3 bg-koon-900 hover:bg-koon-800 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Mettre à jour
              </button>
              <button
                onClick={() => setUpdateAvailable(false)}
                className="px-3 py-2 bg-koon-50 hover:bg-koon-100 border border-koon-border-light text-koon-900 rounded-lg text-sm transition-colors"
              >
                Plus tard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
