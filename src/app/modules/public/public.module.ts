import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicRoutingModule } from './public-routing.module';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    LoginPageComponent,
    HomePageComponent
  ],
  imports: [
    CommonModule,
    PublicRoutingModule,
    TranslateModule 
  ],
  providers:[]
})
export class PublicModule { }
