import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { BlankComponent } from './blank.component';

export const routes = [
  {
    path: '',
    component: BlankComponent,
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
  declarations: [BlankComponent],
})
export class BlankModule { }
