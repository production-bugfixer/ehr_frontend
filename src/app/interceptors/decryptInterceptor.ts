import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { decryptFields } from './RecCrypt';

@Injectable()
export class DecryptInterceptor implements HttpInterceptor {

  private excludedUrlPatterns: RegExp[] = [
    /\/assets\//     
  ];

  private shouldSkip(url: string): boolean {
    try {
      const parsedUrl = new URL(url, window.location.origin);
      const path = parsedUrl.pathname;
      return this.excludedUrlPatterns.some(pattern => pattern.test(path));
    } catch (e) {
      return this.excludedUrlPatterns.some(pattern => pattern.test(url));
    }
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.shouldSkip(req.url)) {
      return next.handle(req);
    }

    console.log("Decryption working");

    return next.handle(req).pipe(
      map(event => {
        if (event instanceof HttpResponse && event.body) {
          const decrypted = decryptFields(event.body);
          return event.clone({ body: decrypted });
        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        try {
          if (typeof error.error.data === 'string') {
            const decrypted = decryptFields(error.error.data);
            const parsed = typeof decrypted === 'string' ? JSON.parse(decrypted) : decrypted;
            const transformedError = new HttpErrorResponse({
              error: parsed,
              headers: error.headers,
              status: error.status,
              statusText: error.statusText,
              url: error.url ?? undefined,
            });
            return throwError(() => transformedError);
          }
        } catch (e) {
          console.warn("Failed to decrypt error response:", e);
        }
        return throwError(() => error);
      })
    );
  }
}
