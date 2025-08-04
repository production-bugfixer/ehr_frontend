import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonPopupComponent } from './common-popup/common-popup.component';



@NgModule({
  declarations: [
    CommonPopupComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[
    CommonPopupComponent
  ]
})
export class SharedModule { }
