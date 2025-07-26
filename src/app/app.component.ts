import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  supportedLanguages = new Set([
  "en", // English
  "hi", // Hindi
  "ar", // Arabic
  "es", // Spanish
  "bn", // Bengali
  "or", // Odia
  "fr", // French
  "de", // German
  "it", // Italian
  "pt", // Portuguese
  "ru", // Russian
  "zh", // Chinese (Simplified)
  "ja", // Japanese
  "ko", // Korean
  "ta", // Tamil
  "te", // Telugu
  "ml", // Malayalam
  "gu", // Gujarati
  "mr", // Marathi
  "pa", // Punjabi
  "ur", // Urdu
  "tr", // Turkish
  "vi", // Vietnamese
  "id", // Indonesian
  "fa", // Persian
  "uk", // Ukrainian
  "pl", // Polish
  "ro", // Romanian
  "nl", // Dutch
  "th"  // Thai
]);

  selectedLanguage: any;
  title = 'Electronic Health Record';

  constructor(private translate: TranslateService) {
    // Add languages to translate service
    this.translate.addLangs(Array.from(this.supportedLanguages));
    this.translate.setDefaultLang('en');
  }

  ngOnInit(): void {
    const savedLang = localStorage.getItem('lang');
    this.selectedLanguage = savedLang && this.supportedLanguages.has(savedLang)
      ? savedLang
      : 'en';

    this.translate.use(this.selectedLanguage);
  }

  onLanguageChange() {
    if (this.supportedLanguages.has(this.selectedLanguage)) {
      localStorage.setItem('lang', this.selectedLanguage);
      this.translate.use(this.selectedLanguage);
      console.log(`Language updated to ${this.selectedLanguage}`);
    }
  }
}
