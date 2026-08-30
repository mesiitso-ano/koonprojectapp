import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'

contextBridge.exposeInMainWorld('koon', {
  // Window controls
  window: {
    minimize: () => ipcRenderer.send('window:minimize'),
    maximize: () => ipcRenderer.send('window:maximize'),
    close: () => ipcRenderer.send('window:close'),
  },

  // Identity / Wallet
  identity: {
    generate: () => ipcRenderer.invoke('identity:generate'),
    import: (mnemonic: string) => ipcRenderer.invoke('identity:import', mnemonic),
    getCurrent: () => ipcRenderer.invoke('identity:getCurrent'),
    clear: () => ipcRenderer.invoke('identity:clear'),
  },

  // Contacts
  contacts: {
    list: () => ipcRenderer.invoke('contacts:list'),
    add: (pubkey: string, nickname: string) => ipcRenderer.invoke('contacts:add', pubkey, nickname),
    remove: (pubkey: string) => ipcRenderer.invoke('contacts:remove', pubkey),
  },

  // Messages
  messages: {
    list: (contactPubkey: string) => ipcRenderer.invoke('messages:list', contactPubkey),
    send: (contactPubkey: string, plaintext: string) => ipcRenderer.invoke('messages:send', contactPubkey, plaintext),
    onReceive: (cb: (msg: unknown) => void) => {
      const listener = (_e: IpcRendererEvent, msg: unknown) => cb(msg)
      ipcRenderer.on('message:received', listener)
      return () => ipcRenderer.off('message:received', listener)
    },
  },

  // Network
  network: {
    getStatus: () => ipcRenderer.invoke('network:status'),
    connect: (relayUrl: string) => ipcRenderer.invoke('network:connect', relayUrl),
    onStatusChange: (cb: (status: string) => void) => {
      const listener = (_e: IpcRendererEvent, s: string) => cb(s)
      ipcRenderer.on('network:statusChanged', listener)
      return () => ipcRenderer.off('network:statusChanged', listener)
    },
  },
})
