import { encrypt, decrypt } from './AESCrypt';
import * as CryptoJS from 'crypto-js';

const SECRET_KEY = CryptoJS.enc.Utf8.parse('1234567890123456'); // 16-byte key
const IV = CryptoJS.enc.Utf8.parse('6543210987654321');         // 16-byte IV

export function encryptJSON(value: string): string {
  const encrypted = CryptoJS.AES.encrypt(value, SECRET_KEY, {
    iv: IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });

  return encrypted.toString(); // Base64-encoded
}

export function encryptFields(obj: any): any {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === 'boolean') return obj;

  if (typeof obj === 'string' || typeof obj === 'number') {
    return encrypt(obj.toString());
  }

  if (Array.isArray(obj)) {
    return obj.map(item => encryptFields(item));
  }

  if (typeof obj === 'object') {
    const result: any = {};
    for (const key of Object.keys(obj)) {
      result[key] = encryptFields(obj[key]);
    }
    return result;
  }

  return obj;
}

export function decryptFields(obj: any): any {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === 'boolean') return obj;

  if (typeof obj === 'string') {
    return decrypt(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map(item => decryptFields(item));
  }

  if (typeof obj === 'object') {
    const result: any = {};
    for (const key of Object.keys(obj)) {
      result[key] = decryptFields(obj[key]);
    }
    return result;
  }

  return obj;
}
