import crypto from 'crypto';

export function generateHash(phoneNumber: string): string {
  // Create a SHA-256 hash object
  const hash = crypto.createHash('sha256');

  // Update the hash object with the phone number
  hash.update(phoneNumber);

  // Calculate the hash digest
  const hashedPhoneNumber = hash.digest('hex');

  return hashedPhoneNumber;
}
