import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DoctorRoutingModule } from './doctor-routing.module';
import { DoctorLoginComponent } from './pages/doctor-login/doctor-login.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    DoctorLoginComponent
  ],
  imports: [
    CommonModule,
    DoctorRoutingModule,
    ReactiveFormsModule
  ]
})
export class DoctorModule { }
