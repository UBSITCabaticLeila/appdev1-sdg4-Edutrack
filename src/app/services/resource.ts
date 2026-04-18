import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Book, OpenLibraryResponse } from '../models/book.model';

@Injectable({ providedIn: 'root' })
export class ResourceService {
  private readonly API_URL = 'https://openlibrary.org/search.json';
  
  // Angular Signal — tracks loading state globally
  isLoading = signal(false);

  private fallbackBooks: Book[] = [
    { key: '/works/OL82563W', title: 'The Pragmatic Programmer',
      authors: 'David Thomas, Andrew Hunt', year: 2019,
      cover: 'https://covers.openlibrary.org/b/id/8739161-M.jpg' },
    { key: '/works/OL7841855W', title: 'Clean Code',
      authors: 'Robert C. Martin', year: 2008,
      cover: 'https://covers.openlibrary.org/b/id/8085420-M.jpg' },
    { key: '/works/OL1966820W', title: 'Introduction to Algorithms',
      authors: 'Thomas H. Cormen et al.', year: 2022,
      cover: 'https://covers.openlibrary.org/b/id/12706812-M.jpg' },
    { key: '/works/OL71185W', title: 'Computer Networks',
      authors: 'Andrew Tanenbaum', year: 2011,
      cover: 'https://covers.openlibrary.org/b/id/7222246-M.jpg' },
    { key: '/works/OL25441W', title: 'Database System Concepts',
      authors: 'Abraham Silberschatz', year: 2019,
      cover: 'https://covers.openlibrary.org/b/id/10518418-M.jpg' },
    { key: '/works/OL7833986W', title: 'Operating System Concepts',
      authors: 'Abraham Silberschatz', year: 2018,
      cover: 'https://covers.openlibrary.org/b/id/10521985-M.jpg' },
  ];

  constructor(private http: HttpClient) {}

  // Working API call — Open Library (Check-in 2)
  searchBooks(query: string): Observable<Book[]> {
    const url = `${this.API_URL}?q=${encodeURIComponent(query)}&limit=16&fields=key,title,author_name,first_publish_year,cover_i`;
    return this.http.get<OpenLibraryResponse>(url).pipe(
      map(data => data.docs.map(b => ({
        key: b.key,
        title: b.title,
        authors: b.author_name ? b.author_name.slice(0, 2).join(', ') : 'Unknown Author',
        year: b.first_publish_year || '',
        cover: b.cover_i ? `https://covers.openlibrary.org/b/id/${b.cover_i}-M.jpg` : '',
      }))),
      catchError(() => of(this.fallbackBooks))
    );
  }

  getFeaturedBooks(): Observable<Book[]> {
    return this.searchBooks('education quality learning');
  }
}