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
  profile?: {
    // Step2
    nom?: string;
    prenom?: string;
    deuxiemePrenom?: string;
    age?: string;
    sexe?: string;
    // Step3
    pays?: string;
    telephone?: string;
    email?: string;
    emailSecondaire?: string;
    region?: string;
    ville?: string;
    quartier?: string;
    adressePostale?: string;
    latitude?: string;
    longitude?: string;
    // Step4
    password?: string;
    pin?: string;
  };
}

export type AppPage = "setup" | "chat";
