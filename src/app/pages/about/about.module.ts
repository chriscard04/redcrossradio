import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../../shared/shared.module';
import { AboutComponent } from './about.component';
import { ContactService } from './contact.service';

export const routes = [
  {
    path: '',
    data: { title: 'Acerca de | Cruz Roja Radio'  },
    component: AboutComponent,
  }
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
