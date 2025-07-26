import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NursingRoutingModule } from './nursing-routing.module';
import { LoginPageComponent } from './pages/login-page/login-page.component';


@NgModule({
  declarations: [
    LoginPageComponent
  ],
  imports: [
    CommonModule,
    NursingRoutingModule
  ]
})
export class NursingModule { }
