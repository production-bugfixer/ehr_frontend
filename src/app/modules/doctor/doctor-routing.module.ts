import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DoctorLoginComponent } from './pages/doctor-login/doctor-login.component';
import { DoctorDashboardComponent } from './pages/doctor-dashboard/doctor-dashboard.component';
import { AuthGuard } from './service/auth.guard';

const routes: Routes = [
  { path: 'login', component: DoctorLoginComponent },
  {path:'dashboard',component:DoctorDashboardComponent,canActivate:[AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DoctorRoutingModule { }
