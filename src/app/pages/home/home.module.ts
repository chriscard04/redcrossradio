import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { HomeComponent } from './home.component';

export const routes = [
  {
    path: '',
    component: HomeComponent,
    data: {},
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    SharedModule,
  ],
  declarations: [HomeComponent],
})
export class HomeModule { }
