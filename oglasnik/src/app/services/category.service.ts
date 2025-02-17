import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly baseUrl: string = 'http://localhost:5000/route';
  private readonly headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private http: HttpClient, private router: Router) {}

  private get httpOptions() {
    return { headers: this.headers };
  }

  getParentCategories() {
    return this.http.get<any>(
      `${this.baseUrl}/getParentCategories`,
      this.httpOptions
    );
  }

  getCategories(parentCategoryId: number) {
    return this.http.get<any>(
      `${this.baseUrl}/categories/${parentCategoryId}`,
      this.httpOptions
    );
  }
}
