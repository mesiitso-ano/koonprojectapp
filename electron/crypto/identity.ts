import * as bip39 from 'bip39'
import { x25519 } from '@noble/curves/ed25519'
import nacl from 'tweetnacl'
import { encodeBase64, decodeBase64 } from 'tweetnacl-util'
import crypto from 'crypto'

export interface Identity {
  mnemonic: string
  pubkey: string       // base64 X25519 public key
  privkey: string      // base64 X25519 private key
  sigPubkey: string    // base64 Ed25519 public key (for signatures)
  sigPrivkey: string   // base64 Ed25519 private key
}

/**
 * Dérive une seed 64 octets depuis un mnémonique BIP39,
 * puis génère une paire X25519 (DH) + Ed25519 (signature).
 */
export function deriveIdentityFromMnemonic(mnemonic: string): Identity {
  if (!bip39.validateMnemonic(mnemonic)) {
    throw new Error('Mnémonique BIP39 invalide')
  }

  // Seed 64 octets (PBKDF2 interne à bip39)
  const seedBuffer = bip39.mnemonicToSeedSync(mnemonic)

  // X25519 : utilise les 32 premiers octets
  const dhSeed = seedBuffer.slice(0, 32)
  const dhPriv = dhSeed
  const dhPub = x25519.getPublicKey(dhPriv)

  // Ed25519 : utilise les 32 octets suivants
  const edSeed = seedBuffer.slice(32, 64)
  const edKeyPair = nacl.sign.keyPair.fromSeed(edSeed)

  return {
    mnemonic,
    pubkey: encodeBase64(dhPub),
    privkey: encodeBase64(dhPriv),
    sigPubkey: encodeBase64(edKeyPair.publicKey),
    sigPrivkey: encodeBase64(edKeyPair.secretKey),
  }
}

/**
 * Génère un nouveau mnémonique 12 mots et dérive l'identité.
 */
export function generateIdentity(): Identity {
  const mnemonic = bip39.generateMnemonic(128) // 12 mots
  return deriveIdentityFromMnemonic(mnemonic)
}

/**
 * Chiffrement X25519 + XSalsa20-Poly1305 (NaCl box).
 * Retourne { nonce, ciphertext } en base64.
 */
export function encryptMessage(
  plaintext: string,
  recipientPubkeyB64: string,
  senderPrivkeyB64: string
): { nonce: string; ciphertext: string } {
  const recipientPub = decodeBase64(recipientPubkeyB64)
  const senderPriv = decodeBase64(senderPrivkeyB64)
  const nonce = nacl.randomBytes(nacl.box.nonceLength)
  const encoder = new TextEncoder()
  const message = encoder.encode(plaintext)
  const box = nacl.box(message, nonce, recipientPub, senderPriv)

  return {
    nonce: encodeBase64(nonce),
    ciphertext: encodeBase64(box),
  }
}

/**
 * Déchiffrement NaCl box.
 */
export function decryptMessage(
  ciphertextB64: string,
  nonceB64: string,
  senderPubkeyB64: string,
  recipientPrivkeyB64: string
): string {
  const ciphertext = decodeBase64(ciphertextB64)
  const nonce = decodeBase64(nonceB64)
  const senderPub = decodeBase64(senderPubkeyB64)
  const recipientPriv = decodeBase64(recipientPrivkeyB64)

  const opened = nacl.box.open(ciphertext, nonce, senderPub, recipientPriv)
  if (!opened) throw new Error('Déchiffrement échoué — message altéré ou clé incorrecte')

  const decoder = new TextDecoder()
  return decoder.decode(opened)
}

/**
 * Signe un message avec Ed25519.
 */
export function signMessage(message: string, sigPrivkeyB64: string): string {
  const key = decodeBase64(sigPrivkeyB64)
  const encoder = new TextEncoder()
  const sig = nacl.sign.detached(encoder.encode(message), key)
  return encodeBase64(sig)
}

/**
 * Vérifie une signature Ed25519.
 */
export function verifySignature(
  message: string,
  signatureB64: string,
  sigPubkeyB64: string
): boolean {
  try {
    const sig = decodeBase64(signatureB64)
    const pub = decodeBase64(sigPubkeyB64)
    const encoder = new TextEncoder()
    return nacl.sign.detached.verify(encoder.encode(message), sig, pub)
  } catch {
    return false
  }
}

/**
 * Hache une pubkey pour obtenir un identifiant court lisible.
 */
export function shortId(pubkeyB64: string): string {
  const hash = crypto.createHash('sha256').update(pubkeyB64).digest('hex')
  return hash.slice(0, 12).toUpperCase()
}
