import { HKDF_INFO, IDENTITY_ALGORITHM, KDF_ITERATIONS } from "./types";
import { base64ToBytes, bytesToBase64, encodeUtf8, randomBytes } from "./bytes";

const ECDH_PARAMS: EcKeyGenParams = { name: "ECDH", namedCurve: "P-256" };
const AES_GCM: AesKeyGenParams = { name: "AES-GCM", length: 256 };

export async function generateIdentityKeyPair(): Promise<CryptoKeyPair> {
  return crypto.subtle.generateKey(ECDH_PARAMS, true, ["deriveBits"]);
}

export async function exportPublicKey(key: CryptoKey): Promise<string> {
  return bytesToBase64(await crypto.subtle.exportKey("spki", key));
}

export async function importPublicKey(spki: string): Promise<CryptoKey> {
  return crypto.subtle.importKey("spki", base64ToBytes(spki), ECDH_PARAMS, true, []);
}

export async function importPrivateKey(pkcs8: ArrayBuffer | Uint8Array): Promise<CryptoKey> {
  const bytes = pkcs8 instanceof Uint8Array ? pkcs8 : new Uint8Array(pkcs8);
  return crypto.subtle.importKey("pkcs8", bytes, ECDH_PARAMS, false, ["deriveBits"]);
}

export async function wrapPrivateKey(
  privateKey: CryptoKey,
  password: string,
): Promise<{
  wrappedPrivateKey: string;
  wrapNonce: string;
  kdfSalt: string;
  kdfIterations: number;
  algorithm: string;
}> {
  const pkcs8 = await crypto.subtle.exportKey("pkcs8", privateKey);
  const kdfSalt = randomBytes(16);
  const kek = await deriveKek(password, kdfSalt, KDF_ITERATIONS);
  const wrapNonce = randomBytes(12);
  const wrapped = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: wrapNonce },
    kek,
    pkcs8,
  );
  return {
    wrappedPrivateKey: bytesToBase64(wrapped),
    wrapNonce: bytesToBase64(wrapNonce),
    kdfSalt: bytesToBase64(kdfSalt),
    kdfIterations: KDF_ITERATIONS,
    algorithm: IDENTITY_ALGORITHM,
  };
}

export async function unwrapPrivateKey(
  password: string,
  wrappedPrivateKey: string,
  wrapNonce: string,
  kdfSalt: string,
  kdfIterations: number,
): Promise<CryptoKey> {
  const kek = await deriveKek(password, base64ToBytes(kdfSalt), kdfIterations);
  const pkcs8 = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: base64ToBytes(wrapNonce) },
    kek,
    base64ToBytes(wrappedPrivateKey),
  );
  return importPrivateKey(pkcs8);
}

export async function generateConversationKey(): Promise<CryptoKey> {
  return crypto.subtle.generateKey(AES_GCM, true, ["encrypt", "decrypt"]);
}

export async function importConversationKey(raw: ArrayBuffer | Uint8Array): Promise<CryptoKey> {
  const bytes = raw instanceof Uint8Array ? raw : new Uint8Array(raw);
  return crypto.subtle.importKey("raw", bytes, AES_GCM, true, ["encrypt", "decrypt"]);
}

export async function wrapConversationKey(
  conversationKey: CryptoKey,
  recipientPublicKey: CryptoKey,
): Promise<{ wrappedKey: string; wrapNonce: string; ephPublicKey: string }> {
  const raw = await crypto.subtle.exportKey("raw", conversationKey);
  const eph = await crypto.subtle.generateKey(ECDH_PARAMS, true, ["deriveBits"]);
  const wrapKey = await deriveWrapKey(eph.privateKey, recipientPublicKey);
  const wrapNonce = randomBytes(12);
  const wrapped = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: wrapNonce },
    wrapKey,
    raw,
  );
  return {
    wrappedKey: bytesToBase64(wrapped),
    wrapNonce: bytesToBase64(wrapNonce),
    ephPublicKey: await exportPublicKey(eph.publicKey),
  };
}

export async function unwrapConversationKey(
  identityPrivateKey: CryptoKey,
  wrappedKey: string,
  wrapNonce: string,
  ephPublicKey: string,
): Promise<CryptoKey> {
  const ephPub = await importPublicKey(ephPublicKey);
  const wrapKey = await deriveWrapKey(identityPrivateKey, ephPub);
  const raw = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: base64ToBytes(wrapNonce) },
    wrapKey,
    base64ToBytes(wrappedKey),
  );
  return importConversationKey(raw);
}

export async function encryptBytes(key: CryptoKey, data: BufferSource): Promise<{ ciphertext: ArrayBuffer; nonce: Uint8Array }> {
  const nonce = randomBytes(12);
  const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv: nonce }, key, data);
  return { ciphertext, nonce };
}

export async function decryptBytes(
  key: CryptoKey,
  ciphertext: BufferSource,
  nonce: BufferSource,
): Promise<ArrayBuffer> {
  return crypto.subtle.decrypt({ name: "AES-GCM", iv: nonce }, key, ciphertext);
}

async function deriveKek(
  password: string,
  salt: BufferSource,
  iterations: number,
): Promise<CryptoKey> {
  const material = await crypto.subtle.importKey(
    "raw",
    encodeUtf8(password),
    "PBKDF2",
    false,
    ["deriveKey"],
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations, hash: "SHA-256" },
    material,
    AES_GCM,
    false,
    ["encrypt", "decrypt"],
  );
}

async function deriveWrapKey(
  privateKey: CryptoKey,
  publicKey: CryptoKey,
): Promise<CryptoKey> {
  const bits = await crypto.subtle.deriveBits(
    { name: "ECDH", public: publicKey },
    privateKey,
    256,
  );
  const ikm = await crypto.subtle.importKey("raw", bits, "HKDF", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    {
      name: "HKDF",
      hash: "SHA-256",
      salt: new Uint8Array(32),
      info: encodeUtf8(HKDF_INFO),
    },
    ikm,
    AES_GCM,
    false,
    ["encrypt", "decrypt"],
  );
}
