import {
  getConversationKeys,
  putConversationKeys,
} from "@/lib/queries/chat/api";
import { ConversationDetail, CreateConversationRequest, KeyEnvelope } from "@/lib/queries/chat/types";
import { getMe, getPublicCrypto } from "@/lib/queries/user/api";
import { requireIdentity } from "./identity";
import {
  generateConversationKey,
  importPublicKey,
  unwrapConversationKey,
  wrapConversationKey,
} from "./primitives";
import {
  getMemoryConversationKey,
  loadConversationKey,
  persistConversationKey,
} from "./store";
import { CONVERSATION_KEY_VERSION } from "./types";

async function wrapForParticipants(
  conversationKey: CryptoKey,
  participantIds: string[],
): Promise<KeyEnvelope[]> {
  const identity = requireIdentity();
  const otherIds = participantIds.filter((id) => id !== identity.userId);
  const remoteKeys = otherIds.length > 0 ? await getPublicCrypto(otherIds) : [];
  const missing = otherIds.filter(
    (id) => !remoteKeys.some((key) => String(key.userId) === id),
  );
  if (missing.length > 0) {
    throw new Error("error-missing-public-keys");
  }

  const keyMaterial: { userId: string; publicKey: string }[] = [
    ...remoteKeys.map((key) => ({
      userId: String(key.userId),
      publicKey: key.publicKey,
    })),
    { userId: identity.userId, publicKey: identity.publicKey },
  ];

  return Promise.all(
    keyMaterial.map(async (key) => {
      const wrapped = await wrapConversationKey(
        conversationKey,
        await importPublicKey(key.publicKey),
      );
      return {
        userId: key.userId,
        wrappedKey: wrapped.wrappedKey,
        wrapNonce: wrapped.wrapNonce,
        ephPublicKey: wrapped.ephPublicKey,
      };
    }),
  );
}

export async function attachConversationEnvelopes(
  request: CreateConversationRequest,
): Promise<CreateConversationRequest> {
  const me = await getMe();
  requireIdentity(me.id);
  const participantIds =
    request.type === "DIRECT"
      ? [me.id, request.userId]
      : Array.from(new Set([me.id, ...request.participants]));
  const conversationKey = await generateConversationKey();
  const envelopes = await wrapForParticipants(conversationKey, participantIds);
  return {
    ...request,
    keyVersion: CONVERSATION_KEY_VERSION,
    envelopes,
  };
}

export async function ensureConversationKey(
  conversationId: string,
  participantIds: string[] = [],
): Promise<CryptoKey> {
  const identity = requireIdentity();
  const cached =
    getMemoryConversationKey(identity.userId, conversationId, CONVERSATION_KEY_VERSION) ??
    (await loadConversationKey(identity.userId, conversationId, CONVERSATION_KEY_VERSION));
  if (cached) return cached;

  const { envelopes } = await getConversationKeys(conversationId);
  const latest = envelopes.reduce<(typeof envelopes)[number] | null>((best, envelope) => {
    if (!best || envelope.keyVersion > best.keyVersion) return envelope;
    return best;
  }, null);

  if (latest) {
    const key = await unwrapConversationKey(
      identity.privateKey,
      latest.wrappedKey,
      latest.wrapNonce,
      latest.ephPublicKey,
    );
    await persistConversationKey({
      userId: identity.userId,
      conversationId,
      keyVersion: latest.keyVersion,
      key,
    });
    return key;
  }

  if (participantIds.length === 0) {
    throw new Error("error-conversation-key-unavailable");
  }

  const conversationKey = await generateConversationKey();
  const wrapped = await wrapForParticipants(conversationKey, participantIds);
  const saved = await putConversationKeys(conversationId, {
    keyVersion: CONVERSATION_KEY_VERSION,
    envelopes: wrapped,
  });
  const mine =
    saved.envelopes.find((envelope) => envelope.keyVersion === CONVERSATION_KEY_VERSION) ??
    saved.envelopes[0];
  if (!mine) {
    throw new Error("error-conversation-key-unavailable");
  }
  const key = await unwrapConversationKey(
    identity.privateKey,
    mine.wrappedKey,
    mine.wrapNonce,
    mine.ephPublicKey,
  );
  await persistConversationKey({
    userId: identity.userId,
    conversationId,
    keyVersion: mine.keyVersion,
    key,
  });
  return key;
}

export function conversationMemberIds(
  conversation: ConversationDetail,
  myId?: string,
): string[] {
  if (conversation.type === "direct") {
    return [myId, conversation.friend?.id].filter((id): id is string => Boolean(id));
  }
  const ids = conversation.participants.map((participant) => participant.id);
  if (myId && !ids.includes(myId)) {
    ids.push(myId);
  }
  return ids;
}

export async function getConversationKey(
  conversationId: string,
  keyVersion: number,
): Promise<CryptoKey> {
  const identity = requireIdentity();
  const cached =
    getMemoryConversationKey(identity.userId, conversationId, keyVersion) ??
    (await loadConversationKey(identity.userId, conversationId, keyVersion));
  if (cached) return cached;
  return ensureConversationKey(conversationId);
}
