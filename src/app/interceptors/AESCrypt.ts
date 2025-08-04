import * as CryptoJS from 'crypto-js';

const SECRET_KEY = CryptoJS.enc.Utf8.parse('1234567890123456');
const IV = CryptoJS.enc.Utf8.parse('6543210987654321');

export function encrypt(value: string): string {
  const encrypted = CryptoJS.AES.encrypt(value, SECRET_KEY, {
    iv: IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.toString();
}

export function decrypt(text: string): string {
  try {
    const decrypted = CryptoJS.AES.decrypt(text, SECRET_KEY, {
      iv: IV,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch {
    return text;
  }
}
