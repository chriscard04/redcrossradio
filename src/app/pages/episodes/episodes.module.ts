import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { EpisodesComponent } from './episodes.component';

export const routes = [
  {
    path: '',
    component: EpisodesComponent,
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
  declarations: [EpisodesComponent],
})
export class EpisodesModule { }
