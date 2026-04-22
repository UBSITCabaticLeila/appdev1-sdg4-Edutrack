import { Component, computed, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Subject {
  name: string;
  chapter: number;
  total: number;
  progress: number;
  color: string;
  updated: string;
}

interface Goal {
  text: string;
  done: boolean;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'] // ✅ FIXED
})
export class DashboardComponent implements OnDestroy {

  // ── Auth ──────────────────────────────────────────
  isLoggedIn = signal(false);
  currentUser = signal('Guest');

  getUserInitial(): string {
    const name = this.currentUser();
    return name ? name.charAt(0).toUpperCase() : '?';
  }

  signOut() {
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

  hasUnsavedChanges(): boolean {
    return this.pomoRunning() || this.showAddSubjectModal || this.showAddGoalModal;
  }

  onOverlayClick(event: MouseEvent, modal: 'subject' | 'goal') {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      modal === 'subject' ? this.closeAddSubject() : this.closeAddGoal();
    }
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