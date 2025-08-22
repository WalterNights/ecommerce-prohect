import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, BehaviorSubject, Observable, throwError } from 'rxjs';
import { environment } from '../../../environment/environment';
import { StorageMethodComponent } from '../../utils/storage-method/storage-method';

interface RegisterData {
  username: string;
  email: string;
  password: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth/register';
  private isLoggedInSubject = new BehaviorSubject<boolean>(!!this.getToken());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  StorageKey = [
    'access_token',
    'refresh_token',
    'storage',
    'user',
    'user_id',
    'user_name',
  ];

  constructor(private http: HttpClient, private storageMethod: StorageMethodComponent) { }

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    const storageType = localStorage.getItem("storage") === 'true' ? 'local' : 'session';
    return storageType === 'local'
      ? localStorage.getItem('access_token')
      : sessionStorage.getItem('access_token');
  }
  

  syncAuthStatus(): void {
    this.isLoggedInSubject.next(!!this.getToken());
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  register(data: RegisterData): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  login(credentials: { username: string, password: string }) {
    return this.http.post(`${environment.apiUrl}/auth/login/`, credentials).pipe(
      tap((res: any) => {
        const storageType = localStorage.getItem('storage') === 'true' ? 'local' : 'session';
        this.storageMethod.setStorageItem(storageType, 'access_token', res.token)
        this.storageMethod.setStorageItem(storageType, 'refresh_token', res.refresh)
        sessionStorage.setItem('user_email', res.email);
        this.isLoggedInSubject.next(true);
      })
    );
  }

  logout(): void {
    sessionStorage.clear();
    this.StorageKey.forEach(key => {
      localStorage.removeItem(key);
    });
    this.isLoggedInSubject.next(false);
  }

  refreshToken(): Observable<any> {
    if (typeof window === 'undefined') return throwError(() => new Error('No browser storage available'));

    const storageType = localStorage.getItem("storage") === 'true' ? 'local' : 'session';
    const refresh = this.storageMethod.getStorageItem(storageType, 'refresh_token');
    console.log('Refresh token enviado:', refresh);
    if (!refresh) {
      return throwError(() => new Error('Refresh token missing'));
    }
    return this.http.post(`${environment.apiUrl}/auth/token/refresh`, { refresh }).pipe(
      tap((res: any) => {
        this.storageMethod.setStorageItem(storageType, 'access_token', res.token)
        this.isLoggedInSubject.next(true);
      })
    )
  }
}