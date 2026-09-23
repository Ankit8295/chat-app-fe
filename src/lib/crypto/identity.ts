import { getMe, getMyCrypto, putMyCrypto } from "@/lib/queries/user/api";
import {
  exportPublicKey,
  generateIdentityKeyPair,
  unwrapPrivateKey,
  wrapPrivateKey,
} from "./primitives";
import {
  getMemoryIdentity,
  isIdentityReady,
  loadIdentity,
  persistIdentity,
  setMemoryIdentity,
} from "./store";

export async function hydrateIdentity(userId: string): Promise<boolean> {
  const record = await loadIdentity(userId);
  return Boolean(record);
}

export async function ensureIdentityKeys(password: string): Promise<void> {
  const me = await getMe();
  const cached = await loadIdentity(me.id);
  if (cached) {
    setMemoryIdentity(cached);
    return;
  }

  const existing = await getMyCrypto();
  if (existing) {
    try {
      const privateKey = await unwrapPrivateKey(
        password,
        existing.wrappedPrivateKey,
        existing.wrapNonce,
        existing.kdfSalt,
        existing.kdfIterations,
      );
      await persistIdentity({
        userId: me.id,
        publicKey: existing.publicKey,
        privateKey,
      });
      return;
    } catch {
      throw new Error("error-identity-unlock-failed");
    }
  }

  try {
    const pair = await generateIdentityKeyPair();
    const publicKey = await exportPublicKey(pair.publicKey);
    const wrapped = await wrapPrivateKey(pair.privateKey, password);
    await putMyCrypto({
      publicKey,
      wrappedPrivateKey: wrapped.wrappedPrivateKey,
      wrapNonce: wrapped.wrapNonce,
      kdfSalt: wrapped.kdfSalt,
      kdfIterations: wrapped.kdfIterations,
      algorithm: wrapped.algorithm,
    });
    await persistIdentity({
      userId: me.id,
      publicKey,
      privateKey: pair.privateKey,
    });
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("error-")) throw error;
    throw new Error("error-identity-setup-failed");
  }
}

export function requireIdentity(userId?: string) {
  const identity = getMemoryIdentity();
  if (!identity || (userId && identity.userId !== userId) || !isIdentityReady(userId)) {
    throw new Error("error-identity-unlock-failed");
  }
  return identity;
}
