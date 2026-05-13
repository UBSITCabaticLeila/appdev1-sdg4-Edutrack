import { Component, computed, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SubjectCardComponent, Subject } from '../../components/subject-card/subject-card';
import { ResourceListComponent } from '../../components/resource-list/resource-list';
import { ResourceService } from '../../services/resource';
import { Book } from '../../models/book.model';

interface Goal {
  text: string;
  done: boolean;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, SubjectCardComponent, ResourceListComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  // ── HTTP / API ────────────────────────────────────
  featuredBooks: Book[] = [];
  searchQuery = signal('');
  hasSearched = signal(false);

  constructor(private resourceService: ResourceService) {}

  ngOnInit(): void {
    this.loadFeaturedBooks();
  }

  // Load featured books on dashboard init (HTTP GET via ResourceService)
  loadFeaturedBooks(): void {
    this.resourceService.isLoading.set(true);
    this.resourceService.getFeaturedBooks().subscribe({
      next: (books: Book[]) => {
        this.featuredBooks = books;
        this.resourceService.isLoading.set(false);
      },
      error: () => {
        this.resourceService.isLoading.set(false);
      }
    });
  }

  // Search books by query (HTTP GET via ResourceService)
  onSearch(): void {
    const query = this.searchQuery().trim();
    if (!query) return;

    this.hasSearched.set(true);
    this.resourceService.isLoading.set(true);

    this.resourceService.searchBooks(query).subscribe({
      next: (books: Book[]) => {
        this.featuredBooks = books;
        this.resourceService.isLoading.set(false);
      },
      error: () => {
        this.resourceService.isLoading.set(false);
      }
    });
  }

  onBookSelected(book: Book): void {
    console.log('Book selected from dashboard:', book.title);
  }

  get isLoading(): boolean {
    return this.resourceService.isLoading();
  }

  // hasUnsavedChanges now also checks for active search (used by unsavedGuard)
  hasUnsavedChanges(): boolean {
    return this.pomoRunning() || this.showAddSubjectModal || this.showAddGoalModal || this.hasSearched();
  }

  // ── Auth ──────────────────────────────────────────
  isLoggedIn = signal(localStorage.getItem('edutrack_user') !== null);
  currentUser = signal(localStorage.getItem('edutrack_user') || 'Guest');

  getUserInitial(): string {
    const name = this.currentUser();
    return name ? name.charAt(0).toUpperCase() : '?';
  }

  signOut() {
    localStorage.removeItem('edutrack_user');
    this.isLoggedIn.set(false);
    this.currentUser.set('Guest');
  }

  // ── Greeting & Date ───────────────────────────────
  get greeting(): string {
    const h = new Date().getHours();
    return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  }

  get today(): string {
    return new Date().toLocaleDateString('en-PH', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  }

  activeSection = signal('overview');

  setSection(section: string) {
    this.activeSection.set(section);
  }

  private readonly quotes = [
    { text: '"The roots of education are bitter, but the fruit is sweet."', author: '— Aristotle' },
    { text: '"Education is the most powerful weapon which you can use to change the world."', author: '— Nelson Mandela' },
    { text: '"The beautiful thing about learning is that no one can take it away from you."', author: '— B.B. King' },
    { text: '"An investment in knowledge pays the best interest."', author: '— Benjamin Franklin' },
    { text: '"Education is not the filling of a pail, but the lighting of a fire."', author: '— W.B. Yeats' },
  ];

  currentQuote = this.quotes[Math.floor(Math.random() * this.quotes.length)];

  subjects: Subject[] = [
    { name: 'APPDEV1 — Angular Development', chapter: 7, total: 12, progress: 58, color: '#1b6e4e', updated: 'Updated today' },
    { name: 'Database Management Systems', chapter: 4, total: 10, progress: 40, color: '#d97706', updated: 'Updated yesterday' },
    { name: 'Computer Networks', chapter: 2, total: 8, progress: 25, color: '#be4c6e', updated: '3 days ago' },
    { name: 'Human Computer Interaction', chapter: 6, total: 8, progress: 75, color: '#7c6fd4', updated: 'Updated today' },
  ];

  private readonly subjectColors = ['#1b6e4e','#d97706','#be4c6e','#7c6fd4','#0284c7','#dc2626'];
  private colorIdx = 4;

  showAddSubjectModal = false;
  newSubject = { name: '', total: null as number | null, chapter: null as number | null };

  openAddSubject() {
    this.newSubject = { name: '', total: null, chapter: null };
    this.showAddSubjectModal = true;
  }

  closeAddSubject() {
    this.showAddSubjectModal = false;
  }

  submitSubject() {
    const name = this.newSubject.name.trim();
    if (!name) return;
    const total = this.newSubject.total ?? 10;
    const chapter = this.newSubject.chapter ?? 0;
    const progress = Math.round(Math.min((chapter / total) * 100, 100));
    const color = this.subjectColors[this.colorIdx % this.subjectColors.length];
    this.colorIdx++;
    this.subjects.push({ name, chapter, total, progress, color, updated: 'Just now' });
    this.closeAddSubject();
  }

  // ── @Output() handler from SubjectCardComponent ───
  onProgressUpdated(subjectName: string) {
    const subject = this.subjects.find(s => s.name === subjectName);
    if (subject) subject.updated = 'Just now';
  }

  goals: Goal[] = [
    { text: 'Review Angular routing docs', done: true },
    { text: 'Read 2 chapters of DBMS', done: true },
    { text: 'Finish wireframe sketch', done: true },
    { text: 'Complete unit test for NavbarComponent', done: false },
    { text: 'Push to GitHub with proper commit message', done: false },
  ];

  completedGoals = computed(() => this.goals.filter(g => g.done).length);

  toggleGoal(index: number) {
    this.goals[index].done = !this.goals[index].done;
  }

  showAddGoalModal = false;
  newGoalText = '';

  openAddGoal() {
    this.newGoalText = '';
    this.showAddGoalModal = true;
  }

  closeAddGoal() {
    this.showAddGoalModal = false;
  }

  submitGoal() {
    const text = this.newGoalText.trim();
    if (!text) return;
    this.goals.push({ text, done: false });
    this.closeAddGoal();
  }

  onOverlayClick(event: MouseEvent, modal: 'subject' | 'goal') {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      modal === 'subject' ? this.closeAddSubject() : this.closeAddGoal();
    }
  }

