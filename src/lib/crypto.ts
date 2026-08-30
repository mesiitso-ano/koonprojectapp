// Utilitaires cryptographiques — génération de clés depuis BIP39
import { mnemonicToSeedSync } from "bip39";
import nacl from "tweetnacl";

// Helper pour convertir string vers Uint8Array
function stringToUint8Array(str: string): Uint8Array {
  const encoder = new TextEncoder();
  return encoder.encode(str);
}

// Helper pour convertir Uint8Array vers string
function uint8ArrayToString(arr: Uint8Array): string {
  const decoder = new TextDecoder();
  return decoder.decode(arr);
}

// Helper pour convertir hex vers Uint8Array
function hexToUint8Array(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

// Helper pour convertir Uint8Array vers hex
function uint8ArrayToHex(arr: Uint8Array): string {
  return Array.from(arr)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Helper pour convertir Uint8Array vers base64
function uint8ArrayToBase64(arr: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < arr.length; i++) {
    binary += String.fromCharCode(arr[i]);
  }
  return btoa(binary);
}

// Helper pour convertir base64 vers Uint8Array
function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export function generateKeypairFromMnemonic(mnemonic: string) {
  const seed = mnemonicToSeedSync(mnemonic);
  const keypair = nacl.sign.keyPair.fromSeed(seed.slice(0, 32));

  return {
    publicKey: uint8ArrayToHex(keypair.publicKey),
    privateKey: uint8ArrayToHex(keypair.secretKey),
  };
}

export function encryptMessage(
  message: string,
  recipientPublicKey: string,
  senderPrivateKey: string
): string {
  const nonce = nacl.randomBytes(nacl.box.nonceLength);
  const messageUint8 = stringToUint8Array(message);

  const encrypted = nacl.box(
    messageUint8,
    nonce,
    hexToUint8Array(recipientPublicKey),
    hexToUint8Array(senderPrivateKey).slice(0, 32)
  );

  if (!encrypted) {
    throw new Error("Échec du chiffrement");
  }

  const fullMessage = new Uint8Array(nonce.length + encrypted.length);
  fullMessage.set(nonce);
  fullMessage.set(encrypted, nonce.length);

  return uint8ArrayToBase64(fullMessage);
}

export function decryptMessage(
  encryptedMessage: string,
  senderPublicKey: string,
  recipientPrivateKey: string
): string {
  const messageWithNonce = base64ToUint8Array(encryptedMessage);
  const nonce = messageWithNonce.slice(0, nacl.box.nonceLength);
  const message = messageWithNonce.slice(nacl.box.nonceLength);

  const decrypted = nacl.box.open(
    message,
    nonce,
    hexToUint8Array(senderPublicKey),
    hexToUint8Array(recipientPrivateKey).slice(0, 32)
  );

  if (!decrypted) {
    throw new Error("Échec du déchiffrement");
  }

  return uint8ArrayToString(decrypted);
}
