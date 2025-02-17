import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  private readonly baseUrl: string = 'http://localhost:5000/route';
  private readonly headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private http: HttpClient, private router: Router) {}

  private get httpOptions() {
    return { headers: this.headers };
  }

  getRegions() {
    return this.http.get<any>(`${this.baseUrl}/getRegions`, this.httpOptions);
  }

  getCities(regionId: number) {
    return this.http.get<any>(
      `${this.baseUrl}/getCities/${regionId}`,
      this.httpOptions
    );
  }
}