  // ── Motivation Quotes ─────────────────────────────
  motivationQuotes = [
    { text: 'The secret of getting ahead is getting started.', author: 'Mark Twain', emoji: '🚀' },
    { text: "It always seems impossible until it's done.", author: 'Nelson Mandela', emoji: '💪' },
    { text: 'Success is the sum of small efforts repeated day in and day out.', author: 'Robert Collier', emoji: '✨' },
    { text: "Don't watch the clock; do what it does. Keep going.", author: 'Sam Levenson', emoji: '⏰' },
    { text: "Believe you can and you're halfway there.", author: 'Theodore Roosevelt', emoji: '🌟' },
    { text: "You don't have to be great to start, but you have to start to be great.", author: 'Zig Ziglar', emoji: '🎯' },
    { text: 'The future belongs to those who believe in the beauty of their dreams.', author: 'Eleanor Roosevelt', emoji: '🌈' },
  ];

  currentMotivationIndex = signal(Math.floor(Math.random() * 7));

  get currentMotivation() {
    return this.motivationQuotes[this.currentMotivationIndex()];
  }

  nextQuote() {
    this.currentMotivationIndex.update(i => (i + 1) % this.motivationQuotes.length);
  }

  copyQuote() {
    const q = this.currentMotivation;
    navigator.clipboard.writeText(`"${q.text}" — ${q.author}`);
    this.showCopied.set(true);
    setTimeout(() => this.showCopied.set(false), 2000);
  }

  showCopied = signal(false);

  // ── Achievements ──────────────────────────────────
  achievements = [
    { id: 1, icon: '🔥', title: 'First Streak', desc: 'Study 3 days in a row', unlocked: true },
    { id: 2, icon: '📚', title: 'Bookworm', desc: 'Search 5 books', unlocked: true },
    { id: 3, icon: '⏱️', title: 'Focus Mode', desc: 'Complete 4 Pomodoros', unlocked: false },
    { id: 4, icon: '🎯', title: 'Goal Crusher', desc: 'Complete all daily goals', unlocked: false },
    { id: 5, icon: '📖', title: 'Chapter Master', desc: 'Finish a subject', unlocked: false },
    { id: 6, icon: '🏆', title: '7-Day Warrior', desc: 'Study 7 days straight', unlocked: false },
  ];

  get unlockedCount() {
    return this.achievements.filter(a => a.unlocked).length;
  }

  // ── Pomodoro ──────────────────────────────────────
  pomoRunning = signal(false);
  pomoBreak = signal(false);
  pomoSeconds = signal(25 * 60);
  pomosCompleted = signal(0);

  private readonly FOCUS_TIME = 25 * 60;
  private readonly BREAK_TIME = 5 * 60;
  private pomoInterval: ReturnType<typeof setInterval> | null = null;

  pomoDisplay = computed(() => {
    const m = Math.floor(this.pomoSeconds() / 60);
    const s = this.pomoSeconds() % 60;
    return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  });

  togglePomo() {
    if (this.pomoRunning()) {
      if (this.pomoInterval) {
        clearInterval(this.pomoInterval);
        this.pomoInterval = null;
      }
      this.pomoRunning.set(false);
    } else {
      this.pomoRunning.set(true);
      this.pomoInterval = setInterval(() => {
        if (this.pomoSeconds() > 0) {
          this.pomoSeconds.update(s => s - 1);
        } else {
          if (this.pomoInterval) {
            clearInterval(this.pomoInterval);
            this.pomoInterval = null;
          }
          this.pomoRunning.set(false);
          if (!this.pomoBreak()) {
            this.pomosCompleted.update(n => n + 1);
            this.pomoBreak.set(true);
            this.pomoSeconds.set(this.BREAK_TIME);
          } else {
            this.pomoBreak.set(false);
            this.pomoSeconds.set(this.FOCUS_TIME);
          }
        }
      }, 1000);
    }
  }

  resetPomo() {
    if (this.pomoInterval) {
      clearInterval(this.pomoInterval);
      this.pomoInterval = null;
    }
    this.pomoRunning.set(false);
    this.pomoBreak.set(false);
    this.pomoSeconds.set(this.FOCUS_TIME);
  }

  ngOnDestroy() {
    if (this.pomoInterval) {
      clearInterval(this.pomoInterval);
    }
  }

  weekDays = ['M', 'T', 'W', 'Th', 'F', 'S', 'Su'];
  activeDays = [0, 1, 2, 3, 4];
}