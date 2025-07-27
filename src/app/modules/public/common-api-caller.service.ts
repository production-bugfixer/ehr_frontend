import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { environment } from 'src/environments/environmentAuth';

@Injectable({
  providedIn: 'root'
})
export class CommonApiCallerService {
  private readonly apiUrl = environment.baseApiUrl;
  constructor(private http: HttpClient) {}
private getHeaders(): HttpHeaders {
    const lang = localStorage.getItem('lang') || 'en'; // Default to 'en' if not set
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'lang': lang
    });
  }
  triggerVerification(payLoad:any):any {
     const url = this.apiUrl + environment.public.forgetPasswordVerification
     return this.http.post<any>(url, payLoad, {
      headers: this.getHeaders()
    });
  }
  resetPassword(payLoad:any):any{
    const url = this.apiUrl + environment.public.reset
     return this.http.post<any>(url, payLoad, {
      headers: this.getHeaders()
    });
  }
}
