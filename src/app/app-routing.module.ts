import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
 { path: 'public', loadChildren: () => import('./modules/public/public.module').then(m => m.PublicModule) },
  { path: 'doctor', loadChildren: () => import('./modules/doctor/doctor.module').then(m => m.DoctorModule), canActivate: [AuthGuard] },
  { path: 'nursing', loadChildren: () => import('./modules/nursing/nursing.module').then(m => m.NursingModule), canActivate: [AuthGuard] },
  { path: 'patient', loadChildren: () => import('./modules/patient/patient.module').then(m => m.PatientModule), canActivate: [AuthGuard] },
  { path: 'administration', loadChildren: () => import('./modules/administration/administration.module').then(m => m.AdministrationModule), canActivate: [AuthGuard] },
  { path: 'pharmacy', loadChildren: () => import('./modules/pharmacy/pharmacy.module').then(m => m.PharmacyModule), canActivate: [AuthGuard] },
  { path: 'health-technician', loadChildren: () => import('./modules/health-technician/health-technician.module').then(m => m.HealthTechnicianModule), canActivate: [AuthGuard] },
  { path: 'pathology', loadChildren: () => import('./modules/pathology/pathology.module').then(m => m.PathologyModule), canActivate: [AuthGuard] },
  { path: '', redirectTo: 'public', pathMatch: 'full' },
  { path: '**', redirectTo: 'public' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
