import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  supportedLanguages = new Set(["en", "hi", "ar", "es", "bn", "or"]);
  selectedLanguage: string = 'en';
  title = 'EHRwebView';

  ngOnInit(): void {
    // Load language from localStorage or set default
    const savedLang = localStorage.getItem('lang');
    this.selectedLanguage = savedLang && this.supportedLanguages.has(savedLang) 
      ? savedLang 
      : 'en';
  }

  onLanguageChange() {
    if (this.supportedLanguages.has(this.selectedLanguage)) {
      localStorage.setItem('lang', this.selectedLanguage);
      console.log(`Language updated to ${this.selectedLanguage}`);
      // Add any language change logic here
    }
  }
}