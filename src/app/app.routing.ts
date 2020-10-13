import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { PagesComponent } from '../app/pages/pages.component';
import { ErrorComponent } from '../app/pages/others/errors/error/error.component';
import { NotFoundComponent } from '../app/pages/others/errors/not-found/not-found.component';
// import { AuthGuard } from './core/guards/auth.guard';
import { BlankComponent } from '../app/pages/others/blank/blank.component';

export const routes: Routes = [
  { path: '', redirectTo: 'blank', pathMatch: 'full' },
  {
    path: 'blank',
    data: { breadcrumb: '' },
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
    data: { breadcrumb: 'About' },
    component: PagesComponent,
    // canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/pages/about/about.module').then(m => m.AboutModule)
      },
    ],
  },
  {
    path: 'home',
    data: { breadcrumb: 'Home' },
    component: PagesComponent,
    // canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/pages/home/home.module').then(m => m.HomeModule)
      },
    ],
  },
  { path: 'error', component: ErrorComponent, data: { breadcrumb: 'Error' } },
  { path: '**', component: NotFoundComponent },
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, {
  preloadingStrategy: PreloadAllModules,
});
