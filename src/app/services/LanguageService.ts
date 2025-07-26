// src/app/services/language.service.ts
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly supportedLanguages = new Set(["en", "hi", "ar", "es", "bn", "or"]);
  private readonly defaultLanguage = 'en';

  constructor(private translate: TranslateService) {}

  setLanguage(lang: string): boolean {
    if (this.supportedLanguages.has(lang)) {
      this.translate.use(lang);
      localStorage.setItem('userLanguage', lang);
      return true;
    }
    return false;
  }

  getCurrentLanguage(): string {
    const savedLang:any = localStorage.getItem('userLanguage');
    return this.supportedLanguages.has(savedLang) ? savedLang : this.defaultLanguage;
  }

  getAvailableLanguages(): string[] {
    return Array.from(this.supportedLanguages);
  }

  getLanguageName(lang: string): string {
    const languageNames:any = {
      en: 'English',
      hi: 'हिन्दी',
      ar: 'العربية',
      es: 'Español',
      bn: 'বাংলা',
      or: 'ଓଡ଼ିଆ'
    };
    return languageNames[lang] || lang;
  }
}