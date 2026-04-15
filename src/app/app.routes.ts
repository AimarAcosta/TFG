import { Routes } from '@angular/router';
import { MainLayoutComponent } from './core/layout/main-layout/main-layout';
import { Login } from './features/auth/login/login';
import { Dashboard } from './features/partidos/dashboard/dashboard';
import { NotFound } from './shared/components/not-found/not-found';
import { authGuard } from './core/guards/auth/auth-guard';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
      
    ]
  },
  {
    path: 'login',
    component: Login
  },
  { 
    path: '**', 
    component: NotFound
  }
];