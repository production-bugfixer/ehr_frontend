import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../service/AuthService';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { ComponentTranslateService } from 'src/app/translation/ComponenetTranslationService';
import { HttpClient } from '@angular/common/http';
import { LocalSessionServiceService } from 'src/app/services/local-session-service.service';
import { TokenTimerService } from 'src/app/services/token-timer.service';


@Component({
  selector: 'app-doctor-login',
  templateUrl: './doctor-login.component.html',
  styleUrls: ['./doctor-login.component.css']
})
export class DoctorLoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toaster:ToastrService,
    private translate:TranslateService,
    private cts: ComponentTranslateService,
    private http: HttpClient,
    private storage:LocalSessionServiceService,
    private tokenTimerService:TokenTimerService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
   ngOnInit(): void {
    this.cts.load('/assets/i18n/doctor/doctor-login/');
    this.translate.onLangChange.subscribe(event => {
    this.loadComponentTranslations(event.lang);
  });
  }
  loadComponentTranslations(lang: string) {
  const path = `assets/i18n/doctor/doctor-login/${lang}.json`;
    this.http.get(path).subscribe((translations: any) => {
      this.translate.setTranslation(lang, translations, true);
    });
}

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const payload = {
      userType: "DOCTOR" as const,
      username: this.loginForm.value.username as string,
      email: this.loginForm.value.username as string,
      password: this.loginForm.value.password as string,
      phoneNumber: "" as string
    };

    this.authService.doctorLogin(payload).subscribe({
      
      next: (response:any) => {
           /**
                 * {
            "status": true,
            "notificationMessage": "Login successful.",
            "message": "Login successful.",
            "errorCode": null,
            "exceptionMessage": null,
            "language": "en",
            "timestamp": "2025-07-29 22:57:03",
            "data": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkcnNtaXRoIiwiZXhwIjoxNzUzODQ2MDIzLCJpYXQiOjE3NTM4MTAwMjMsImVtYWlsIjoiYW5pbWVzaHNhbWFudGExNzExQGdtYWlsLmNvbSJ9.Aa75n90KC-Mo540hGkFl6rgMVZGidzljzL9lUAqHRro"
        }
                 */
                this.isLoading = false;
                if(response?.data?.notificationMessage && response?.data?.data){
                   this.toaster.success(response?.data?.notificationMessage);
                   localStorage.setItem("user-token",response?.data?.data);
                   localStorage.setItem("loginInfo",JSON.stringify({"token":response?.data?.data,"userType":"DOCTOR"}));
                   localStorage.setItem("tokenTime", Date.now().toString());
                   this.tokenTimerService.onLogin()
                   this.router.navigate(['/doctor/dashboard']);
                }
                
        
        
      },
      error: (error:any) => {
        if (typeof error === 'function') {
    error = error();
  }
 
        let data=error?.error;
        this.isLoading = false;
        if(data?.notificationMessage){
           this.toaster.error(data?.notificationMessage)
        }
        this.errorMessage = data?.notificationMessage || 'Login failed. Please try again.';
        let lang=localStorage.getItem("lang")||'';
    localStorage.clear();
    localStorage.setItem('lang',lang);
      }
    });
  }
  navigate(path:any){
    this.router.navigate([path]);
  }
}