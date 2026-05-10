import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ResourceService } from '../../services/resource';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './books.html',
  styleUrl: './books.css'
})
export class BooksComponent implements OnInit, OnDestroy {
  private resource = inject(ResourceService);
  private sub: Subscription | null = null;

  searchQuery = signal('');
  isLoading = signal(false);
  activeCategory = signal('💻 Computer Science');
  books = signal<Book[]>([]);

  categories = [
    { label: '💻 Computer Science', term: 'computer science' },
    { label: '📐 Mathematics', term: 'mathematics' },
    { label: '🖥️ Programming', term: 'programming' },
    { label: '🗄️ Database Systems', term: 'database systems' },
    { label: '🌐 Networking', term: 'networking' },
    { label: '🌐 Web Dev', term: 'web development' },
    { label: '🎓 Education', term: 'education' },
  ];

  ngOnInit() {
    this.loadBooks('computer science', '💻 Computer Science');
  }

  private loadBooks(query: string, categoryLabel?: string) {
    // Cancel previous request
    this.sub?.unsubscribe();

    this.isLoading.set(true);
    this.books.set([]);
    if (categoryLabel) this.activeCategory.set(categoryLabel);

    this.sub = this.resource.searchBooks(query).pipe(
      catchError(() => of([]))
    ).subscribe({
      next: (data) => {
        this.books.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.books.set([]);
        this.isLoading.set(false);
      }
    });
  }

  onSearch(query: string) {
    const q = query.trim();
    if (!q) return;
    this.searchQuery.set(q);
    this.activeCategory.set('');
    this.loadBooks(q);
  }

  onKeydown(event: KeyboardEvent, query: string) {
    if (event.key === 'Enter') this.onSearch(query);
  }

  onCategory(term: string, label: string) {
    this.loadBooks(term, label);
  }

  getDetailUrl(book: Book): string {
    return book.link ?? `https://openlibrary.org${book.key}`;
  }

  trackByKey(_: number, book: Book): string {
    return book.key;
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}