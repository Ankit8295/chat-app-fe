import { base64ToBytes, compareBytes, concatBytes } from "./bytes";

function toDigitGroups(hash: Uint8Array): string {
  const digits = Array.from(hash.slice(0, 30))
    .map((byte) => (byte % 100).toString().padStart(2, "0"))
    .join("");
  return digits.match(/.{5}/g)?.join(" ") ?? digits;
}

export async function safetyNumber(
  publicKeyA: string,
  publicKeyB: string,
): Promise<string> {
  const a = base64ToBytes(publicKeyA);
  const b = base64ToBytes(publicKeyB);
  const [first, second] = compareBytes(a, b) <= 0 ? [a, b] : [b, a];
  const digest = await crypto.subtle.digest("SHA-256", concatBytes(first, second));
  return toDigitGroups(new Uint8Array(digest));
}
