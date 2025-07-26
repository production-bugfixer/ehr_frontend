import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HealthTechnicianRoutingModule } from './health-technician-routing.module';
import { LoginPageComponent } from './pages/login-page/login-page.component';


@NgModule({
  declarations: [
    LoginPageComponent
  ],
  imports: [
    CommonModule,
    HealthTechnicianRoutingModule
  ]
})
export class HealthTechnicianModule { }
