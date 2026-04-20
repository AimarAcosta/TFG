import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Dashboard } from './features/partidos/dashboard/dashboard';
import { AuthGuard } from './core/guards/auth/auth-guard';
import { NotFound } from './shared/components/not-found/not-found';
import { CrearPartido } from './features/partidos/crear-partido/crear-partido';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'dashboard', component: Dashboard, canActivate: [AuthGuard] },
  { path: 'crear-partido', component: CrearPartido, canActivate: [AuthGuard] },
  { path: '**', component: NotFound }
];