import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicRoutingModule } from './public-routing.module';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { TranslateModule } from '@ngx-translate/core';
import { ForgetPasswordComponent } from './pages/forget-password/forget-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonApiCallerService } from './common-api-caller.service';

@NgModule({
  declarations: [
    LoginPageComponent,
    HomePageComponent,
    ForgetPasswordComponent,
    ResetPasswordComponent
  ],
  imports: [
    CommonModule,
    PublicRoutingModule,
    TranslateModule ,
    ReactiveFormsModule
  ],
  providers:[CommonApiCallerService]
})
export class PublicModule { }
