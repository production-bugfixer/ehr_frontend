import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ComponentTranslateService } from 'src/app/translation/ComponenetTranslationService';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
hoveredRole:any;
  modules = [
  { labelKey: 'DOCTOR', path: '/doctor/login' },
  { labelKey: 'NURSING', path: '/nursing/login' },
  { labelKey: 'PATIENT', path: '/patient/login' },
  { labelKey: 'PHARMACY', path: '/pharmacy/login' },
  { labelKey: 'ADMINISTRATION', path: '/administration/login' },
  { labelKey: 'HEALTH_TECHNICIAN', path: '/health-technician/login' },
  { labelKey: 'PATHOLOGY', path: '/pathology/login' }
];

  constructor(private router: Router,private traslate:TranslateService,private cts: ComponentTranslateService,private http: HttpClient) {
   
  }


  ngOnInit(): void {
    this.cts.load('/assets/i18n/public/pages/login-page/');
     let lang:any=localStorage.getItem("lang");
  const path = `assets/i18n/public/login-page/${lang}.json`;
    this.http.get(path).subscribe((translations: any) => {
      this.traslate.setTranslation(lang, translations, true);
    });
    this.traslate.onLangChange.subscribe(event => {
    this.loadComponentTranslations();
  });
  }
  loadComponentTranslations() {
    let lang:any=localStorage.getItem("lang");
  const path = `assets/i18n/public/login-page/${lang}.json`;
    this.http.get(path).subscribe((translations: any) => {
      this.traslate.setTranslation(lang, translations, true);
    });
}

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
  onHover(labelKey: string) {
    this.traslate.get(labelKey).subscribe(translated => {
      this.hoveredRole = translated;
    });
  }

  clearHover() {
    this.hoveredRole = '';
  }

}
