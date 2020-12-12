import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { PagesComponent } from '../app/pages/pages.component';
import { ErrorComponent } from '../app/pages/others/errors/error/error.component';
import { NotFoundComponent } from '../app/pages/others/errors/not-found/not-found.component';
// import { AuthGuard } from './core/guards/auth.guard';
import { BlankComponent } from '../app/pages/others/blank/blank.component';
import { VolunteersComponent } from './pages/about/volunteers/volunteers.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'blank',
    data: { title: 'Em Blanco' },
    component: PagesComponent,
    // canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/pages/others/blank/blank.module').then(m => m.BlankModule)
      },
    ],
  },
  {
    path: 'about',
    data: { title: 'Acerca de' },
    component: PagesComponent,
    // canActivate: [AuthGuard],
    children: [
      {
        path: '',
        data: {},
        loadChildren: () => import('src/app/pages/about/about.module').then(m => m.AboutModule)
      },
    ],
  },
  {
    path: 'about/volunteers',
    data: { title: 'Voluntarios' },
    component: PagesComponent,
    // canActivate: [AuthGuard],
    children: [
      {
        path: '',
        data: {},
        loadChildren: () => import('src/app/pages/about/volunteers/volunteers.module').then(m => m.VolunteersModule)
      },
    ],
  },
  
  {
    path: 'home',
    data: { title: 'Inicio' },
    component: PagesComponent,
    // canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/pages/home/home.module').then(m => m.HomeModule)
      },
    ],
  },
  {
    path: 'schedule',
    data: { title: 'Programación' },
    component: PagesComponent,
    // canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/pages/schedule/schedule.module').then(m => m.ScheduleModule)
      },
    ],
  },
  {
    path: 'episodes',
    data: { title: 'Episodios' },
    component: PagesComponent,
    // canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/pages/episodes/episodes.module').then(m => m.EpisodesModule)
      },
    ],
  },
  {
    path: 'downloads',
    data: { title: 'Descargas' },
    component: PagesComponent,
    // canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/pages/downloads/downloads.module').then(m => m.DownloadsModule)
      },
    ],
  },
  { path: 'error', component: ErrorComponent, data: { title: 'Error' } },
  { path: '**', component: NotFoundComponent,  data: { title: 'Página no encontrada' } },
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, {
  preloadingStrategy: PreloadAllModules,
});
