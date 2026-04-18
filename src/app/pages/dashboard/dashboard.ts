import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ResourceService } from '../../services/resource';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {

  // Angular Signals
  searchQuery = signal('');
  selectedBook = signal<Book | null>(null);
  isLoading = signal(false);
  activeSection = signal('subjects');
  pomoRunning = signal(false);
  pomoSeconds = signal(25 * 60);
  pomoBreak = signal(false);
  pomosCompleted = signal(4);

  // Computed signals
  hasSelectedBook = computed(() => this.selectedBook() !== null);
  pomoDisplay = computed(() => {
    const s = this.pomoSeconds();
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
  });

  private pomoInterval: any;

  today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  greeting = this.getGreeting();

  subjects = [
    { name: 'APPDEV1 — Angular Development', chapter: 7, total: 12, updated: 'Updated today', color: '#1b6e4e', progress: 58 },
    { name: 'Database Management Systems', chapter: 4, total: 10, updated: 'Updated yesterday', color: '#d97706', progress: 40 },
    { name: 'Computer Networks', chapter: 2, total: 8, updated: '3 days ago', color: '#be4c6e', progress: 25 },
    { name: 'Human Computer Interaction', chapter: 6, total: 8, updated: 'Updated today', color: '#7c6fd4', progress: 75 },
  ];

  goals = [
    { text: 'Review Angular routing docs', done: true },
    { text: 'Read 2 chapters of DBMS', done: true },
    { text: 'Finish wireframe sketch', done: true },
    { text: 'Complete unit test for NavbarComponent', done: false },
    { text: 'Push to GitHub with proper commit message', done: false },
  ];

  weekDays = ['M','T','W','Th','F','S','Su'];
  activeDays = [0,1,2,3,4]; // Mon-Fri active

  quotes = [
    { text: '"The roots of education are bitter, but the fruit is sweet."', author: '— Aristotle' },
    { text: '"Education is the most powerful weapon which you can use to change the world."', author: '— Nelson Mandela' },
    { text: '"The beautiful thing about learning is that no one can take it away from you."', author: '— B.B. King' },
  ];
  currentQuote = this.quotes[0];

  constructor(private resourceService: ResourceService) {}

  ngOnInit(): void {}

  getGreeting(): string {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  }

  setSection(s: string): void {
    this.activeSection.set(s);
  }

  toggleGoal(i: number): void {
    this.goals[i].done = !this.goals[i].done;
  }

  togglePomo(): void {
    if (this.pomoRunning()) {
      clearInterval(this.pomoInterval);
      this.pomoRunning.set(false);
    } else {
      this.pomoRunning.set(true);
      this.pomoInterval = setInterval(() => {
        if (this.pomoSeconds() <= 0) {
          clearInterval(this.pomoInterval);
          this.pomoRunning.set(false);
          this.pomosCompleted.update(v => v + 1);
          this.pomoSeconds.set(25 * 60);
        } else {
          this.pomoSeconds.update(v => v - 1);
        }
      }, 1000);
    }
  }

  resetPomo(): void {
    clearInterval(this.pomoInterval);
    this.pomoRunning.set(false);
    this.pomoSeconds.set(25 * 60);
  }

  hasUnsavedChanges(): boolean {
    return this.searchQuery() !== '';
  }

  ngOnDestroy(): void {
    clearInterval(this.pomoInterval);
  }
}