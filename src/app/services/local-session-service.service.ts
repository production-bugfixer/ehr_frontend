import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalSessionServiceService {

  private secretKey = '9zX!vB@6Q#tW2pL@'; // You can replace with env var

  constructor() {}

  private xorEncrypt(text: string): string {
    let result = '';
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(
        text.charCodeAt(i) ^ this.secretKey.charCodeAt(i % this.secretKey.length)
      );
    }
    return btoa(result); // base64 encode the result
  }

  private xorDecrypt(encoded: string): string {
    const decoded = atob(encoded); // base64 decode
    let result = '';
    for (let i = 0; i < decoded.length; i++) {
      result += String.fromCharCode(
        decoded.charCodeAt(i) ^ this.secretKey.charCodeAt(i % this.secretKey.length)
      );
    }
    return result;
  }

  public setItem(key: string, value: string): void {
    const encryptedValue = this.xorEncrypt(value);
    localStorage.setItem(key, encryptedValue);
  }

  public getItem(key: string): string | null {
    const encryptedValue = localStorage.getItem(key);
    if (!encryptedValue) return null;

    try {
      return this.xorDecrypt(encryptedValue);
    } catch (error) {
      console.error('Decryption failed:', error);
      return null;
    }
  }

  public removeLocalSession(key: string): void {
    localStorage.removeItem(key);
  }

  public clearAllSession(): void {
   let lang=localStorage.getItem("lang")||'';
    localStorage.clear();
    localStorage.setItem('lang',lang);
  }
}
