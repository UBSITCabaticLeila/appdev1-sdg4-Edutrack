import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Subject {
  name: string;
  chapter: number;
  total: number;
  progress: number;
  color: string;
  updated: string;
}

@Component({
  selector: 'app-subject-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subject-card.html',
  styleUrl: './subject-card.css'
})
export class SubjectCardComponent {
  @Input() subject!: Subject;
  @Output() progressUpdated = new EventEmitter<string>();

  onUpdate() {
    this.progressUpdated.emit(this.subject.name);
  }
}