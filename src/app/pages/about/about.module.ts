import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../../shared/shared.module';
import { AboutComponent } from './about.component';
import { MisionComponent } from './mision/mision.component';
import { VisionComponent } from './vision/vision.component';
import { ContactService } from './contact.service';

export const routes = [
  {
    path: '',
    component: AboutComponent,
    data: { breadcrumb: '' },
  },
  {
    path: 'mision',
    component: MisionComponent,
    data: { breadcrumb: '' },
  },
  {
    path: 'vision',
    component: VisionComponent,
    data: { breadcrumb: '' },
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [AboutComponent],
  providers: [
    ContactService
  ]
})
export class AboutModule { }
