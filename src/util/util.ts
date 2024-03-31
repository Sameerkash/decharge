import * as crypto from 'crypto';

const ENCRYPTION_KEY = crypto.randomBytes(32); // Generating a random 32-byte key
const IV_LENGTH = 16; // For AES, this is always 16

// Function to encrypt a private key
export function encryptPrivateKey(privateKey: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(privateKey, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + encrypted;
}

// Function to decrypt a private key
export function decryptPrivateKey(encryptedPrivateKey: string): string {
  const iv = Buffer.from(encryptedPrivateKey.slice(0, IV_LENGTH * 2), 'hex');
  const encryptedText = encryptedPrivateKey.slice(IV_LENGTH * 2);
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(ENCRYPTION_KEY),
    iv,
  );
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
export function uint8ArrayToString(uint8Array: Uint8Array): string {
  const decoder = new TextDecoder('utf-8');
  return decoder.decode(uint8Array);
}

export function stringToUint8Array(str: string): Uint8Array {
  const encoder = new TextEncoder();
  return encoder.encode(str);
}
