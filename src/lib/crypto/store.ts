type IdentityRecord = {
  userId: string;
  publicKey: string;
  privateKey: CryptoKey;
};

type ConversationKeyRecord = {
  id: string;
  userId: string;
  conversationId: string;
  keyVersion: number;
  key: CryptoKey;
};

const DB_NAME = "thechat-e2ee";
const DB_VERSION = 1;

let memoryIdentity: IdentityRecord | null = null;
const memoryConversationKeys = new Map<string, CryptoKey>();

function conversationKeyId(userId: string, conversationId: string, keyVersion: number) {
  return `${userId}:${conversationId}:${keyVersion}`;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("identity")) {
        db.createObjectStore("identity", { keyPath: "userId" });
      }
      if (!db.objectStoreNames.contains("conversationKeys")) {
        db.createObjectStore("conversationKeys", { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function idbRequest<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export function getMemoryIdentity(): IdentityRecord | null {
  return memoryIdentity;
}

export function setMemoryIdentity(record: IdentityRecord) {
  memoryIdentity = record;
}

export function isIdentityReady(userId?: string) {
  if (!memoryIdentity) return false;
  return userId ? memoryIdentity.userId === userId : true;
}

export async function persistIdentity(record: IdentityRecord) {
  memoryIdentity = record;
  const db = await openDb();
  const tx = db.transaction("identity", "readwrite");
  tx.objectStore("identity").put(record);
  await new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
}

export async function loadIdentity(userId: string): Promise<IdentityRecord | null> {
  if (memoryIdentity?.userId === userId) return memoryIdentity;
  const db = await openDb();
  const tx = db.transaction("identity", "readonly");
  const record = await idbRequest<IdentityRecord | undefined>(
    tx.objectStore("identity").get(userId),
  );
  db.close();
  if (!record) return null;
  memoryIdentity = record;
  return record;
}

export function getMemoryConversationKey(
  userId: string,
  conversationId: string,
  keyVersion: number,
): CryptoKey | undefined {
  return memoryConversationKeys.get(conversationKeyId(userId, conversationId, keyVersion));
}

export async function persistConversationKey(record: Omit<ConversationKeyRecord, "id">) {
  const id = conversationKeyId(record.userId, record.conversationId, record.keyVersion);
  memoryConversationKeys.set(id, record.key);
  const db = await openDb();
  const tx = db.transaction("conversationKeys", "readwrite");
  tx.objectStore("conversationKeys").put({ ...record, id });
  await new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
}

export async function loadConversationKey(
  userId: string,
  conversationId: string,
  keyVersion: number,
): Promise<CryptoKey | null> {
  const id = conversationKeyId(userId, conversationId, keyVersion);
  const cached = memoryConversationKeys.get(id);
  if (cached) return cached;
  const db = await openDb();
  const tx = db.transaction("conversationKeys", "readonly");
  const record = await idbRequest<ConversationKeyRecord | undefined>(
    tx.objectStore("conversationKeys").get(id),
  );
  db.close();
  if (!record) return null;
  memoryConversationKeys.set(id, record.key);
  return record.key;
}
