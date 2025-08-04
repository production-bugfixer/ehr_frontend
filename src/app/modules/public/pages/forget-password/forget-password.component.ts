import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ComponentTranslateService } from 'src/app/translation/ComponenetTranslationService';
import { CommonApiCallerService } from '../../common-api-caller.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { switchMap, catchError, tap, filter } from 'rxjs/operators';
import { of, Subject } from 'rxjs';
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
  private requestOtp$ = new Subject<void>();
  private resetPassword$ = new Subject<void>();
requestId:any='';
  constructor(
    private router: Router,
    private translate: TranslateService,
    private cts: ComponentTranslateService,
    private http: HttpClient,
    private fb: FormBuilder,
    private httpApi: CommonApiCallerService,
    private toaster:ToastrService
  ) {
    this.forgotPasswordForm = this.fb.group(
      {
        ehrId: ['', [Validators.required, Validators.email]],
        verificationMethod: ['email'],
        otp: [''],
        newPassword: [''],
        confirmPassword: ['']
      },
      { validators: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    this.loadTranslations();
    this.translate.onLangChange.subscribe(() => this.loadTranslations());
     this.requestOtp$
      .pipe(
        filter(() => this.forgotPasswordForm.valid),
        switchMap(() =>
          this.httpApi.triggerVerification(this.forgotPasswordForm.value).pipe(
            tap((res:any) => {
               this.verificationSent = true;
          this.showResetFields = true;
              this.requestId = res?.requestId || '';
            }),
            catchError(err => {
              this.errorMessage = 'OTP sending failed';
              return of(null);
            })
          )
        )
      )
      .subscribe();

    // ✅ Handle Password Reset
    this.resetPassword$
      .pipe(
        filter(() => this.forgotPasswordForm.valid),
        switchMap(() =>
          this.httpApi.resetPassword(this.forgotPasswordForm.value).pipe(
            tap(() => {
              this.showResetFields = false;
              this.errorMessage = '';
              alert('Password reset successful');
            }),
            catchError(err => {
              this.errorMessage = 'Reset failed';
              return of(null);
            })
          )
        )
      )
      .subscribe();
  }

  private loadTranslations(): void {
    const lang = localStorage.getItem('lang') || 'en';
    const path = `assets/i18n/public/forget-password/${lang}.json`;
    this.http.get(path).subscribe((translations: any) => {
      this.translate.setTranslation(lang, translations, true);
    });
  }

  private passwordMatchValidator(group: AbstractControl): { [key: string]: any } | null {
    const password = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onVerificationMethodChange(method: 'email' | 'phone'): void {
    this.verificationMethod = method;
    this.forgotPasswordForm.patchValue({ verificationMethod: method });
  }
 requestOTP(): void {
    this.requestOtp$.next();
  }
  requestOTP1(): void {
    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const payload = {
      ehrId: this.forgotPasswordForm.get('ehrId')?.value,
      verificationMethod: this.verificationMethod,
      phone: ''
    };

    this.httpApi.triggerVerification(payload).subscribe(
      (res: any) => {
        this.loading = false;
        this.requestId=''
        if (res?.requestId) {
          this.verificationSent = true;
          this.showResetFields = true;
          this.requestId=res?.requestId
        } else {
          this.errorMessage = this.translate.instant('ERROR.NO_REQUEST_ID');
        }
      },
      (error:any) => {
        this.loading = false;
        this.errorMessage = this.translate.instant('ERROR.SENDING_OTP');
        console.error('OTP request error:', error);
      }
    );
  }

 resetPassword(): void {
  if (this.forgotPasswordForm.invalid || this.forgotPasswordForm.errors?.['mismatch']) {
    this.forgotPasswordForm.markAllAsTouched();
    return;
  }

  this.loading = true;
  this.errorMessage = '';

  const payload = {
    requestId: this.requestId,
    otp: this.forgotPasswordForm.get('otp')?.value,
    newPassword: this.forgotPasswordForm.get('newPassword')?.value
  };

  this.httpApi.resetPassword(payload).subscribe(
    (res: any) => {
      this.loading = false;
      // Success handling: You can show a success message or navigate
      //alert(this.translate.instant('FORGET_PASSWORD.PASSWORD_RESET_SUCCESS'));
      this.toaster.success(this.translate.instant('FORGET_PASSWORD.PASSWORD_RESET_SUCCESS'))
    },
    (error: any) => {
      this.loading = false;
      this.errorMessage = this.translate.instant('ERROR.RESETTING_PASSWORD');
      console.error('Password reset error:', error);
    }
  );
}
}
