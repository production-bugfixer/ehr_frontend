import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ComponentTranslateService {
  constructor(private translate: TranslateService, private http: HttpClient) {}

  load(path: string): void {
    const lang = this.translate.currentLang || this.translate.defaultLang || 'en';
    const filePath = `${path}/${lang}.json`;

    this.http.get(filePath).subscribe({
      next: (translations: any) => {
        this.translate.setTranslation(lang, translations, true);
      },
      error: (err) => {
        console.warn(`[i18n] Failed to load translation: ${filePath}`, err);
      }
    });
  }
}