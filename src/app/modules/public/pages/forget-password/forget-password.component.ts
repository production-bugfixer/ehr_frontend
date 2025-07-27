import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ComponentTranslateService } from 'src/app/translation/ComponenetTranslationService';
import { CommonApiCallerService } from '../../common-api-caller.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  verificationMethod: 'email' | 'phone' = 'email';
  verificationSent = false;
  loading = false;
  errorMessage = '';
  showResetFields = false;

  constructor(
    private router: Router,
    private translate: TranslateService,
    private cts: ComponentTranslateService,
    private http: HttpClient,
    private fb: FormBuilder,
    private httpApi:CommonApiCallerService
  ) {
    this.forgotPasswordForm = this.fb.group({
      ehrId: ['', [Validators.required, Validators.email]],
      verificationMethod: ['email'],
      otp: [''],
      newPassword: ['',],
      confirmPassword: ['',]
    }, { validator: this.passwordMatchValidator });

  
  }

  ngOnInit(): void {
    this.cts.load('/assets/i18n/public/forget-password/');
    let lang: any = localStorage.getItem("lang");
    const path = `assets/i18n/public/forget-password/${lang}.json`;
    this.http.get(path).subscribe((translations: any) => {
      this.translate.setTranslation(lang, translations, true);
    });
    this.translate.onLangChange.subscribe(event => {
      this.loadComponentTranslations();
    });
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('newPassword')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  loadComponentTranslations() {
    let lang: any = localStorage.getItem("lang");
    const path = `assets/i18n/public/forget-password/${lang}.json`;
    this.http.get(path).subscribe((translations: any) => {
      this.translate.setTranslation(lang, translations, true);
    });
  }

  

  onVerificationMethodChange(method: 'email' | 'phone') {
    this.verificationMethod = method;
    this.forgotPasswordForm.patchValue({ verificationMethod: method });
  }

  requestOTP() {
    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }

      this.loading = true;
    this.errorMessage = '';
let payLoad={
  ehrId:this.forgotPasswordForm.get("ehrId")?.value,
  verificationMethod:this.forgotPasswordForm.get("verificationMethod")?.value,
  phone:""
}
this.httpApi.triggerVerification(payLoad).subscribe();

  }

  resetPassword() {
    if (this.forgotPasswordForm.invalid || this.forgotPasswordForm.errors?.mismatch) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }

  
  }
}