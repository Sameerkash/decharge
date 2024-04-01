import * as crypto from 'crypto';

export function generatePhoneNumberHash(phoneNumber: string): string {
  // Create a SHA-256 hash object
  const hash = crypto.createHash('sha256');

  // Update the hash object with the phone number
  hash.update(phoneNumber);

  // Calculate the hash digest and return it as a hexadecimal string
  return hash.digest('hex');
}

export function arrayBufferToString(buffer: ArrayBuffer): string {
  const decoder = new TextDecoder('utf-8');
  return decoder.decode(buffer);
}
