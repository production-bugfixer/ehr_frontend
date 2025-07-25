import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../environments/environmentAuth';
import { Observable, throwError } from 'rxjs';

interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    userType: 'DOCTOR';
    // Add other user properties as needed
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

  /**
   * Authenticate a doctor user
   * @param payload Login credentials
   * @returns Observable with login response
   */
  doctorLogin(payload: LoginPayload): Observable<any> {
    let url=this.apiUrl+environment.authEndpoints.doctor
    return this.http.post(url,payload)
  }

  /**
   * Handle HTTP errors
   * @param error HttpErrorResponse
   * @returns Error observable
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
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

  // Additional auth methods can be added below
  // For example:
  // - logout()
  // - getCurrentUser()
  // - isLoggedIn()
  // - etc.
}