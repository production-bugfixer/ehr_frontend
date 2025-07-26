import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../service/AuthService';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { ComponentTranslateService } from 'src/app/translation/ComponenetTranslationService';
import { HttpClient } from '@angular/common/http';


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
    private translate:TranslateService,private cts: ComponentTranslateService,private http: HttpClient
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
        this.isLoading = false;
        this.toaster.success(response?.toasterMessage)
      },
      error: (error:any) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Login failed. Please try again.';
      }
    });
  }
}