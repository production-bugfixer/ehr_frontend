import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DoctorRoutingModule } from './doctor-routing.module';
import { DoctorLoginComponent } from './pages/doctor-login/doctor-login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule } from '@ngxs/store';
import { DoctorLoginState } from './states/doctor.state';
import { DoctorDashboardComponent } from './pages/doctor-dashboard/doctor-dashboard.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    DoctorLoginComponent,
    DoctorDashboardComponent
  ],
  imports: [
    CommonModule,
    DoctorRoutingModule,
    ReactiveFormsModule,
    TranslateModule,
    NgxsModule.forFeature([DoctorLoginState]),
    SharedModule
  ]
})
export class DoctorModule { }
