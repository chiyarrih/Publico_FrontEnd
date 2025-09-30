// utils/encryptor.ts
const enc = new TextEncoder();
const dec = new TextDecoder();

const SECRET_KEY = import.meta.env.VITE_PRIVATE_KEY_SECRET || "default-secret";

async function getKey() {
  const keyData = enc.encode(SECRET_KEY);
  return crypto.subtle.importKey(
    "raw",
    await crypto.subtle.digest("SHA-256", keyData),
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"]
  );
}

function toHex(arr: Uint8Array) {
  return Array.from(arr).map(b => b.toString(16).padStart(2, "0")).join("");
}

function fromHex(hex: string) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}

export async function encrypt(text: string) {
  const iv = crypto.getRandomValues(new Uint8Array(12)); // <-- 12 bytes
  const key = await getKey();
  const encoded = enc.encode(text);

  const cipherBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoded
  );

  const fullCipher = new Uint8Array(cipherBuffer);
  const ciphertext = fullCipher.slice(0, fullCipher.length - 16);
  const authTag = fullCipher.slice(fullCipher.length - 16);

  return `${toHex(iv)}:${toHex(authTag)}:${toHex(ciphertext)}`;
}

export async function decrypt(ciphertext: string) {
  const [ivHex, authTagHex, encryptedHex] = ciphertext.split(":");

  const iv = fromHex(ivHex);
  const authTag = fromHex(authTagHex);
  const encrypted = fromHex(encryptedHex);

  const combined = new Uint8Array(encrypted.length + authTag.length);
  combined.set(encrypted);
  combined.set(authTag, encrypted.length);

  const key = await getKey();

  const plainBuffer = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv }, // must be 12 bytes
    key,
    combined
  );

  return dec.decode(plainBuffer);
}
