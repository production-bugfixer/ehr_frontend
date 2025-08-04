import { Injectable, NgZone } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environmentAuth';

export interface PopupData {
  show: boolean;
  type: 'success' | 'warning' | 'info' | 'confirm';
  title: string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class TokenTimerService {
  private readonly apiUrl = environment.baseApiUrl;
  private readonly CHECK_INTERVAL = 60 * 1000;
  private readonly EXPIRY_TIME = 10 * 60 * 1000;
  private readonly IDLE_TIMEOUT = 2 * 60 * 1000;
  private readonly WARNING_DURATION = 1 * 60 * 1000;

  private toastId: number | null = null;
  private lastActivityTime = Date.now();
  private tokenMonitorInterval: any = null;
  private idleCheckInterval: any = null;
  private sessionInterval: any = null;

  private warningShown = false;
  private hasShownPopup = false;
  private activityListenersAttached = false;

  popupState$ = new BehaviorSubject<PopupData>({
    show: false,
    type: 'info',
    title: '',
    message: ''
  });

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService,
    private translate: TranslateService,
    private zone: NgZone
  ) {
    console.log('[TokenTimerService] Constructor called.');
    this.initNetworkListeners();
    if (this.isUserLoggedIn()) {
      console.log('[TokenTimerService] User is logged in. Starting monitoring.');
      this.startMonitoring();
    }
  }

  public onLogin(): void {
    console.log('[TokenTimerService] onLogin called.');
    if (!this.tokenMonitorInterval && this.isUserLoggedIn()) {
      this.startMonitoring();
    }
  }

  public onLogout(): void {
    console.log('[TokenTimerService] onLogout called.');
    this.stopMonitoring();
  }

  private isUserLoggedIn(): boolean {
    const status = !!localStorage.getItem('user-token');
    console.log(`[TokenTimerService] isUserLoggedIn: ${status}`);
    return status;
  }

  private startMonitoring(): void {
    console.log('[TokenTimerService] Starting monitoring.');
    this.lastActivityTime = Date.now();
    this.warningShown = false;

    this.zone.run(() => {
      this.startTokenMonitor();
      this.startIdleMonitor();
    });

    this.initActivityListeners();
  }

  private stopMonitoring(): void {
    console.log('[TokenTimerService] Stopping all monitoring.');
    clearInterval(this.tokenMonitorInterval);
    clearInterval(this.idleCheckInterval);
    clearInterval(this.sessionInterval);

    this.tokenMonitorInterval = null;
    this.idleCheckInterval = null;
    this.sessionInterval = null;

    this.removeActivityListeners();
    this.warningShown = false;
    this.hasShownPopup = false;

    this.popupState$.next({
      show: false,
      type: 'info',
      title: '',
      message: ''
    });
  }

  private initActivityListeners(): void {
    if (this.activityListenersAttached) return;
    const events = ['mousemove', 'keydown', 'click', 'scroll'];
    events.forEach(event => window.addEventListener(event, this.resetActivity, true));
    this.activityListenersAttached = true;
    console.log('[TokenTimerService] Activity listeners attached.');
  }

  private removeActivityListeners(): void {
    const events = ['mousemove', 'keydown', 'click', 'scroll'];
    events.forEach(event => window.removeEventListener(event, this.resetActivity, true));
    this.activityListenersAttached = false;
    console.log('[TokenTimerService] Activity listeners removed.');
  }

  private resetActivity = (): void => {
  const popup = this.popupState$.getValue();
  this.warningShown=false
  if (!popup.show) {
    this.lastActivityTime = Date.now();
    localStorage.setItem('tokenTime', this.lastActivityTime.toString());
    console.log('[TokenTimerService] Activity detected. Timers reset.');
  } else {
    console.log('[TokenTimerService] Popup is active. Ignoring activity.');
  }
};


  private startIdleMonitor(): void {
    clearInterval(this.idleCheckInterval);
    this.idleCheckInterval = setInterval(() => {
      const idleTime = Date.now() - this.lastActivityTime;
      console.log(`[IdleMonitor] Idle Time: ${idleTime}`);

      if (idleTime >= this.IDLE_TIMEOUT) {
        console.warn('[IdleMonitor] Idle timeout reached. Logging out.');
        this.popupState$.next({ show: false, type: 'info', title: '', message: '' });
        this.handleUnauthorized();
      } else if (idleTime >= this.IDLE_TIMEOUT - this.WARNING_DURATION && !this.warningShown) {
        this.warningShown = true;
        this.popupState$.next({
          show: true,
          type: 'warning',
          title: this.translate.instant('POPUP.SESSION_TITLE'),
          message: this.translate.instant('POPUP.SESSION_WARNING')
        });
        console.log('[IdleMonitor] Warning popup shown.');
      }
    }, 10000);
  }

  private startTokenMonitor(): void {
    clearInterval(this.tokenMonitorInterval);
    this.tokenMonitorInterval = setInterval(() => {
      this.verifyAuthorization()
    }, this.CHECK_INTERVAL);
  }

  public confirmContinueSession(): void {
    console.log('[Session] User confirmed to continue.');
    this.lastActivityTime = Date.now();
    this.warningShown = false;
    this.popupState$.next({ show: false, type: 'info', title: '', message: '' });
    this.verifyAuthorization();
  }

  public verifyAuthorization(): void {
    const token = localStorage.getItem('user-token');
    if (!navigator.onLine || !token) {
      console.error('[Authorization] No internet or missing token.');
      return this.handleUnauthorized();
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      Lang: localStorage.getItem('lang') || 'en'
    });

    const url = this.apiUrl + environment.authEndpoints.authorization;
    this.http.get(url, { headers }).subscribe({
      next: (res: any) => {
        const data = JSON.parse(res?.data);
        localStorage.setItem('user-token', data?.data);
        localStorage.setItem('tokenTime', Date.now().toString());
        console.log('[Authorization] Token refreshed.');
      },
      error: err => {
        console.error('[Authorization] Token verification failed.', err);
        this.handleUnauthorized();
      }
    });
  }

  public handleUnauthorized(): void {
    console.warn('[Session] Unauthorized. Logging out.');
    this.stopMonitoring();
    const lang = localStorage.getItem('lang') || 'en';
    localStorage.clear();
    localStorage.setItem('lang', lang);
    this.translate.get('TOAST.SESSION_EXPIRED').subscribe(msg => this.toastr.warning(msg));
    this.router.navigate(['/login']);
  }

  private initNetworkListeners(): void {
    window.addEventListener('offline', () => this.showOfflineToast());
    window.addEventListener('online', () => this.clearOfflineToast());
  }

  private showOfflineToast(): void {
    if (this.toastId !== null) return;
    const title = this.translate.instant('TOAST.OFFLINE_TITLE');
    const message = this.translate.instant('TOAST.OFFLINE_MESSAGE');
    const toast = this.toastr.warning(message, title, {
      disableTimeOut: true,
      closeButton: false,
      tapToDismiss: false,
      positionClass: 'toast-bottom-center'
    });
    this.toastId = toast.toastId;
  }

  private clearOfflineToast(): void {
    if (this.toastId !== null) {
      this.toastr.clear(this.toastId);
      this.toastId = null;
      this.translate.get('TOAST.BACK_ONLINE').subscribe(msg => this.toastr.success(msg));
    }
  }
  public closePopup(){
    this.popupState$.next({
      show: false,
      type: 'info',
      title: '',
      message: ''
    });
    this.resetActivity()
  }
}
