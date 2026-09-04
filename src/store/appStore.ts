// Store Zustand global — gestion de l'état React
import { create } from "zustand";
import type { AppPage, Contact, Message, Wallet } from "../types";
import { invoke } from "@tauri-apps/api/core";

interface AppSettings {
  notifications: boolean;
  darkMode: boolean;
  autoUpdate: boolean;
  soundEffects: boolean;
  encryption: boolean;
  autoSave: boolean;
  compactMode: boolean;
  showOnlineStatus: boolean;
}

interface AppState {
  // État de navigation
  currentPage: AppPage;
  setCurrentPage: (page: AppPage) => void;

  // Wallet cryptographique
  wallet: Wallet | null;
  setWallet: (wallet: Wallet) => void;
  updateProfile: (profileData: Partial<Wallet["profile"]>) => void;

  // Liste des comptes créés (pour Admin)
  accounts: Wallet[];
  addAccount: (wallet: Wallet) => void;

  // Contacts et messages
  contacts: Contact[];
  selectedContactId: string | null;
  messages: Message[];

  addContact: (contact: Contact) => void;
  selectContact: (contactId: string) => void;
  sendMessage: (content: string) => Promise<void>;
  addMessage: (message: Message) => void;

  // Paramètres utilisateur
  settings: AppSettings;
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;

  // Initialisation au démarrage
  initializeApp: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  currentPage: "setup",
  setCurrentPage: (page) => set({ currentPage: page }),

  wallet: null,
  setWallet: (wallet) => {
    set({ wallet });
    // Sauvegarde automatique dans SQLite via Tauri
    invoke("save_wallet", { wallet }).catch(console.error);
  },

  updateProfile: (profileData) => {
    set((state) => {
      if (!state.wallet) return state;
      
      const updatedWallet = {
        ...state.wallet,
        profile: {
          ...state.wallet.profile,
          ...profileData
        }
      };
      
      // Sauvegarde automatique
      invoke("save_wallet", { wallet: updatedWallet }).catch(console.error);
      
      return { wallet: updatedWallet };
    });
  },

  // Liste des comptes
  accounts: [],
  addAccount: (wallet) => {
    set((state) => ({
      accounts: [...state.accounts, wallet]
    }));
  },

  contacts: [],
  selectedContactId: null,
  messages: [],

  addContact: (contact) =>
    set((state) => ({
      contacts: [...state.contacts, contact],
    })),

  selectContact: (contactId) => {
    set({ selectedContactId: contactId });
    // Charger l'historique des messages depuis SQLite
    invoke<Message[]>("load_messages", { contactId })
      .then((messages) => set({ messages }))
      .catch(console.error);
  },

  // Paramètres par défaut
  settings: {
    notifications: true,
    darkMode: false,
    autoUpdate: true,
    soundEffects: true,
    encryption: true,
    autoSave: true,
    compactMode: false,
    showOnlineStatus: true,
  },

  updateSetting: (key, value) => {
    set((state) => ({
      settings: {
        ...state.settings,
        [key]: value,
      },
    }));
  },

  sendMessage: async (content) => {
    const { wallet, selectedContactId, contacts } = get();
    if (!wallet || !selectedContactId) return;

    const contact = contacts.find((c) => c.id === selectedContactId);
    if (!contact) return;

    const message: Message = {
      id: crypto.randomUUID(),
      content,
      sender: "me",
      timestamp: Date.now(),
      status: "sending",
    };

    // Optimistic update
    set((state) => ({ messages: [...state.messages, message] }));

    try {
      // Chiffrement + sauvegarde via Tauri
      await invoke("send_message", {
        message: {
          id: message.id,
          content,
          recipientPublicKey: contact.publicKey,
          senderPrivateKey: wallet.privateKey,
        },
      });

      // Mise à jour du statut
      set((state) => ({
        messages: state.messages.map((m) =>
          m.id === message.id ? { ...m, status: "sent" as const } : m
        ),
      }));
    } catch (error) {
      console.error("Erreur envoi message:", error);
      set((state) => ({
        messages: state.messages.map((m) =>
          m.id === message.id ? { ...m, status: "failed" as const } : m
        ),
      }));
    }
  },

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  initializeApp: async () => {
    console.log("🔍 initializeApp: Démarrage...");
    
    try {
      // TEMPORAIRE: Forcer SetupPage pour debug
      console.log("⚠️ MODE DEBUG: Forçage vers SetupPage");
      set({ currentPage: "setup" });
      return;
      
      // Code original (désactivé temporairement)
      /*
      // Vérifier si un wallet existe déjà
      const existingWallet = await invoke<Wallet | null>("load_wallet");
      if (existingWallet) {
        set({ wallet: existingWallet, currentPage: "chat" });
        // Charger les contacts
        const contacts = await invoke<Contact[]>("load_contacts");
        set({ contacts });
      } else {
        set({ currentPage: "setup" });
      }
      */
    } catch (error) {
      console.error("❌ Erreur initialisation:", error);
      set({ currentPage: "setup" });
    }
  },
}));
