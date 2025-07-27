import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { LocalSessionServiceService } from '../services/local-session-service.service';
import { Router as NgRouter } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: NgRouter,
    private localSession: LocalSessionServiceService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    const token = this.localSession.getItem('access_token');
    const userType = this.localSession.getItem('userType');
    const requestedUrl = state.url; // e.g., /doctor/dashboard

    const requestedModule = requestedUrl.split('/')[1]?.toLowerCase();
    const isLoginPage = requestedUrl.endsWith('/login')||requestedUrl.endsWith('/forget-password');

    // ✅ Allow all module login pages without authentication
    if (isLoginPage) {
      return true;
    }

    // 🔒 If token or userType is missing, send to /public
    if (!token || !userType) {
      return this.router.parseUrl('/public');
    }

    // ✅ If userType matches requested module, allow
    if (userType.toLowerCase() === requestedModule) {
      return true;
    }

    // 🔄 Else redirect to correct module's login
    return this.router.parseUrl(`/${userType.toLowerCase()}/login`);
  }
}
