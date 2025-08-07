// src/app/interceptors/language.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable()
export class LanguageInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip if already has lang header
    if (req.headers.has('lang')) {
      return next.handle(req);
    }

    const lang = localStorage.getItem('lang') || 'en';
    return next.handle(req.clone({
      setHeaders: { lang }
    }));
  }
}