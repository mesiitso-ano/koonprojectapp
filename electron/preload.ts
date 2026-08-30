import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'

contextBridge.exposeInMainWorld('koon', {
  // ── Window controls ──────────────────────────────────────────────────────
  window: {
    minimize: () => ipcRenderer.send('window:minimize'),
    maximize: () => ipcRenderer.send('window:maximize'),
    close:    () => ipcRenderer.send('window:close'),
  },

  // ── Identity ─────────────────────────────────────────────────────────────
  identity: {
    generate:   () => ipcRenderer.invoke('identity:generate'),
    import:     (mnemonic: string) => ipcRenderer.invoke('identity:import', mnemonic),
    getCurrent: () => ipcRenderer.invoke('identity:getCurrent'),
    clear:      () => ipcRenderer.invoke('identity:clear'),
  },

  // ── Contacts ─────────────────────────────────────────────────────────────
  contacts: {
    list:   () => ipcRenderer.invoke('contacts:list'),
    add:    (pubkey: string, nickname: string) => ipcRenderer.invoke('contacts:add', pubkey, nickname),
    remove: (pubkey: string) => ipcRenderer.invoke('contacts:remove', pubkey),
  },

  // ── Messages ─────────────────────────────────────────────────────────────
  messages: {
    list: (contactPubkey: string) => ipcRenderer.invoke('messages:list', contactPubkey),
    send: (contactPubkey: string, plaintext: string) => ipcRenderer.invoke('messages:send', contactPubkey, plaintext),
    onReceive: (cb: (msg: unknown) => void) => {
      const listener = (_e: IpcRendererEvent, msg: unknown) => cb(msg)
      ipcRenderer.on('message:received', listener)
      return () => ipcRenderer.off('message:received', listener)
    },
  },

  // ── Network ──────────────────────────────────────────────────────────────
  network: {
    getStatus: () => ipcRenderer.invoke('network:status'),
    connect:   (relayUrl: string) => ipcRenderer.invoke('network:connect', relayUrl),
    onStatusChange: (cb: (status: string) => void) => {
      const listener = (_e: IpcRendererEvent, s: string) => cb(s)
      ipcRenderer.on('network:statusChanged', listener)
      return () => ipcRenderer.off('network:statusChanged', listener)
    },
  },

  // ── Ads — Annonces ────────────────────────────────────────────────────────
  ads: {
    list: (params: import('./db/adsRepo').AdsListParams) =>
      ipcRenderer.invoke('ads:list', params),
    create: (payload: import('./db/adsRepo').AdCreatePayload) =>
      ipcRenderer.invoke('ads:create', payload),
    getDetail: (id: string) =>
      ipcRenderer.invoke('ads:getDetail', { id }),
    interact: (payload: import('./db/adsRepo').AdInteractPayload) =>
      ipcRenderer.invoke('ads:interact', payload),
    snooze: (adId: string, scheduledAt: number) =>
      ipcRenderer.invoke('ads:snooze', { adId, scheduledAt }),
    comment: (payload: import('./db/adsRepo').AdCommentPayload) =>
      ipcRenderer.invoke('ads:comment', payload),
    getComments: (adId: string, limit?: number, offset?: number) =>
      ipcRenderer.invoke('ads:getComments', { adId, limit, offset }),
    clearHistory: () =>
      ipcRenderer.invoke('ads:clearHistory'),
    getSettings: () =>
      ipcRenderer.invoke('ads:getSettings'),
    saveSettings: (settings: Partial<import('./db/adsRepo').AdsSettings>) =>
      ipcRenderer.invoke('ads:saveSettings', settings),
  },

  // ── Enterprise ────────────────────────────────────────────────────────────
  enterprise: {
    request: (payload: import('./db/adsRepo').EnterpriseRequestPayload) =>
      ipcRenderer.invoke('enterprise:request', payload),
    getProfile: (pubkey: string) =>
      ipcRenderer.invoke('enterprise:getProfile', { pubkey }),
    list: () =>
      ipcRenderer.invoke('enterprise:list'),
    follow: (enterprisePubkey: string) =>
      ipcRenderer.invoke('enterprise:follow', { enterprisePubkey }),
    unfollow: (enterprisePubkey: string) =>
      ipcRenderer.invoke('enterprise:unfollow', { enterprisePubkey }),
    getFollowed: () =>
      ipcRenderer.invoke('enterprise:getFollowed'),
  },
})
