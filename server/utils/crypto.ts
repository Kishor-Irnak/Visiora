import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

// Validate key exists
if (!ENCRYPTION_KEY) {
  console.error('ENCRYPTION_KEY environment variable is not set.');
  throw new Error('ENCRYPTION_KEY environment variable must be set in .env file.');
}

// Validate key length for AES-256 (32 bytes = 64 hex characters)
if (ENCRYPTION_KEY.length !== 64) {
  console.error(`Invalid encryption key length: ${ENCRYPTION_KEY.length} characters. Expected 64 characters for AES-256.`);
  console.error(`Current key: "${ENCRYPTION_KEY}"`);
  throw new Error('Invalid encryption key length. Must be exactly 64 hex characters for AES-256.');
}

const KEY = ENCRYPTION_KEY;
const IV_LENGTH = 16; // For AES, this is always 16

export const encrypt = (text: string): string => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(KEY, 'hex'), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
};

export const decrypt = (text: string): string => {
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift() || '', 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(KEY, 'hex'), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};