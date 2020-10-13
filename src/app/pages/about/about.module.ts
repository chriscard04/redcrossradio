import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { AboutComponent } from './about.component';
import { MisionComponent } from './mision/mision.component';
import { VisionComponent } from './vision/vision.component';

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
    FormsModule,
    SharedModule,
  ],
  declarations: [AboutComponent],
})
export class AboutModule { }
