// RecCrypt.ts
import * as CryptoJS from 'crypto-js';

const SECRET_KEY = CryptoJS.enc.Utf8.parse('1234567890123456');
const IV = CryptoJS.enc.Utf8.parse('6543210987654321');

export function decryptJSON(encrypted: string): any {
  const decrypted = CryptoJS.AES.decrypt(encrypted, SECRET_KEY, {
    iv: IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });

  const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
  return JSON.parse(decryptedText);
}
