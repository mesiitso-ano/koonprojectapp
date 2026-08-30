// Définitions TypeScript centralisées

export interface Message {
  id: string;
  content: string;
  sender: "me" | "peer";
  timestamp: number;
  status: "sending" | "sent" | "failed";
}

export interface Contact {
  id: string;
  name: string;
  publicKey: string;
  lastMessage?: Message;
  unreadCount: number;
}

export interface Wallet {
  mnemonic: string;
  publicKey: string;
  privateKey: string;
}

export type AppPage = "setup" | "chat";
