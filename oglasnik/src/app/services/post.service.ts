import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private readonly baseUrl: string = 'http://localhost:5000/route';
  private apiUrl = 'http://localhost:3000/api/posts';
  private readonly headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private http: HttpClient, private router: Router) {}

  private get httpOptions() {
    return { headers: this.headers };
  }

  getPostbyId(postId: number) {
    return this.http.get<any>(
      `${this.baseUrl}/post/${postId}`,
      this.httpOptions
    );
  }

  getPosts() {
    return this.http.get<any>(`${this.baseUrl}/getPosts`, this.httpOptions);
  }

  getPostsStatisticts() {
    return this.http.get<any>(
      `${this.baseUrl}/getPostsStatistics`,
      this.httpOptions
    );
  }

  getPostsByParentCategoryId(parentCategoryId: number) {
    return this.http.get<any>(
      `${this.baseUrl}/getPostsParentCategory/${parentCategoryId}`,
      this.httpOptions
    );
  }

  getPostsByCategoryId(categoryId: number) {
    return this.http.get<any>(
      `${this.baseUrl}/getPostsCategory/${categoryId}`,
      this.httpOptions
    );
  }

  filterPosts(userId: number) {
    return this.http.get<any>(
      `${this.baseUrl}/filter/${userId}`,
      this.httpOptions
    );
  }

  deletePost(postId: number) {
    return this.http.delete<any>(
      `${this.baseUrl}/deletePost/${postId}`,
      this.httpOptions
    );
  }

  updatePost({
    id,
    cijena,
    grad,
    korisnik_id,
    naslov,
    opis,
  }: {
    id: number;
    cijena: number;
    grad: number;
    korisnik_id: number;
    naslov: string;
    opis: string;
  }) {
    return this.http.put<any>(
      `${this.baseUrl}/updatePost`,
      {
        id,
        cijena,
        grad,
        korisnik_id,
        naslov,
        opis,
      },
      this.httpOptions
    );
  }

  addPost({
    cijena,
    grad,
    kategorija,
    korisnik_id,
    naslov,
    opis,
  }: {
    cijena: number;
    grad: number;
    kategorija: number;
    korisnik_id: number;
    naslov: string;
    opis: string;
  }) {
    return this.http.post<any>(
      `${this.baseUrl}/createPost`,
      {
        cijena,
        grad,
        kategorija,
        korisnik_id,
        naslov,
        opis,
      },
      this.httpOptions
    );
  }
}
