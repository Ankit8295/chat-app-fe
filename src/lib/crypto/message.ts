import { Message, WireMessage } from "@/lib/queries/message/types";
import { base64ToBytes, bytesToBase64, decodeUtf8, encodeUtf8 } from "./bytes";
import { ensureConversationKey, getConversationKey } from "./conversation";
import { decryptBytes, encryptBytes } from "./primitives";
import { CONVERSATION_KEY_VERSION, MAX_PLAINTEXT_CHARS } from "./types";

export async function encryptPlaintext(
  conversationId: string,
  plaintext: string,
): Promise<{ ciphertext: string; nonce: string; keyVersion: number }> {
  const trimmed = plaintext.trim();
  if (!trimmed) {
    throw new Error("Message content is required");
  }
  if (trimmed.length > MAX_PLAINTEXT_CHARS) {
    throw new Error("Message is too long");
  }
  const key = await ensureConversationKey(conversationId);
  const { ciphertext, nonce } = await encryptBytes(key, encodeUtf8(trimmed));
  return {
    ciphertext: bytesToBase64(ciphertext),
    nonce: bytesToBase64(nonce),
    keyVersion: CONVERSATION_KEY_VERSION,
  };
}

export async function decryptWireMessage(message: WireMessage): Promise<Message> {
  const base: Message = {
    id: message.id,
    conversationId: message.conversationId,
    senderId: message.senderId,
    senderName: message.senderName,
    senderImage: message.senderImage,
    content: message.content ?? "",
    createdAt: message.createdAt,
  };

  if (!message.keyVersion || message.keyVersion < 1) {
    return base;
  }

  if (!message.ciphertext || !message.nonce) {
    return { ...base, content: "", decryptFailed: true };
  }

  try {
    const key = await getConversationKey(message.conversationId, message.keyVersion);
    const plaintext = decodeUtf8(
      await decryptBytes(key, base64ToBytes(message.ciphertext), base64ToBytes(message.nonce)),
    );
    return { ...base, content: plaintext };
  } catch {
    return { ...base, content: "", decryptFailed: true };
  }
}
