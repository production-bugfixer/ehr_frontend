import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environmentAuth';
import { Observable, throwError } from 'rxjs';

interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    userType: 'DOCTOR';
  };
}

interface LoginPayload {
  userType: 'DOCTOR';
  username: string;
  email: string;
  password: string;
  phoneNumber: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = environment.baseApiUrl;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const lang = localStorage.getItem('lang') || 'en'; // Default to 'en' if not set
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'lang': lang
    });
  }

  doctorLogin(payload: LoginPayload): Observable<LoginResponse> {
    const url = this.apiUrl + environment.authEndpoints.doctor;
    return this.http.post<LoginResponse>(url, payload, {
      headers: this.getHeaders()
    });
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      if (error.status === 0) {
        errorMessage = 'Unable to connect to server';
      } else if (error.status === 401) {
        errorMessage = 'Invalid credentials';
      } else if (error.status === 403) {
        errorMessage = 'Access denied';
      } else if (error.error?.message) {
        errorMessage = error.error.message;
      } else {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }
}