import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Dashboard } from './features/partidos/dashboard/dashboard';
import { CrearPartido } from './features/partidos/crear-partido/crear-partido';
import { Perfil } from './features/perfil/perfil';
import { MainLayout } from './core/layout/main-layout/main-layout';
import { AuthGuard } from './core/guards/auth/auth-guard';
import { NotFound } from './shared/components/not-found/not-found';

export const routes: Routes = [
  { path: '', redirectTo: 'app/dashboard', pathMatch: 'full' },
  { path: 'login', component: Login },

  {
    path: 'app',
    component: MainLayout,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'crear-partido', component: CrearPartido },
      { path: 'perfil', component: Perfil },
    ],
  },

  { path: '**', component: NotFound },
];
