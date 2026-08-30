import { app, BrowserWindow, ipcMain, shell, Notification } from 'electron'
import path from 'path'
import { setupIpcHandlers } from './ipc/handlers'
import { initDatabase } from './db/database'
import { startRelayServer, stopRelayServer } from './network/relay'
import { disconnectFromRelay } from './network/client'
import { getPendingNotifications, dismissNotification, getAdDetail } from './db/adsRepo'
import { loadIdentity } from './db/identityRepo'

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged

let mainWindow: BrowserWindow | null = null

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 750,
    minWidth: 800,
    minHeight: 600,
    frame: false,
    titleBarStyle: 'hidden',
    backgroundColor: '#0d0d0d',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
    icon: path.join(__dirname, '../assets/icon.png'),
  })

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(async () => {
  initDatabase()
  setupIpcHandlers(ipcMain)
  try {
    await startRelayServer()
  } catch (err) {
    console.error('[Main] Relay server failed to start:', err)
  }
  createWindow()
  startSnoozeChecker()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// ── Snooze / notification checker ────────────────────────────────────────────
let snoozeTimer: ReturnType<typeof setInterval> | null = null

function startSnoozeChecker(): void {
  // Check every minute for pending snooze notifications
  snoozeTimer = setInterval(checkPendingNotifications, 60_000)
  // Also check on window focus
  app.on('browser-window-focus', checkPendingNotifications)
}

function checkPendingNotifications(): void {
  try {
    const stored = loadIdentity()
    if (!stored) return
    const now = Date.now() / 1000  // seconds
    const pending = getPendingNotifications(stored.pubkey, now)
    pending.forEach((notif) => {
      dismissNotification(notif.id)
      if (notif.ad_id) {
        const ad = getAdDetail(notif.ad_id)
        if (ad && Notification.isSupported()) {
          new Notification({
            title: `📣 Rappel — ${ad.company_name}`,
            body: ad.description.slice(0, 100),
          }).show()
        }
      }
    })
  } catch (err) {
    console.error('[Main] Snooze check error:', err)
  }
}

app.on('before-quit', () => {
  if (snoozeTimer) clearInterval(snoozeTimer)
  disconnectFromRelay()
  stopRelayServer()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// Window controls IPC
ipcMain.on('window:minimize', () => mainWindow?.minimize())
ipcMain.on('window:maximize', () => {
  if (mainWindow?.isMaximized()) mainWindow.unmaximize()
  else mainWindow?.maximize()
})
ipcMain.on('window:close', () => mainWindow?.close())
