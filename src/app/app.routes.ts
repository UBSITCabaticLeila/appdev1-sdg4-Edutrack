import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { BooksComponent } from './pages/books/books';
import { DetailComponent } from './pages/detail/detail';
import { AboutComponent } from './pages/about/about';
import { NotFoundComponent } from './pages/not-found/not-found';
import { Sdg4Component } from './pages/sdg4/sdg4';
import { authGuard } from './guards/auth.guard';
import { unsavedGuard } from './guards/unsaved.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
    canDeactivate: [unsavedGuard]
  },
  { path: 'books', component: BooksComponent },
  { path: 'detail/:id', component: DetailComponent },
  { path: 'about', component: AboutComponent },
  { path: 'sdg4', component: Sdg4Component },
  { path: '**', component: NotFoundComponent }
];