import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GoogleMapsService {
  private apiKey = 'AIzaSyDra36NPEehnHgpPq-8JvuoQiNkGy1yjxw';
  private apiUrl = 'https://maps.googleapis.com/maps/api/place/textsearch/json';

  constructor(private http: HttpClient) {}

  searchPlaces(query: string): Observable<any> {
    const url = `${this.apiUrl}?query=${query}&key=${this.apiKey}`;
    return this.http.get(url);
  }
}
