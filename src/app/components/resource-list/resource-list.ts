import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-resource-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resource-list.html',
  styleUrl: './resource-list.css'
})
export class ResourceListComponent {
  // @Input — receives books from parent (Check-in 3)
  @Input() books: Book[] = [];
  @Input() isLoading: boolean = false;

  // @Output — emits selected book to parent (Check-in 3)
  @Output() bookSelected = new EventEmitter<Book>();

  selectBook(book: Book): void {
    this.bookSelected.emit(book);
    window.open(`https://openlibrary.org${book.key}`, '_blank');
  }
}