import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private readonly baseUrl: string = "http://localhost:5000/route";
  private readonly headers: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json",
  });

  constructor(private http: HttpClient, private router: Router) {}

  private get httpOptions() {
    return { headers: this.headers };
  }

  getUser(userId: number) {
    return this.http.get<any>(
      `${this.baseUrl}/users/${userId}`,
      this.httpOptions
    );
  }

  getUsers() {
    return this.http.get<any>(`${this.baseUrl}/getUsers`, this.httpOptions);
  }

  deleteUser(userId: number) {
    return this.http.delete<any>(
      `${this.baseUrl}/deleteUser/${userId}`,
      this.httpOptions
    );
  }
}
