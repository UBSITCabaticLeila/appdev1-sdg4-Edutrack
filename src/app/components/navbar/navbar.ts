import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {
  isLoggedIn = signal(localStorage.getItem('edutrack_user') !== null);
  currentUser = signal(localStorage.getItem('edutrack_user') || '');
  showModal = signal(false);
  email = '';
  password = '';
  errorMsg = '';

  constructor(private router: Router) {}

  openLogin(): void {
    this.showModal.set(true);
    this.errorMsg = '';
    this.email = '';
    this.password = '';
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  signIn(): void {
    if (!this.email || !this.email.includes('@')) {
      this.errorMsg = 'Please enter a valid email address.';
      return;
    }
    if (!this.password || this.password.length < 6) {
      this.errorMsg = 'Password must be at least 6 characters.';
      return;
    }
    localStorage.setItem('edutrack_user', this.email);
    this.isLoggedIn.set(true);
    this.currentUser.set(this.email);
    this.showModal.set(false);
    this.router.navigate(['/dashboard']);
  }

  signOut(): void {
    localStorage.removeItem('edutrack_user');
    this.isLoggedIn.set(false);
    this.currentUser.set('');
    this.router.navigate(['/home']);
  }
}