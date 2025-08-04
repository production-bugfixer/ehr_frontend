import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { ToastrModule } from 'ngx-toastr';

import { TranslateModule } from '@ngx-translate/core';
import { LanguageInterceptor } from './interceptors/language.interceptor';
import { EncryptInterceptor } from './interceptors/encryptInterceptor';
import { DecryptInterceptor } from './interceptors/decryptInterceptor';
import { NgxsModule } from '@ngxs/store';
import { HeaderInterceptorInterceptor } from './interceptors/header-interceptor.interceptor';
import { SharedModule } from './shared/shared.module';



@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule, // Required for Toastr
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    TranslateModule.forRoot(),
    NgxsModule.forRoot([]),SharedModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LanguageInterceptor,
      multi: true,
    },
     { provide: HTTP_INTERCEPTORS, useClass: EncryptInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: DecryptInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HeaderInterceptorInterceptor,
      multi: true
    }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
