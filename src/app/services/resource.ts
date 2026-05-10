import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Book, OpenLibraryResponse } from '../models/book.model';

@Injectable({ providedIn: 'root' })
export class ResourceService {
  private readonly API_URL = 'https://openlibrary.org/search.json';

  isLoading = signal(false);

  private fallbackBooks: Book[] = [
    {
      key: '/works/OL82563W',
      title: 'The Pragmatic Programmer',
      authors: 'David Thomas, Andrew Hunt',
      year: 2019,
      cover: 'https://covers.openlibrary.org/b/id/8739161-M.jpg',
      link: 'https://openlibrary.org/works/OL82563W',
      description: 'A guide to becoming a better software developer'
    },
    {
      key: '/works/OL7841855W',
      title: 'Clean Code',
      authors: 'Robert C. Martin',
      year: 2008,
      cover: 'https://covers.openlibrary.org/b/id/8085420-M.jpg',
      link: 'https://openlibrary.org/works/OL7841855W',
      description: 'How to write clean, readable, and maintainable code'
    }
  ];

  constructor(private http: HttpClient) {}

  searchBooks(query: string): Observable<Book[]> {
    const url = `${this.API_URL}?q=${encodeURIComponent(query)}&limit=16&fields=key,title,author_name,first_publish_year,cover_i`;

    return this.http.get<OpenLibraryResponse>(url).pipe(
      map(data =>
        data.docs.map(b => ({
          key: b.key,
          title: b.title,
          authors: b.author_name
            ? b.author_name.slice(0, 2).join(', ')
            : 'Unknown Author',
          year: b.first_publish_year || '',
          cover: b.cover_i
            ? `https://covers.openlibrary.org/b/id/${b.cover_i}-M.jpg`
            : '',

          // ✅ clickable link
          link: `https://openlibrary.org${b.key}`,

          // ✅ fallback description
          description: 'Click to view full details on Open Library'
        }))
      ),
      catchError(() => of(this.fallbackBooks))
    );
  }

  getFeaturedBooks(): Observable<Book[]> {
    return this.searchBooks('programming education');
  }

  getBookDetail(id: string): Observable<any> {
    return this.http.get(`https://openlibrary.org/works/${id}.json`).pipe(
      catchError(() => of(null))
    );
  }
}