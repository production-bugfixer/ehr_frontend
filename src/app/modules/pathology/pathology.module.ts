import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PathologyRoutingModule } from './pathology-routing.module';
import { LoginPageComponent } from './pages/login-page/login-page.component';


@NgModule({
  declarations: [
    LoginPageComponent
  ],
  imports: [
    CommonModule,
    PathologyRoutingModule
  ]
})
export class PathologyModule { }
