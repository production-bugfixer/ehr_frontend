import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ToastRef, ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private toaster:ToastrService){}
  canActivate(
   ){
    let stringObjs:any=localStorage.getItem("loginInfo");
    let loginInfo:any=JSON.parse(stringObjs);
    if (loginInfo?.userType=="DOCTOR") {
      return true;
    }
    this.toaster.warning("This resource is only restriced to Doctors only")
    let lang=localStorage.getItem("lang")||'';
    localStorage.clear();
    localStorage.setItem('lang',lang);
    return false;
  
  }
  
}
