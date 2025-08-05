import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TokenTimerService, PopupData } from './services/token-timer.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  supportedLanguages = new Set([
    "en", "hi", "ar", "es", "bn", "or", "fr", "de", "it", "pt", "ru", "zh", "ja", "ko",
    "ta", "te", "ml", "gu", "mr", "pa", "ur", "tr", "vi", "id", "fa", "uk", "pl", "ro", "nl", "th"
  ]);

  selectedLanguage: any;
  title = 'Electronic Health Record';

 
  popupVisible = false;
  popupType = 'info';
  popupTitle = '';
  popupMessage = '';

  constructor(
    private translate: TranslateService,
    public timer: TokenTimerService,
  ) {
    console.log('[AppComponent] Constructor called');
    this.translate.addLangs(Array.from(this.supportedLanguages));
    this.translate.setDefaultLang('en');
  }

  ngOnInit(): void {
    const savedLang = localStorage.getItem('lang');
    this.selectedLanguage = savedLang && this.supportedLanguages.has(savedLang) ? savedLang : 'en';
    this.translate.use(this.selectedLanguage);
    console.log(`[AppComponent] Initialized with language: ${this.selectedLanguage}`);

    
    this.timer.popupState$.subscribe((data: PopupData) => {
      console.log('[AppComponent] Popup trigger received from TokenTimerService:', data);
      
      this.popupType = data.type;
      this.popupTitle = data.title;
      this.popupMessage = data.message;
      this.popupVisible = data.show;
     
    });
  }

  onLanguageChange() {
    if (this.supportedLanguages.has(this.selectedLanguage)) {
      localStorage.setItem('lang', this.selectedLanguage);
      this.translate.use(this.selectedLanguage);
      console.log(`[AppComponent] Language changed to: ${this.selectedLanguage}`);
    } else {
      console.warn(`[AppComponent] Unsupported language selected: ${this.selectedLanguage}`);
    }
  }

 
  onPopupConfirm() {
    console.log('[AppComponent] Popup confirmed (OK clicked). Resetting session timer.');
    this.popupVisible = false;
    this.timer.confirmContinueSession() 
  }

  onPopupCancel() {
    console.log('[AppComponent] Popup cancelled or closed.');
    this.timer.closePopup()
    this.popupVisible = false;
  }
}
