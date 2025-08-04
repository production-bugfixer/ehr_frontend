import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpHandler, HttpInterceptor, HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { encryptJSON } from './RecCrypt'; // Use full object encrypt method

@Injectable()
export class EncryptInterceptor implements HttpInterceptor {
  private excludedUrlPatterns: RegExp[] = [
    /\/assets\//     
  ];

 private shouldSkip(url: string): boolean {
  try {
    // If relative URL, resolve it using window.location.origin
    const parsedUrl = new URL(url, window.location.origin);
    const path = parsedUrl.pathname; // extract path
    return this.excludedUrlPatterns.some(pattern => pattern.test(path));
  } catch (e) {
    // Fallback in case parsing fails
    return this.excludedUrlPatterns.some(pattern => pattern.test(url));
  }
}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.shouldSkip(req.url)) {
      return next.handle(req); // ✅ Skip encryption
    }
console.log("Encryption working")
    if (req.body) {
      // Step 1: Convert body to string
      const jsonString = JSON.stringify(req.body);

      // Step 2: Encrypt full JSON string using AES (with Base64 inside)
      const encryptedString = encryptJSON(jsonString); // <-- your encrypt() function must return Base64

      // Step 3: Wrap in { data: encrypted }
      const wrappedEncryptedBody = { data: encryptedString };

      // Step 4: Clone request with new body
      const clonedRequest = req.clone({ body: wrappedEncryptedBody });

      return next.handle(clonedRequest);
    }

    return next.handle(req);
  }
}
