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
    const lang = localStorage.getItem('lang') || 'en';  // fallback to English if not set

    const modifiedReq = req.clone({
      setHeaders: {
        lang: lang
      }
    });

    return next.handle(modifiedReq);
  }
}
