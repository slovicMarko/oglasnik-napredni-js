import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  url: string = 'http://localhost:5000/route';
  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { username: string; password: string }) {
    this.http
      .post<any>(`${this.url}/login`, credentials, this.httpOptions)
      .subscribe({
        next: (response) => {
          localStorage.setItem('user', JSON.stringify(response));
          this.router.navigate(['']);
        },
        error: (error) => {
          alert('Username or password is not corrent!');
        },
      });
  }

  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  register(user: any) {
    return this.http.post<any>(`${this.url}/register`, user, this.httpOptions);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('user');
  }

  getUser(): any {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    return user;
  }

  isAdmin(): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.user && user.user.admin === 1;
  }
}
