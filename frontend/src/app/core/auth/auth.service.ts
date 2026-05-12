import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, map, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8080/api';
  private currentUser = new BehaviorSubject<any>(null);
  currentUser$ = this.currentUser.asObservable();
  isLoggedIn$ = this.currentUser$.pipe(
    map(user => !!user)
  );

  constructor(private http: HttpClient, private router: Router) { }

  // Redirects browser to Spring Boot → Google
  login() {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  }

  // Fetch logged-in user from Spring Boot session
  fetchCurrentUser() {
    return this.http.get(`${this.apiUrl}/me`, { withCredentials: true }).pipe(
      tap((user) => { console.log(user), this.currentUser.next(user) })
    );
  }

  logout() {
    this.http.post('http://localhost:8080/logout', {}, { withCredentials: true })
      .subscribe(() => {
        this.currentUser.next(null);
        this.router.navigate(['/login']);
      });
  }
}